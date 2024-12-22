import { Request, Response } from 'express';
import  Order  from '../models/order.model';
import  OrderItem  from '../models/order-items.model';
import { Payment, PaymentMethod, PaymentStatus } from '../models/payment.model';
import { OrderStatus } from '../models/order.model';
import { Transaction } from 'sequelize';
import sequelize from '../config/database';

interface CreateOrderRequest {
    user_id: number;
    total_amount: number;
    expected_delivery_date?: Date;
    coupon_id?: number;
    discount_amount?: number;
    items: Array<{
        variant_id: number;
        quantity: number;
        price_at_time: number;
    }>;
    payment?: {
        method: PaymentMethod;
        transaction_id?: string;
        stripe_payment_intent_id?: string;
    };
}

interface UpdateOrderStatusRequest {
    status: OrderStatus;
}

class OrderController {
    public async getAllOrders(req: Request, res: Response): Promise<Response> {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: OrderItem,
                        required: false
                    },
                    {
                        model: Payment,
                        required: false
                    }
                ]
            });

            return res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch orders',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    public async getOrderById(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order ID'
                });
            }

            const order = await Order.findByPk(id, {
                include: [
                    {
                        model: OrderItem,
                        required: false
                    },
                    {
                        model: Payment,
                        required: false
                    }
                ]
            });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            console.error('Error fetching order:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch order',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    public async createOrder(req: Request<{}, {}, CreateOrderRequest>, res: Response): Promise<Response> {
        const t: Transaction = await sequelize.transaction();

        try {
            const {
                user_id,
                total_amount,
                expected_delivery_date,
                coupon_id,
                discount_amount,
                items,
                payment
            } = req.body;

            if (!user_id || !total_amount || !items?.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: user_id, total_amount, and items are required'
                });
            }

            const now = new Date();

            // Create order
            const order = await Order.create({
                user_id,
                total_amount,
                order_date: now,
                expected_delivery_date: expected_delivery_date ? new Date(expected_delivery_date) : now,
                status: OrderStatus.PENDING,
                coupon_id,
                discount_amount: discount_amount || 0,
                created_at: now,
                updated_at: now
            } as Order, { transaction: t });

            // Create order items
            const orderItems = items.map(item => ({
                order_id: order.id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price_at_time: item.price_at_time
            }));

            await OrderItem.bulkCreate(orderItems, { transaction: t });

            // Create payment if provided
            if (payment) {
                await Payment.create({
                    order_id: order.id,
                    amount: total_amount,
                    method: payment.method,
                    payment_status: PaymentStatus.PENDING,
                    transaction_id: payment.transaction_id,
                    stripe_payment_intent_id: payment.stripe_payment_intent_id,
                    created_at: now
                } as Payment, { transaction: t });
            }

            await t.commit();

            const createdOrder = await Order.findByPk(order.id, {
                include: [
                    {
                        model: OrderItem,
                        required: false
                    },
                    {
                        model: Payment,
                        required: false
                    }
                ]
            });

            return res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: createdOrder
            });
        } catch (error) {
            await t.rollback();
            console.error('Error creating order:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create order',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    public async updateOrderStatus(
        req: Request<{ id: string }, {}, UpdateOrderStatusRequest>,
        res: Response
    ): Promise<Response> {
        const t: Transaction = await sequelize.transaction();

        try {
            const id = parseInt(req.params.id, 10);
            const { status } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order ID'
                });
            }

            if (!Object.values(OrderStatus).includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order status'
                });
            }

            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Update order status
            await order.update({ status, updated_at: new Date() }, { transaction: t });

            // If order is marked as paid, update payment status
            if (status === OrderStatus.PAID) {
                const payment = await Payment.findOne({ where: { order_id: id } });
                if (payment) {
                    await payment.update(
                        {
                            payment_status: PaymentStatus.COMPLETED,
                            payment_date: new Date()
                        },
                        { transaction: t }
                    );
                }
            }

            await t.commit();

            const updatedOrder = await Order.findByPk(id, {
                include: [
                    {
                        model: OrderItem,
                        required: false
                    },
                    {
                        model: Payment,
                        required: false
                    }
                ]
            });

            return res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                data: updatedOrder
            });
        } catch (error) {
            await t.rollback();
            console.error('Error updating order status:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update order status',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    
    // // In OrderController.ts
    // public async updateOrderAfterPayment(
    //     orderId: number,
    //     paymentDetails: {
    //     method: PaymentMethod;
    //     transaction_id: string;
    //     amount: number;
    //     }
    // ): Promise<Response> {
    //     const t: Transaction = await sequelize.transaction();
    
    //     try {
    //     const order = await Order.findByPk(orderId);
    //     if (!order) {
    //         throw new Error('Order not found');
    //     }
    
    //     // Update order status
    //     await order.update(
    //         { 
    //         status: OrderStatus.PAID,
    //         updated_at: new Date()
    //         },
    //         { transaction: t }
    //     );
    
    //     // Create payment record
    //     await Payment.create(
    //         {
    //         order_id: orderId,
    //         amount: paymentDetails.amount,
    //         method: paymentDetails.method,
    //         payment_status: PaymentStatus.COMPLETED,
    //         transaction_id: paymentDetails.transaction_id,
    //         payment_date: new Date(),
    //         created_at: new Date()
    //         },
    //         { transaction: t }
    //     );
    
    //     await t.commit();
    //     return order;
    //     } catch (error) {
    //     await t.rollback();
    //     throw error;
    //     }
    // }
    public async deleteOrder(req: Request, res: Response): Promise<Response> {
        const t: Transaction = await sequelize.transaction();

        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order ID'
                });
            }

            await Payment.destroy({ where: { order_id: id }, transaction: t });
            await OrderItem.destroy({ where: { order_id: id }, transaction: t });
            
            const deletedCount = await Order.destroy({
                where: { id },
                transaction: t
            });

            if (!deletedCount) {
                await t.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            await t.commit();

            return res.status(200).json({
                success: true,
                message: 'Order and related records deleted successfully'
            });
        } catch (error) {
            await t.rollback();
            console.error('Error deleting order:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete order',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}

export default OrderController;