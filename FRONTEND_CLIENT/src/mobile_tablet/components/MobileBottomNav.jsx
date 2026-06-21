import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User, Heart } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

const MobileBottomNav = () => {
    const { cart } = useContext(CartContext);
    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const location = useLocation();

    // Hide bottom navigation in specific page details or checkout where space is key
    if (location.pathname.startsWith('/product/') || location.pathname === '/checkout') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white/90 backdrop-blur-xl border-t border-zinc-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 pt-2 pb-3 safe-bottom flex items-center justify-around">
            <NavLink 
                to="/" 
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#007aff] scale-105' : 'text-zinc-400'}`}
            >
                <Home size={18} strokeWidth={2.5} />
                <span className="text-[8px] font-black uppercase tracking-wider">Home</span>
            </NavLink>

            <NavLink 
                to="/products" 
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#007aff] scale-105' : 'text-zinc-400'}`}
            >
                <Grid size={18} strokeWidth={2.5} />
                <span className="text-[8px] font-black uppercase tracking-wider">Shop</span>
            </NavLink>

            <NavLink 
                to="/cart" 
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-all relative ${isActive ? 'text-[#007aff] scale-105' : 'text-zinc-400'}`}
            >
                <ShoppingBag size={18} strokeWidth={2.5} />
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#007aff] text-white text-[7px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                        {cartCount}
                    </span>
                )}
                <span className="text-[8px] font-black uppercase tracking-wider">Cart</span>
            </NavLink>

            <NavLink 
                to="/wishlist" 
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#007aff] scale-105' : 'text-zinc-400'}`}
            >
                <Heart size={18} strokeWidth={2.5} />
                <span className="text-[8px] font-black uppercase tracking-wider">Wishlist</span>
            </NavLink>

            <NavLink 
                to="/profile" 
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#007aff] scale-105' : 'text-zinc-400'}`}
            >
                <User size={18} strokeWidth={2.5} />
                <span className="text-[8px] font-black uppercase tracking-wider">Profile</span>
            </NavLink>
        </div>
    );
};

export default MobileBottomNav;
