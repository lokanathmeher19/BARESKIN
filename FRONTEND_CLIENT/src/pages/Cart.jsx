import { useCurrency } from '../context/CurrencyContext';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowLeft, ShieldCheck, Tag, X } from 'lucide-react';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Cart = () => {
    const { formatPrice } = useCurrency();

    const { cart, removeFromCart, cartTotal, finalTotal, discountAmount, promoCode, applyPromo, removePromo } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [promoInput, setPromoInput] = React.useState('');
    const [applyingPromo, setApplyingPromo] = React.useState(false);

    const handleCheckout = () => {
        if (!user) {
            navigate('/register');
        } else {
            navigate('/checkout');
        }
    };

    const handleApplyPromo = async () => {
        if (!promoInput.trim()) return;
        setApplyingPromo(true);
        try {
            const res = await api.post('/promos/validate', { code: promoInput });
            if (res.data.success) {
                applyPromo(res.data.data);
                toast.success('Promo code applied successfully!');
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
            <div className="flex flex-col items-center justify-center py-40 animate-fade-in px-6">
                <div className="p-10 bg-zinc-50 rounded-full mb-8">
                    <ShoppingBag size={48} className="text-zinc-200" />
                </div>
                <p className="text-zinc-400 text-xl mb-8 font-black uppercase italic tracking-widest">Your Cart is Empty</p>
                <Link to="/products" className="luxe-button px-10">
                    <ArrowLeft size={16} /> Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pt-32 md:pt-48 mb-24 animate-fade-in px-4 md:px-10">
            <BackButton className="mb-10" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-100 pb-12">

                <div>
                    <span className="luxe-subheading text-[#007aff] mb-4 block">Cart Items</span>
                    <h1 className="text-4xl md:text-6xl">Your Cart<span className="text-[#007aff]">.</span></h1>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 italic">{cart.length} Unit(s) in Cart</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-8 space-y-8">
                    {cart.map(item => (
                        <div key={item._id} className="tech-card p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 md:gap-10 group relative transition-all">
                            <div className="w-full sm:w-40 md:w-48 aspect-square bg-[#f5f5f7] rounded-[2rem] overflow-hidden p-4">
                                <img 
                                    src={item.image || 'https://via.placeholder.com/150'} 
                                    alt={item.name} 
                                    className="w-full h-full object-contain mix-blend-darken transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex-grow text-center sm:text-left">
                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="luxe-subheading text-[#007aff] text-[8px] uppercase tracking-widest">{item.category}</span>
                                        {item.stock > 0 ? (
                                            <span className="text-[8px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">In Stock</span>
                                        ) : (
                                            <span className="text-[8px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">Out of Stock</span>
                                        )}
                                    </div>
                                    <Link to={`/product/${item._id}`}>
                                        <h3 className="text-xl md:text-2xl hover:text-[#007aff] transition-colors line-clamp-2 italic font-black uppercase tracking-tight">{item.name}</h3>
                                    </Link>
                                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                                        {item.selectedSize && (
                                            <span className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">Size: {item.selectedSize}</span>
                                        )}
                                        <span className="text-[9px] font-black uppercase text-zinc-300">Seller: BareSkin Official</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black italic">{formatPrice(item.price)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col border-l border-zinc-50 pl-8">
                                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 opacity-40">Quantity</span>
                                        <div className="flex items-center gap-4 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100">
                                            <span className="text-sm font-black italic">{item.qty} pcs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center sm:items-end justify-between h-full py-2 border-t sm:border-t-0 sm:border-l border-zinc-50 pt-6 sm:pt-0 sm:pl-10 w-full sm:w-auto">
                                <h3 className="text-2xl font-black italic text-black">{formatPrice((item.price * item.qty))}</h3>
                                <button 
                                    onClick={() => removeFromCart(item._id, item.selectedSize)} 
                                    className="mt-6 sm:mt-0 p-4 bg-zinc-50 rounded-2xl text-zinc-300 hover:text-red-500 hover:bg-red-50/50 transition-all group"
                                >
                                    <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="lg:col-span-4 sticky top-40 space-y-6">
                    {/* Promo Code Section */}
                    <div className="tech-card p-6 bg-white border border-zinc-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Tag size={18} className="text-[#007aff]" />
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Apply Promo Code</h3>
                        </div>
                        {promoCode ? (
                            <div className="flex items-center justify-between bg-green-50 border border-green-100 p-4 rounded-xl">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600 block">{promoCode.code} Applied</span>
                                    <span className="text-[9px] font-bold text-green-500 italic">
                                        Saved {formatPrice(discountAmount)}
                                    </span>
                                </div>
                                <button onClick={removePromo} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={promoInput}
                                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                    placeholder="ENTER CODE" 
                                    className="flex-grow bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[10px] font-black tracking-widest outline-none uppercase focus:border-[#007aff] transition-all"
                                />
                                <button 
                                    onClick={handleApplyPromo}
                                    disabled={applyingPromo}
                                    className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#007aff] transition-all disabled:opacity-50"
                                >
                                    {applyingPromo ? '...' : 'Apply'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="tech-card p-10 space-y-10 bg-black text-white border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">
                        <div className="space-y-6">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#007aff] underline underline-offset-8">Price Details</span>
                            <div className="space-y-5 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cart Total ({cart.length} items)</span>
                                    <span className="text-sm font-black italic text-zinc-400">{formatPrice(cartTotal)}</span>
                                </div>
                                {promoCode && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Promo Discount</span>
                                        <span className="text-sm font-black italic text-green-500">- {formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Delivery Charges</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-zinc-400 line-through">{formatPrice(80)}</span>
                                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">FREE</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-t border-white/10 pt-8 mt-4">
                                    <h3 className="text-xl font-black uppercase tracking-tighter">Total Amount</h3>
                                    <span className="text-2xl font-black italic">{formatPrice(finalTotal)}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest text-center">
                                    {discountAmount > 0 ? `You will save ${formatPrice(discountAmount)} on this order` : 'Apply a promo code to save on this order'}
                                </p>
                            </div>
                        </div>

                        <button onClick={handleCheckout} className="luxe-button bg-white text-black hover:bg-[#007aff] hover:text-white w-full py-6 text-xs transition-all shadow-2xl flex justify-center items-center gap-2">
                            Proceed to Checkout <ShieldCheck size={18} />
                        </button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-4 text-zinc-300">
                        <div className="h-[1px] w-8 bg-zinc-100"></div>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] italic">Secure Transaction Active</span>
                        <div className="h-[1px] w-8 bg-zinc-100"></div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout Bar */}
            <div className="lg:hidden fixed bottom-[100px] left-0 right-0 z-[150] px-6">
                <div className="bg-black text-white p-6 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-between border border-white/10 backdrop-blur-xl">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#007aff]">Total Amount</span>
                        <span className="text-xl font-black italic">{formatPrice(finalTotal)}</span>
                    </div>
                    <button onClick={handleCheckout} className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#007aff] hover:text-white transition-all flex items-center gap-2">
                        Checkout <ShieldCheck size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
