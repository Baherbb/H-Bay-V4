import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { PaymentMethod } from '../models/payment.model';
import stripe from '../config/payment/stripe';

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    createPaymentIntent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { orderId } = req.body;
            const result = await this.paymentService.createPaymentIntent(orderId);
            
            res.json({
                success: true,
                data: result
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const sig = req.headers['stripe-signature'] as string;
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

            if (!endpointSecret) {
                throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
            }

            let event;

            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    sig,
                    endpointSecret
                );
            } catch (error: unknown) {
                if (error instanceof Error) {
                    res.status(400).send(`Webhook Error: ${error.message}`);
                } else {
                    res.status(400).send('Webhook Error');
                }
                return;
            }

            await this.paymentService.handleWebhook(event);
            res.json({ received: true });
        } catch (error: unknown) {
            next(error);
        }
    }

    initiatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { orderId, paymentMethod } = req.body;
            const result = await this.paymentService.handlePaymentByMethod(
                orderId,
                paymentMethod as PaymentMethod
            );
            
            res.json({
                success: true,
                data: result
            });
        } catch (error: unknown) {
            next(error);
        }
    }
    capturePayPalPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { orderID } = req.body;
            await this.paymentService.capturePayPalPayment(orderID);
            
            res.json({
                success: true,
                message: 'Payment captured successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

