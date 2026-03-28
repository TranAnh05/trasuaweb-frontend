import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';

// Component Layout dùng chung cho các trang có Header/Footer
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Các Route sử dụng Layout chung */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        
        <Route path="/menu" element={<MainLayout><Menu /></MainLayout>} />
        
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
};

export default App;