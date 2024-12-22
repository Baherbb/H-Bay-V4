import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Github,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Send,
  Laptop,
  Smartphone,
  Headphones
} from 'lucide-react';

const navigation = {
  shop: [
    { name: "Latest Tech", href: "#" },
    { name: "Best Sellers", href: "#" },
    { name: "New Arrivals", href: "#" },
    { name: "Special Deals", href: "#" },
  ],
  support: [
    { name: "Tech Support", href: "#" },
    { name: "Track Order", href: "#" },
    { name: "Returns", href: "#" },
    { name: "Contact Us", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Data Deletion", href: "#" },
  ],
};

const socialLinks = [
  { icon: Github, href: "#", label: "Github" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
];



const Footer = () => {
  return (
    <footer className="bg-black relative mt-16" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-700 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-white text-center lg:text-left max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-bold">Get Tech Updates & Exclusive Offers</h3>
              <p className="mt-3 text-base sm:text-lg text-orange-100">Stay ahead with the latest in technology and special deals!</p>
            </div>
            <div className="w-full max-w-md">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-base w-full"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-2 group font-semibold"
                >
                  Subscribe
                  <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Logo and Contact Info */}
          <div className="col-span-1 lg:col-span-5">
            <Link to="/" className="inline-block group">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-2xl transform group-hover:scale-105 transition-transform duration-200">
                  <Laptop className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                    H-BaY
                  </h1>
                  <p className="text-orange-300 text-sm sm:text-base">Tech Super Shop</p>
                </div>
              </div>
            </Link>
            <p className="mt-6 text-gray-400 text-base sm:text-lg">
              Your premier destination for cutting-edge technology. Experience the future of tech shopping with our curated selection and expert service.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Phone, label: "24/7 Tech Support", value: "+20 1001691976" },
                { icon: Mail, label: "Email Support", value: "support@hbay.tech" },
                { icon: MapPin, label: "Main Store", value: "Zewail City of Science and Technology, F005" },
              ].map((item) => (
                <div key={item.label} className="flex items-center space-x-3 group">
                  <div className="bg-orange-900/50 p-2.5 rounded-lg group-hover:bg-orange-800/50 transition-colors duration-200">
                    <item.icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{item.label}</p>
                    <p className="text-base font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1 lg:col-span-7">
            <div className="grid grid-cols-2 gap-8">
              {[
                { title: "Shop", items: navigation.shop },
                { title: "Support", items: navigation.support },
                { title: "Legal", items: navigation.legal },
              ].map((section) => (
                <div key={section.title}>
                  <h3 className="text-lg font-bold text-white mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className="text-gray-400 hover:text-orange-400 flex items-center group text-sm sm:text-base"
                        >
                          <ArrowRight className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:translate-x-1" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left order-2 sm:order-1">
              © {new Date().getFullYear()} H-BaY Tech Super Shop. All rights reserved.
            </p>
            <div className="flex items-center gap-3 order-1 sm:order-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  to={href}
                  aria-label={label}
                  className="bg-gray-800/50 p-2.5 rounded-lg hover:bg-orange-900/50 transition-colors duration-200 group"
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-orange-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;