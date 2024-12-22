import { Router, Request, Response, NextFunction } from 'express';
import OrderController from '../controllers/order.controller';
import { OrderStatus } from '../models/order.model';
import { PaymentMethod } from '../models/payment.model';
import { ParamsDictionary } from 'express-serve-static-core';


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

type AsyncRequestHandler<P = ParamsDictionary, ResBody = any, ReqBody = any> = (
    req: Request<P, ResBody, ReqBody>,
    res: Response,
    next: NextFunction
) => Promise<any>;

const asyncHandler = <P = ParamsDictionary, ResBody = any, ReqBody = any>(
    fn: AsyncRequestHandler<P, ResBody, ReqBody>
) => {
    return (req: Request<P, ResBody, ReqBody>, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const router = Router();
const orderController = new OrderController();

router.get('/', asyncHandler(
    async (req: Request, res: Response) => {
        await orderController.getAllOrders(req, res);
    }
));

// GET single order by ID
router.get('/:id', asyncHandler<{ id: string }>(
    async (req: Request<{ id: string }>, res: Response) => {
        await orderController.getOrderById(req, res);
    }
));

// POST create new order
router.post('/', asyncHandler<{}, any, CreateOrderRequest>(
    async (req: Request<{}, any, CreateOrderRequest>, res: Response) => {
        await orderController.createOrder(req, res);
    }
));

// PATCH update order status
router.patch('/:id/status', asyncHandler<{ id: string }, any, UpdateOrderStatusRequest>(
    async (req: Request<{ id: string }, any, UpdateOrderStatusRequest>, res: Response) => {
        await orderController.updateOrderStatus(req, res);
    }
));
//DELETE delete order
router.delete('/:id', asyncHandler<{ id: string }>(
    async (req: Request<{ id: string }>, res: Response) => {
        await orderController.deleteOrder(req, res);
    }
));

export default router;