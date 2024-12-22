import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface PaymentIntent {
    clientSecret: string;
    paymentId: number;
}

export interface PayPalOrder {
    orderID: string;
    paymentId: number;
}

class PaymentService {
    private getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async createPaymentIntent(orderId: number): Promise<PaymentIntent> {
        const response = await axios.post(
            `${API_URL}/payments/create-payment-intent`,
            { orderId },
            {
                withCredentials: true,
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    }

    async createPayPalOrder(orderId: number): Promise<PayPalOrder> {
        const response = await axios.post(
            `${API_URL}/payments/initiate-payment`,
            {
                orderId,
                method: 'paypal'
            },
            {
                withCredentials: true,
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    }

    async capturePayPalPayment(orderId: string): Promise<void> {
        await axios.post(
            `${API_URL}/payments/capture-paypal-payment`,
            { orderId },
            {
                withCredentials: true,
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

export const paymentService = new PaymentService();