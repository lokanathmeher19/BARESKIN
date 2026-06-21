import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, ShieldCheck, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useCurrency } from '../../context/CurrencyContext';

const MobileCart = () => {
    const { formatPrice } = useCurrency();
    const { cart, removeFromCart, cartTotal, finalTotal, discountAmount, promoCode, applyPromo, removePromo, cartCount } = useContext(CartContext);
    
    const navigate = useNavigate();
    const [promoInput, setPromoInput] = useState('');
    const [applyingPromo, setApplyingPromo] = useState(false);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleApplyPromo = async () => {
        if (!promoInput.trim()) return;
        setApplyingPromo(true);
        try {
            const res = await api.post('/promos/validate', { code: promoInput });
            if (res.data.success) {
                applyPromo(res.data.data);
                toast.success('Promo code applied!');
                setPromoInput('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid promo code');
        } finally {
            setApplyingPromo(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
                <div className="p-8 bg-zinc-50 rounded-full mb-6">
                    <ShoppingBag size={36} className="text-zinc-200" />
                </div>
                <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-6">Your Cart is Empty</p>
                <Link to="/products" className="px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <ArrowLeft size={14} /> Shop Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-32 px-4 bg-white min-h-screen">
            <div className="mb-6">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Checkout Ready</span>
                <h2 className="text-2xl font-black uppercase text-black">Your Cart ({cartCount})</h2>
            </div>

            {/* Cart Items List */}
            <div className="flex flex-col gap-3">
                {cart.map(item => (
                    <div key={item._id} className="p-4 border border-zinc-150 rounded-2xl flex gap-4 items-center">
                        <div className="w-20 h-20 bg-zinc-50 rounded-xl p-2 shrink-0 border border-zinc-100/50">
                            <img 
                                src={item.image || 'https://via.placeholder.com/150'} 
                                alt={item.name} 
                                className="w-full h-full object-contain mix-blend-darken"
                            />
                        </div>
                        <div className="flex-grow min-w-0">
                            <span className="text-[8px] font-black text-[#007aff] uppercase tracking-wider block">{item.category}</span>
                            <Link to={`/product/${item._id}`}>
                                <h3 className="text-xs font-black uppercase tracking-tight text-zinc-900 truncate hover:text-[#007aff]">{item.name}</h3>
                            </Link>
                            {item.selectedSize && (
                                <span className="text-[8px] font-bold text-zinc-400 uppercase block mt-0.5">Size: {item.selectedSize}</span>
                            )}
                            
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs font-black italic">{formatPrice(item.price)}</span>
                                <span className="text-[9px] font-bold text-zinc-400">Qty: {item.qty}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => removeFromCart(item._id, item.selectedSize)}
                            className="p-3 bg-zinc-50 rounded-xl text-zinc-400 hover:text-red-500 active:scale-95 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Promo Codes */}
            <div className="my-6 p-4 border border-zinc-100 rounded-2xl space-y-3">
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider block">Apply Promo</span>
                {promoCode ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-100 p-3 rounded-xl">
                        <div>
                            <span className="text-[9px] font-black text-green-600 block">{promoCode.code} Active</span>
                            <span className="text-[8px] font-bold text-green-500">Saved {formatPrice(discountAmount)}</span>
                        </div>
                        <button onClick={removePromo} className="text-red-500 p-1">
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                            placeholder="PROMO CODE" 
                            className="flex-grow bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-[10px] font-bold tracking-wider outline-none"
                        />
                        <button 
                            onClick={handleApplyPromo}
                            disabled={applyingPromo}
                            className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase disabled:opacity-50"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>

            {/* Price Details */}
            <div className="p-5 bg-black text-white rounded-2xl flex flex-col gap-3">
                <span className="text-[9px] font-black text-[#007aff] uppercase tracking-widest block">Summary</span>
                <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between text-[10px] font-bold text-green-400">
                        <span>Discount</span>
                        <span>- {formatPrice(discountAmount)}</span>
                    </div>
                )}
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 border-b border-zinc-800 pb-2">
                    <span>Delivery</span>
                    <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                    <span className="text-xs font-black uppercase text-white">Total</span>
                    <span className="text-xl font-black italic">{formatPrice(finalTotal)}</span>
                </div>
            </div>

            {/* Fixed Bottom Checkout Trigger */}
            <div className="fixed bottom-[75px] left-0 right-0 z-[150] px-4">
                <button 
                    onClick={handleCheckout}
                    className="w-full py-4 bg-[#007aff] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#007aff]/20 active:scale-98 transition-all"
                >
                    Checkout Now <ShieldCheck size={16} />
                </button>
            </div>
        </div>
    );
};

export default MobileCart;
