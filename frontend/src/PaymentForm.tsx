import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    
  
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Samsung s 24 ultra ", price: 500, quantity: 1 },
    { id: 2, name: "Iphone 16", price: 300, quantity: 1 },
  ]);
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [error, setError] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

 
  const totalPrice = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");  
    value = value.slice(0, 16); 
    
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue);
  };
  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");  
    value = value.slice(0, 4);  
  
   
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
  
    setExpirationDate(value);
  };

 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

     
    if (!name || !email || !phone) {
      setError("Name, Email, and Phone Number are required.");
      return;
    }
    if (paymentMethod === "card" && (!cardNumber || !expirationDate || !cvv)) {
      setError("Card details are required for card payment.");
      return;
    }
    const removedSpacesCardNumber = cardNumber.replace(/\s/g, "");
    if (
      paymentMethod === "card" && 
      (removedSpacesCardNumber.length !==16 || isNaN(Number(removedSpacesCardNumber)))
    ) {
      setError("Invalid card number.");
      return;
    }
    setError("");  
    setIsPaymentSuccessful(true);
     
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-6 px-4">
        {/* Conditional Rendering */}
        {isPaymentSuccessful ? (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            {/* Success Icon */}
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
  
            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mt-2">
              Thank you for your purchase. Your transaction has been completed
              successfully.
            </p>
  
            {/* Button to Go Back */}
            <div className="mt-6">
              <button
                className="bg-orange-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-orange-600"
                onClick={() => navigate("/home")} // Reload the page
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Section: Payment Form */}
            <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>
  
              {/* Payment Method */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Payment Method
                </h2>
                <div className="flex space-x-4">
                  {/* Card Option */}
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
  
                  {/* PayPal Option */}
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
  
              {/* Form Fields */}
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                  />
                </div>
  
                {paymentMethod === "card" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          value={expirationDate}
                          onChange={handleExpirationDateChange}
                          className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </>
                )}
  
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 rounded-lg shadow-lg hover:bg-orange-600"
                >
                  Confirm Payment
                </button>
              </form>
            </div>
  
            {/* Right Section: Summary */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
              <ul className="space-y-2">
                {products.map((product) => (
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
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};
 

export default PaymentPage;
