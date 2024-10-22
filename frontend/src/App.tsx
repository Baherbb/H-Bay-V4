import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero'
// import Cart from './pages/Cart';
// import ProductDetail from './pages/ProductDetail';
// import ProductList from './pages/ProductList';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
      {<Header /> }
        {<Hero/>}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} /> */}
            {/* <Route path="/cart" element={<Cart />} /> */}
            <Route path="/about" element={<About />}/>
            {/* Add more routes as needed */}
          </Routes>
        </main>
      {<Footer/>}
      </div>
    </Router>
  );
};

export default App;