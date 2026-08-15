import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const BottomNav = () => {
    const { cart } = useContext(CartContext);
    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

    return (
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[200] animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-white/80 backdrop-blur-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] px-8 py-4 flex items-center justify-between">
                <NavLink to="/" className="flex flex-col items-center gap-1 transition-all">
                    {({ isActive }) => (
                        <Home size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#007aff] scale-110' : 'text-zinc-400'} />
                    )}
                </NavLink>

                <NavLink to="/products" className="flex flex-col items-center gap-1 transition-all">
                    {({ isActive }) => (
                        <Grid size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#007aff] scale-110' : 'text-zinc-400'} />
                    )}
                </NavLink>

                <div className="relative -mt-12 bg-black p-5 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.3)] active:scale-90 transition-all">
                    <NavLink to="/cart" className="text-white">
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#007aff] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                {cartCount}
                            </span>
                        )}
                    </NavLink>
                </div>

                <NavLink to="/profile" className="flex flex-col items-center gap-1 transition-all">
                    {({ isActive }) => (
                        <User size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#007aff] scale-110' : 'text-zinc-400'} />
                    )}
                </NavLink>

                <NavLink to="/my-orders" className="flex flex-col items-center gap-1 transition-all">
                    {({ isActive }) => (
                        <Heart size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#007aff] scale-110' : 'text-zinc-400'} />
                    )}
                </NavLink>
            </div>
        </div>
    );
};

export default BottomNav;
