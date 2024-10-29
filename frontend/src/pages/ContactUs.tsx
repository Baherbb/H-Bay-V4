import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Send,
  Loader2,
  CheckCircle,
  ArrowRight,
  Clock,
  MessageSquare,
  Building
} from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactUs: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Update office hours based on local time
    const updateCurrentTime = () => {
      const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Africa/Cairo'
      });
      setCurrentTime(time);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      validateForm();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTouched({});
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '+1 234 567 890' },
    { icon: Mail, label: 'Email', value: 'info@hbay.com' },
    { icon: MapPin, label: 'Address', value: 'Zewail City, Giza, Egypt' },
    { icon: Clock, label: 'Working Hours', value: '9:00 AM - 6:00 PM (EET)' }
  ];

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, url: 'https://instagram.com', label: 'Instagram' }
  ];

  const faqItems = [
    {
      question: 'What are your response times?',
      answer: 'We typically respond to all inquiries within 24 hours during business days.'
    },
    {
      question: 'Do you offer emergency support?',
      answer: 'Yes, we provide 24/7 emergency support for critical issues.'
    },
    {
      question: 'Can I schedule a meeting?',
      answer: 'Absolutely! You can request a meeting through our contact form or call us directly.'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Hero Section with Enhanced Parallax Effect */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 transform -skew-y-6 origin-top-left scale-110" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center text-white max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              24/7 Support Available
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              We're here to help and answer any questions you might have. 
              We look forward to hearing from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Current time: {currentTime} (EET)</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="text-sm">Average response time: 2 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Contact Information Card */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Building className="h-6 w-6 mr-2 text-orange-500" />
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center space-x-4 group">
                      <div className="bg-orange-100 p-3 rounded-full group-hover:bg-orange-200 transition-colors">
                        <Icon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-gray-600">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map(({ icon: Icon, url, label }) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-orange-100 p-3 rounded-full hover:bg-orange-200 transform hover:scale-110 transition-all relative"
                      >
                        <Icon className="h-5 w-5 text-orange-600" />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {faqItems.map((item, index) => (
                    <div key={index} className="group">
                      <h3 className="font-semibold text-lg mb-2 flex items-center">
                        <ArrowRight className="h-5 w-5 mr-2 text-orange-500 group-hover:translate-x-1 transition-transform" />
                        {item.question}
                      </h3>
                      <p className="text-gray-600 ml-7">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Our Location</h2>
                <div className="w-full h-[300px] rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.902537139395!2d31.018417!3d29.9409305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14584f7de4544dfb%3A0x9e98e461ef8f35f!2sZewail%20City%20of%20Science%20and%20Technology!5e0!3m2!1sen!2seg!4v1635424523540!5m2!1sen!2seg"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href="https://www.google.com/maps?q=Zewail+City,+Giza,+Egypt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors group"
                >
                  <MapPin className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                  Get Directions
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:sticky lg:top-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2 text-orange-500" />
                  Send Us a Message
                </h2>
                
                {isSuccess && (
                  <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Thank you for your message! We'll get back to you soon.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('name')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all
                          ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="John Doe"
                        required
                      />
                      {errors.name && touched.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('email')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all
                          ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="john@example.com"
                        required
                      />
                      {errors.email && touched.email && (<p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="subject">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('subject')}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all
                        ${errors.subject && touched.subject ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="How can we help you?"
                      required
                    />
                    {errors.subject && touched.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('message')}
                        rows={6}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none
                          ${errors.message && touched.message ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Please describe how we can help you..."
                        required
                      />
                      <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                        {formData.message.length}/500 characters
                      </span>
                    </div>
                    {errors.message && touched.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                      <input
                        id="privacy"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-orange-300"
                        required
                      />
                    </div>
                    <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
                      {' '}and consent to being contacted regarding my request.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg
                      hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 
                      focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 
                      disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]
                      flex items-center justify-center group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    By submitting this form, you'll receive updates and promotional messages. 
                    You can unsubscribe at any time.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Quick Response Promise */}
            <Card className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Quick Response Promise</h3>
                    <p className="text-white/90 text-sm">
                      We aim to respond to all inquiries within 2 hours during business hours.
                      For urgent matters, please call our support line.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Newsletter Subscription */}
      </div>
    </div>
  );
};

export default ContactUs;