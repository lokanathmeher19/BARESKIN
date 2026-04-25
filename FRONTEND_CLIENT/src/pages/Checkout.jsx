import { useCurrency } from '../context/CurrencyContext';
import React, { useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { formatPrice } = useCurrency();

    const { cart, cartTotal, finalTotal, discountAmount, promoCode, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [address, setAddress] = React.useState(user?.address || '');
    const [zip, setZip] = React.useState(user?.zip || '');
    const [city, setCity] = React.useState(user?.city || '');
    const [state, setState] = React.useState(user?.state || '');
    const [loadingLocation, setLoadingLocation] = React.useState(false);
    const navigate = useNavigate();

    const getDeliveryTimeframe = (selectedState) => {
        if (!selectedState) return '3-5 Days';
        const metros = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal'];
        if (metros.includes(selectedState)) return '1-2 Days';
        return '3-5 Days';
    };

    const [guestEmail, setGuestEmail] = React.useState('');
    const [guestName, setGuestName] = React.useState('');
    const [paymentMethod, setPaymentMethod] = React.useState('online');
    const [pointsToRedeem, setPointsToRedeem] = React.useState(0);

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/cart');
        }
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [cart, navigate, user]);

    const finalTotalWithPoints = Math.max(1, finalTotal - pointsToRedeem);

    const handleCheckout = async () => {
        if (!address.trim()) {
            alert("Please enter a shipping address.");
            return;
        }
        if (!user && (!guestEmail.trim() || !guestName.trim())) {
            alert("Please enter your name and email for guest checkout.");
            return;
        }
        
        try {

        if (paymentMethod === 'cod') {
            try {
                const { data } = await api.post('/payment/cod', {
                    amount: finalTotalWithPoints,
                    products: cart,
                    userId: user?._id,
                    guestEmail: user ? undefined : guestEmail,
                    guestName: user ? undefined : guestName,
                    address: `${address}, ${city}, ${state} - ${zip}`,
                    pointsToRedeem: pointsToRedeem
                });

                if (data.success) {
                    if (promoCode) {
                        await api.post('/promos/use', { code: promoCode.code });
                    }
                    toast.success("Order placed successfully (COD)!");
                    clearCart();
                    navigate('/my-orders');
                } else {
                    toast.error(data.message || "Failed to place order.");
                }
            } catch (error) {
                console.error("COD checkout error:", error);
                toast.error("Order placement failed. Please check server.");
            }
            return;
        }

            const { data } = await api.post('/payment/create-order', {
                amount: finalTotalWithPoints,
                products: cart,
                userId: user?._id,
                pointsToRedeem: pointsToRedeem
            });

            if (!data.success) throw new Error(data.message);

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "BareSkin",
                description: "Minimalist Essentials",
                order_id: data.orderId,
                handler: async function (response) {
                    try {
                        const verificationResult = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: user?._id,
                            guestEmail: user ? undefined : guestEmail,
                            guestName: user ? undefined : guestName,
                            products: cart,
                            totalPrice: finalTotalWithPoints,
                            address: `${address}, ${city}, ${state} - ${zip}`
                        });
                        
                        if (verificationResult.data.success) {
                            if (promoCode) {
                                await api.post('/promos/use', { code: promoCode.code });
                            }
                            
                            toast.success("Payment successful! Order placed.");
                            clearCart();
                            navigate('/');
                        }
                    } catch (err) {
                        console.error("Verification failed", err);
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: {
                    name: user?.name || guestName,
                    email: user?.email || guestEmail,
                    contact: "9999999999"
                },
                theme: {
                    color: "#000000"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Payment initiation failed. Please check server.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in px-4 pb-32">
            {/* Amazon-style Progress Tracker */}
            <div className="flex items-center justify-center gap-4 sm:gap-12 mb-16 pt-10">
                {[
                    { step: 1, label: 'Login', active: true },
                    { step: 2, label: 'Delivery', active: true },
                    { step: 3, label: 'Payment', active: false },
                ].map((s, i) => (
                    <React.Fragment key={s.step}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${s.active ? 'bg-[#007aff] text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                {s.step}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${s.active ? 'text-black' : 'text-zinc-300'}`}>{s.label}</span>
                        </div>
                        {i < 2 && <div className={`h-[1px] w-8 sm:w-20 ${s.active ? 'bg-[#007aff]' : 'bg-zinc-100'}`}></div>}
                    </React.Fragment>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-8 space-y-8">
                    {/* Step 1: Address Selection */}
                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="bg-zinc-50 px-10 py-6 border-b border-zinc-100 flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest italic">1. Select Delivery Address</h2>
                        </div>
                        <div className="p-10 space-y-6">
                            {!user && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-100 mb-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Guest Name</label>
                                        <input 
                                            type="text" 
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                            placeholder="Full Name"
                                            className="w-full bg-zinc-50 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-black italic focus:bg-white focus:border-[#007aff]/30 outline-none transition-all uppercase tracking-widest"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Guest Email</label>
                                        <input 
                                            type="email" 
                                            value={guestEmail}
                                            onChange={(e) => setGuestEmail(e.target.value)}
                                            placeholder="Email Address"
                                            className="w-full bg-zinc-50 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-black italic focus:bg-white focus:border-[#007aff]/30 outline-none transition-all uppercase tracking-widest"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Zip Code</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={zip}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setZip(val);
                                                if (val.length === 6) {
                                                    setLoadingLocation(true);
                                                    fetch(`https://api.postalpincode.in/pincode/${val}`)
                                                        .then(res => res.json())
                                                        .then(data => {
                                                            if (data[0].Status === "Success") {
                                                                const po = data[0].PostOffice[0];
                                                                setCity(po.District);
                                                                setState(po.State);
                                                            }
                                                        })
                                                        .finally(() => setLoadingLocation(false));
                                                }
                                            }}
                                            placeholder="6 Digit PIN"
                                            className="w-full bg-zinc-50 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-black italic focus:bg-white focus:border-[#007aff]/30 outline-none transition-all uppercase tracking-widest"
                                        />
                                        {loadingLocation && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin"></div>}
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <MapPin size={20} className="absolute left-6 top-6 text-zinc-300 group-focus-within:text-[#007aff] transition-colors" />
                                <textarea 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter Delivery Address (House No, Street, Landmark)..."
                                    className="w-full bg-zinc-50 border-2 border-transparent rounded-3xl pl-16 pr-8 py-6 text-xs font-black italic focus:bg-white focus:border-[#007aff]/30 outline-none transition-all placeholder:text-zinc-300 min-h-[120px] uppercase tracking-widest"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3 px-6 py-4 bg-green-50 rounded-2xl border border-green-100">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span className="text-[9px] font-black uppercase text-green-600 tracking-widest">Selected for contactless delivery</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Payment Method */}
                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm opacity-100">
                        <div className="bg-zinc-50 px-10 py-6 border-b border-zinc-100">
                            <h2 className="text-sm font-black uppercase tracking-widest italic">2. Select Payment Method</h2>
                        </div>
                        <div className="p-10 space-y-6">
                            
                            {/* Online Payment */}
                            <div 
                                onClick={() => setPaymentMethod('online')}
                                className={`p-8 border-2 rounded-3xl flex justify-between items-center cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-300'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-5 h-5 rounded-full border-[6px] ${paymentMethod === 'online' ? 'border-black' : 'border-zinc-200 bg-white'}`}></div>
                                    <div>
                                        <h4 className="text-sm font-black italic uppercase">Secure Online Payment</h4>
                                        <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Cards, UPI, Netbanking, Wallets</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cash on Delivery */}
                            <div 
                                onClick={() => setPaymentMethod('cod')}
                                className={`p-8 border-2 rounded-3xl flex justify-between items-center cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-300'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-5 h-5 rounded-full border-[6px] ${paymentMethod === 'cod' ? 'border-black' : 'border-zinc-200 bg-white'}`}></div>
                                    <div>
                                        <h4 className="text-sm font-black italic uppercase">Cash on Delivery (COD)</h4>
                                        <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Pay with cash when your order arrives</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Review Items */}
                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="bg-zinc-50 px-10 py-6 border-b border-zinc-100 flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest italic">3. Review Items</h2>
                            <button onClick={() => navigate('/cart')} className="text-[10px] font-black uppercase text-[#007aff] hover:underline">Edit Cart</button>
                        </div>
                        <div className="p-10 divide-y divide-zinc-50">
                            {cart.map(item => (
                                <div key={item._id} className="py-6 flex items-center gap-8">
                                    <div className="w-16 h-16 bg-zinc-50 rounded-xl p-2">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-darken" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-[11px] font-black italic uppercase tracking-tight">{item.name}</h4>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-[9px] font-black text-zinc-400 uppercase">Qty: {item.qty}</span>
                                            {item.selectedSize && <span className="text-[9px] font-black text-[#007aff] uppercase italic">Size: {item.selectedSize}</span>}
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-black italic">{formatPrice((item.price * item.qty))}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Order Summary */}
                <div className="lg:col-span-4 sticky top-40 space-y-6">
                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                        {state && (
                            <div className="p-4 bg-green-50 text-green-600 rounded-2xl border border-green-100 text-center text-[9px] font-black uppercase tracking-widest italic">
                                🚚 Delivery to {state}: {getDeliveryTimeframe(state)}
                            </div>
                        )}
                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-black text-white hover:bg-[#007aff] font-black uppercase tracking-[0.2em] text-[10px] py-6 rounded-2xl shadow-xl transition-all active:scale-95 italic"
                        >
                            {paymentMethod === 'cod' ? 'Place COD Order' : 'Confirm Order & Pay'}
                        </button>

                        {/* Loyalty Points Slider */}
                        {user && (user.points > 0) && (
                            <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Your Loyalty Points:</span>
                                    <span className="text-[10px] font-black italic text-[#007aff]">{user.points} PTS</span>
                                </div>
                                <div className="space-y-2">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max={Math.min(user.points, finalTotal)} 
                                        value={pointsToRedeem} 
                                        onChange={(e) => setPointsToRedeem(Number(e.target.value))} 
                                        className="w-full accent-black h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                        <span>Redeem: {pointsToRedeem} PTS</span>
                                        <span className="text-green-600 font-black">- {formatPrice(pointsToRedeem)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-6">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#007aff] underline underline-offset-8">Order Summary</span>
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cart Total:</span>
                                    <span className="text-[11px] font-black italic text-zinc-400">{formatPrice(cartTotal)}</span>
                                </div>
                                {promoCode && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Promo Discount ({promoCode.code}):</span>
                                        <span className="text-[11px] font-black italic text-green-500">- {formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                {pointsToRedeem > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Loyalty Discount:</span>
                                        <span className="text-[11px] font-black italic text-green-600">- {formatPrice(pointsToRedeem)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Delivery:</span>
                                    <span className="text-[11px] font-black text-green-500 uppercase tracking-widest italic">FREE</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-zinc-50 pt-6 mt-4">
                                    <h3 className="text-lg font-black uppercase tracking-tighter text-red-700">Order Total:</h3>
                                    <span className="text-xl font-black italic text-red-700">{formatPrice(finalTotalWithPoints)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-zinc-300"></div>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">By placing your order, you agree to BareSkin's <span className="text-[#007aff]">Privacy Notice</span> and <span className="text-[#007aff]">Conditions of Use</span>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
