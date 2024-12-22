import stripe from '../config/payment/stripe';
import paypalClient from '../config/payment/paypal';
import { Payment, PaymentStatus, PaymentMethod } from '../models/payment.model';
import Order, { OrderStatus } from '../models/order.model';
import paypal from '@paypal/checkout-server-sdk';
import { AppError } from '../middleware/error.middleware';

export class PaymentService {
    async createPaymentIntent(orderId: number): Promise<{ clientSecret: string, paymentId: number }> {
        const order = await Order.findByPk(orderId);
        
        if (!order) {
            throw new AppError('Order not found', 404);
        }
        const amount = Math.round(Number(order.total_amount) * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: {
                order_id: orderId.toString()
            }
        });

        const payment = await Payment.create({
            order_id: orderId,
            amount: order.total_amount,
            method: PaymentMethod.STRIPE,
            payment_status: PaymentStatus.PENDING,
            stripe_payment_intent_id: paymentIntent.id
        });

        return {
            clientSecret: paymentIntent.client_secret!,
            paymentId: payment.id
        };
    }

    async handleWebhook(event: any): Promise<void> {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handleSuccessfulPayment(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handleFailedPayment(event.data.object);
                break;
        }
    }

    private async handleSuccessfulPayment(paymentIntent: any): Promise<void> {
        const payment = await Payment.findOne({
            where: { stripe_payment_intent_id: paymentIntent.id }
        });

        if (payment) {
            await payment.update({
                payment_status: PaymentStatus.COMPLETED,
                transaction_id: paymentIntent.id,
                payment_date: new Date()
            });

            await Order.update(
                { status: OrderStatus.PAID },
                { where: { id: payment.order_id } }
            );
        }
    }

    private async handleFailedPayment(paymentIntent: any): Promise<void> {
        const payment = await Payment.findOne({
            where: { stripe_payment_intent_id: paymentIntent.id }
        });

        if (payment) {
            await payment.update({
                payment_status: PaymentStatus.FAILED,
                transaction_id: paymentIntent.id
            });
        }
    }

    async createPayPalOrder(orderId: number): Promise<{ orderID: string, paymentId: number }> {
        const order = await Order.findByPk(orderId);
        
        if (!order || !order.total_amount) {
            throw new AppError('Order not found or invalid amount', 404);
        }

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: order.total_amount.toString()
                },
                reference_id: orderId.toString()
            }]
        });

        try {
            const response = await paypalClient.execute(request);
            const paypalOrder = response.result;

            const payment = await Payment.create({
                order_id: orderId,
                amount: order.total_amount,
                method: PaymentMethod.PAYPAL,
                payment_status: PaymentStatus.PENDING,
                transaction_id: paypalOrder.id
            });

            return {
                orderID: paypalOrder.id,
                paymentId: payment.id
            };
        } catch (error) {
            console.error('PayPal order creation error:', error);
            throw new AppError('Failed to create PayPal order', 500);
        }
    }

    async capturePayPalPayment(orderId: string): Promise<void> {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        
        try {
            const response = await paypalClient.execute(request);
            const captureData = response.result;

            const payment = await Payment.findOne({
                where: { transaction_id: orderId }
            });

            if (payment) {
                await payment.update({
                    payment_status: PaymentStatus.COMPLETED,
                    payment_date: new Date()
                });

                await Order.update(
                    { status: OrderStatus.PAID },
                    { where: { id: payment.order_id } }
                );
            }
        } catch (error) {
            console.error('PayPal payment capture error:', error);
            throw new AppError('Failed to capture PayPal payment', 500);
        }
    }

    async handlePaymentByMethod(
        orderId: number, 
        method: PaymentMethod
    ): Promise<{ clientSecret?: string, orderID?: string, paymentId: number }> {
        switch (method) {
            case PaymentMethod.STRIPE:
                return this.createPaymentIntent(orderId);
            case PaymentMethod.PAYPAL:
                return this.createPayPalOrder(orderId);
            default:
                throw new AppError('Unsupported payment method', 400);
        }
    }
}