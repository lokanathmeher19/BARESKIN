import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const BottomNav = () => {
    const { cart } = useContext(CartContext);
    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const location = useLocation();

    // Hide on product details page to avoid overlap with CTA
    if (location.pathname.startsWith('/product/')) return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-zinc-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-2 py-1.5 flex items-center justify-around">
            <NavLink 
                to="/" 
                className={({ isActive }) => `flex flex-col items-center gap-0.5 transition-all ${isActive ? 'text-[#007aff]' : 'text-zinc-400'}`}
            >
                <Home size={20} strokeWidth={2} />
                <span className="text-[9px] font-bold tracking-wider">Home</span>
            </NavLink>

            <NavLink 
                to="/products" 
                className={({ isActive }) => `flex flex-col items-center gap-0.5 transition-all ${isActive ? 'text-[#007aff]' : 'text-zinc-400'}`}
            >
                <Grid size={20} strokeWidth={2} />
                <span className="text-[9px] font-bold tracking-wider">Shop</span>
            </NavLink>

            <NavLink 
                to="/cart" 
                className={({ isActive }) => `flex flex-col items-center gap-0.5 transition-all relative ${isActive ? 'text-[#007aff]' : 'text-zinc-400'}`}
            >
                <ShoppingBag size={20} strokeWidth={2} />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#007aff] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                        {cartCount}
                    </span>
                )}
                <span className="text-[9px] font-bold tracking-wider">Cart</span>
            </NavLink>

            <NavLink 
                to="/wishlist" 
                className={({ isActive }) => `flex flex-col items-center gap-0.5 transition-all ${isActive ? 'text-[#007aff]' : 'text-zinc-400'}`}
            >
                <Heart size={20} strokeWidth={2} />
                <span className="text-[9px] font-bold tracking-wider">Wishlist</span>
            </NavLink>

            <NavLink 
                to="/profile" 
                className={({ isActive }) => `flex flex-col items-center gap-0.5 transition-all ${isActive ? 'text-[#007aff]' : 'text-zinc-400'}`}
            >
                <User size={20} strokeWidth={2} />
                <span className="text-[9px] font-bold tracking-wider">Profile</span>
            </NavLink>
        </div>
    );
};

export default BottomNav;
