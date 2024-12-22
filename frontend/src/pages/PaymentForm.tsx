import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { paymentService } from '../services/payment.service';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface StripeCheckoutFormProps {
  clientSecret: string;
  name: string;
  email: string;
  phone: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ 
  clientSecret, 
  name, 
  email, 
  phone, 
  onSuccess, 
  onError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe not initialized');
      return;
    }

    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      onError('Card element not found');
      setLoading(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name,
              email,
              phone,
            },
          },
        }
      );

      if (stripeError) {
        onError(stripeError.message || 'Payment failed');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (error) {
      onError('An unexpected error occurred');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-orange-500 text-white py-3 rounded-lg shadow-lg hover:bg-orange-600 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Confirm Payment'}
      </button>
    </form>
  );
};

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [orderDetails, setOrderDetails] = useState<{
    products: Product[];
    total: number;
  } | null>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [error, setError] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>();
  const getValidOrderId = (): number | null => {
    if (!orderId) return null;
    const numericOrderId = parseInt(orderId, 10);
    return !isNaN(numericOrderId) ? numericOrderId : null;
  };

  useEffect(() => {
    const validOrderId = getValidOrderId();
    if (!validOrderId) {
      setError('Invalid order ID');
      return;
    }
    const API_URL = 'http://localhost:3000/api';
    
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/${validOrderId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        
        // Add debug logging to see the actual response structure
        console.log('API Response:', data);
        
        // More flexible data validation
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format: empty or invalid response');
        }

        // Handle different possible response structures
        const orderData = data.data || data;
        const items = orderData.items || orderData.orderItems || [];
        
        if (!Array.isArray(items)) {
          throw new Error('Invalid response format: items is not an array');
        }

        const products = items.map((item: any) => ({
          id: item?.variant?.product?.id || item?.productId || item?.id || 0,
          name: item?.variant?.product?.name || item?.productName || 'Unknown Product',
          price: Number(item?.price_at_time || item?.price || 0),
          quantity: Number(item?.quantity || 1)
        }));

        const total = Number(orderData.total_amount || orderData.totalAmount || 
          products.reduce((sum, product) => sum + (product.price * product.quantity), 0));

        setOrderDetails({
          products,
          total
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load order details';
        setError(errorMessage);
      }
    };
  
    fetchOrderDetails();
  }, [orderId]);


  useEffect(() => {
    if (paymentMethod === 'card') {
      initializeStripePayment();
    }
  }, [paymentMethod]);

  const initializeStripePayment = async () => {
    const validOrderId = getValidOrderId();
    if (!validOrderId) {
      setError('Invalid order ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { clientSecret } = await paymentService.createPaymentIntent(validOrderId);
      setClientSecret(clientSecret);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
      console.error('Payment initialization error:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>Loading payment options...</p>
        </div>
      </div>
    );
  }

  const handlePayPalSubmit = async () => {
    const validOrderId = getValidOrderId();
    if (!validOrderId) {
      setError('Invalid order ID');
      return;
    }

    try {
      setLoading(true);
      const { orderID } = await paymentService.createPayPalOrder(validOrderId);
      await paymentService.capturePayPalPayment(orderID);
      setIsPaymentSuccessful(true);
    } catch (error) {
      setError('PayPal payment failed. Please try again.');
      console.error('PayPal payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-6 px-4">
        {isPaymentSuccessful ? (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>

            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mt-2">
              Thank you for your purchase. Your transaction has been completed
              successfully.
            </p>

            <div className="mt-6">
              <button
                className="bg-orange-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-orange-600"
                onClick={() => navigate("/home")}
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Payment Method
                </h2>
                <div className="flex space-x-4">
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="mr-2"
                      />
                      <span>Credit/Debit Card</span>
                    </div>
                    <div className="flex space-x-2">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                        alt="Mastercard"
                        className="h-6"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                        alt="Visa"
                        className="h-6"
                      />
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer ${
                      paymentMethod === "paypal"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="mr-2"
                      />
                    </div>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                      alt="PayPal"
                      className="h-6"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {error && <p className="text-red-500">{error}</p>}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="+1234567890"
                    required
                  />
                </div>

                {paymentMethod === "card" && clientSecret && (
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm
                      clientSecret={clientSecret}
                      name={name}
                      email={email}
                      phone={phone}
                      onSuccess={() => setIsPaymentSuccessful(true)}
                      onError={setError}
                    />
                  </Elements>
                )}

                {paymentMethod === "paypal" && (
                  <PayPalButtons
                  createOrder={async () => {
                    const validOrderId = getValidOrderId();
                    if (!validOrderId) {
                      throw new Error('Invalid order ID');
                    }
                    const { orderID } = await paymentService.createPayPalOrder(validOrderId);
                    return orderID;
                  }}
                    onApprove={async (data) => {
                      await paymentService.capturePayPalPayment(data.orderID);
                      setIsPaymentSuccessful(true);
                    }}
                    onError={() => {
                      setError('PayPal payment failed. Please try again.');
                    }}
                  />
                )}
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
              <ul className="space-y-2">
                {orderDetails?.products.map((product) => (
                  <li
                    key={product.id}
                    className="flex justify-between text-gray-700"
                  >
                    <span>
                      {product.name} (x{product.quantity})
                    </span>
                    <span>${(product.price * product.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total:</span>
                <span>${orderDetails?.total.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;