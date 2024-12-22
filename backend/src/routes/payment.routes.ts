import express from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { Permission, hasPermission } from '../middleware/permissions';

const router = express.Router();
const paymentController = new PaymentController();

router.post(
    '/create-payment-intent',
    authMiddleware,
    hasPermission(Permission.VIEW_ORDERS),
    paymentController.createPaymentIntent
);

router.post(
    '/webhook',
    express.raw({type: 'application/json'}),
    paymentController.handleWebhook
);

router.post(
    '/initiate-payment',
    authMiddleware,
    hasPermission(Permission.VIEW_ORDERS),
    paymentController.initiatePayment
);

router.post(
    '/capture-paypal-payment',
    authMiddleware,
    hasPermission(Permission.VIEW_ORDERS),
    paymentController.capturePayPalPayment
);

export default router;