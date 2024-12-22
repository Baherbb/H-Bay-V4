import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials are not defined in environment variables');
}

let environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);

if (process.env.NODE_ENV === 'production') {
    environment = new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
    );
}

const paypalClient = new paypal.core.PayPalHttpClient(environment);

export default paypalClient;