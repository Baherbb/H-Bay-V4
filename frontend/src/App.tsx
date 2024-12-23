import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AdminSignIn from './pages/admin/authentication/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PaymentPage from './pages/PaymentForm';
import AdminLayout from './pages/admin/AdminLayout ';
import ProductsPage from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import ProtectedRoute from './components/ProtectedRoute'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Notifications from './components/common/Notification';
import NotificationTest from './components/common/NotificationTest';
import UserLayout from './pages/User/UserLayout';
import OrderTracking from './pages/Orders/OrderTracking';
import OrderDetailes from './pages/Orders/OrderDetails';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.toLowerCase().startsWith("/admin");
  const isUserRoute = location.pathname.toLowerCase().startsWith('/userlayout');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && !isUserRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/orderdetailes/*" element={<OrderDetailes />} />
          <Route path="/ordertracking/*" element={<OrderTracking />} />
          <Route path="/userlayout/*"element={
                    <ProtectedRoute
                        allowedRoles={['admin', 'super_admin', 'employee', 'customer']}
                        requiredPermissions={[]} 
                    >
                        <UserLayout />
                    </ProtectedRoute>
                } />
          <Route 
            path="/payment/:orderId" 
            element={
              <PayPalScriptProvider options={{
                clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID!,
                currency: "USD",
                intent: "capture"
              }}>
                <PaymentPage />
              </PayPalScriptProvider>
            } 
          />
          <Route path="/notification-test" element={<NotificationTest />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminSignIn />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route
                path="/adminAuth/*"
                element={
                    <ProtectedRoute
                        allowedRoles={['admin', 'super_admin', 'employee']}
                        requiredPermissions={[]} 
                    >
                        <AdminLayout />
                    </ProtectedRoute>
                }
            />
        </Routes>
      </main>
      <ToastContainer />
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;