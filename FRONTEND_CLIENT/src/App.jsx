import React, { useContext } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import SkinQuiz from './pages/SkinQuiz';
import IngredientAnalyzer from './pages/IngredientAnalyzer';
import TheLab from './pages/TheLab';
import ARTryOn from './pages/ARTryOn';
import Wishlist from './pages/Wishlist';
import LegalPage from './pages/LegalPage';
import RecentlyViewed from './components/RecentlyViewed';
import Compare from './pages/Compare';



import { AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { ShieldCheck, Heart } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Admin folder moved to 03_ADMIN_PANEL
import ChatBubble from './components/ChatBubble';

// Admin Imports
import AdminRoute from './admin/components/AdminRoute';
import AdminLayout from './admin/pages/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import ProductList from './admin/pages/ProductList';
import AddProduct from './admin/pages/AddProduct';
import EditProduct from './admin/pages/EditProduct';
import AdminOrders from './admin/pages/AdminOrders';
import AdminUsers from './admin/pages/AdminUsers';
import AdminSubscriptions from './admin/pages/AdminSubscriptions';
import AdminLogin from './admin/pages/Login';
import ManageBanners from './admin/pages/ManageBanners';
import AdminPromos from './admin/pages/AdminPromos';
import AbandonedCarts from './admin/pages/AbandonedCarts';

import { HelmetProvider } from 'react-helmet-async';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();
  const { } = useContext(AuthContext);
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <HelmetProvider>
      <ScrollToTop />
      <div className={`flex flex-col min-h-screen bg-white text-black font-sans ${isAdminArea ? 'overflow-hidden' : ''}`}>
        {!isAdminArea && <Navbar />}
        <main className={`${isAdminArea ? 'flex-grow' : 'flex-grow pt-[120px] sm:pt-40 lg:pt-48'}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/skin-quiz" element={<SkinQuiz />} />
            <Route path="/analyze-ingredients" element={<IngredientAnalyzer />} />
            <Route path="/the-lab" element={<TheLab />} />
            <Route path="/ar-tryon" element={<ARTryOn />} />
            <Route path="/compare" element={<Compare />} />
            
            {/* Protected User Routes */}
            <Route element={<PrivateRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
            </Route>
            {/* Legal Routes */}
            <Route path="/privacy-policy" element={
                <LegalPage 
                    title="Privacy Policy" 
                    content={[
                        { heading: "Information Collection", text: "We collect only essential data to fulfill your orders and personalize your skin profile. This includes your name, email, and skin type.", list: ["Personal Identification Information", "Transactional Data", "Device & Usage Information"] },
                        { heading: "Data Security", text: "We use high-grade encryption for all database transactions. Your personal skin profile is stored securely and never shared with 3rd parties." },
                        { heading: "Your Rights", text: "You have the right to request a full copy of your data or its deletion at any time via your account settings." }
                    ]} 
                />
            } />
            <Route path="/terms-of-service" element={
                <LegalPage 
                    title="Terms of Service" 
                    content={[
                        { heading: "User Agreement", text: "By using BareSkin, you agree to our electronic terms of service. You must be 18+ or have parental consent to use our clinical tools." },
                        { heading: "Payment & Billing", text: "All transactions are processed via secure gateways. Subscriptions are billed every 30 days and can be cancelled at any time." },
                        { heading: "Scientific Disclaimer", text: "While our tools use scientific data, they do not replace clinical advice from a licensed dermatologist." }
                    ]} 
                />
            } />
            <Route path="/return-policy" element={
                <LegalPage 
                    title="Return Policy" 
                    content={[
                        { heading: "7-Day Guarantee", text: "We offer a 7-day hassle-free return policy for unopened products. If you experience an adverse reaction, contact support immediately." },
                        { heading: "Refund Process", text: "Refunds are processed within 3-5 business days after the product reaches our verification center." },
                        { heading: "Non-Returnable Items", text: "Opened products or products purchased during clearance sales are not eligible for returns unless defective." }
                    ]} 
                />
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="banners" element={<ManageBanners />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="promos" element={<AdminPromos />} />
                <Route path="abandoned-carts" element={<AbandonedCarts />} />
              </Route>
            </Route>

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAdminArea && <RecentlyViewed />}
        {!isAdminArea && <Footer />}
        {!isAdminArea && <BottomNav />}
        <ChatBubble />
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </HelmetProvider>
  );
}

export default App;
