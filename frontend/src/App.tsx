import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home'
// import Cart from './pages/Cart';
// import ProductDetail from './pages/ProductDetail';
// import ProductList from './pages/ProductList';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
      {<Header /> }
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} /> */}
            {/* <Route path="/cart" element={<Cart />} /> */}
            <Route path="/home" element={<Home />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<ContactUs />}/>
            <Route path="/login" element={<SignIn />}/>
            <Route path="/signup" element={<SignUp />}/>
            {/* Add more routes as needed */}
          </Routes>
        </main>
      {<Footer/>}
      </div>
    </Router>
  );
};

export default App;