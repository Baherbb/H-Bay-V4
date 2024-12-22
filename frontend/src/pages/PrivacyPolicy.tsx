import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        to="/home" 
        className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Introduction</h2>
          <p>
            Welcome to H-BaY Tech Super Shop. We are committed to protecting your personal information and your right to privacy. This privacy policy explains how we collect, use, and share your information when you use our website and services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Payment information</li>
            <li>Order history and preferences</li>
            <li>Communications with us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Process your orders and payments</li>
            <li>Communicate with you about orders and services</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Service providers and business partners</li>
            <li>Payment processors</li>
            <li>Marketing partners (with your consent)</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section id="data-deletion">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Data Retention and Deletion</h2>
        <p>
            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. 
        </p>
        
        <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">How to Request Data Deletion</h3>
        <p>You have the right to request deletion of your personal data. To exercise this right:</p>
        <ul className="list-disc ml-6 mt-2">
            <li>
            <strong>Email Request:</strong> Send an email to support@hbay.tech with the subject "Data Deletion Request"
            <ul className="list-disc ml-6 mt-1 text-sm">
                <li>Include your full name</li>
                <li>Include the email address associated with your account</li>
                <li>State "I request deletion of my personal data"</li>
            </ul>
            </li>
            <li>
            <strong>Through Your Account:</strong> Log into your account and use the data deletion tool in your account settings
            </li>
            <li>
            <strong>Contact Form:</strong> Submit a request through our contact form selecting "Data Deletion Request" as the subject
            </li>
        </ul>

        <p className="mt-4">
            <strong>Processing Time:</strong> We will process your deletion request within 30 days and send you a confirmation email once completed.
        </p>
        
        <p className="mt-2">
            <strong>Data Retention Period:</strong> After receiving your deletion request, we will delete your personal data within 90 days, except for information we are legally required to retain.
        </p>

        <p className="mt-2">
            <strong>Facebook Users:</strong> If you've used Facebook to interact with our services, you can also manage your data through Facebook's privacy settings.
        </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="mt-2">
            <p>Email: support@hbay.tech</p>
            <p>Phone: +20 1001691976</p>
            <p>Address: Zewail City of Science and Technology, F005</p>
          </div>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default PrivacyPolicy;