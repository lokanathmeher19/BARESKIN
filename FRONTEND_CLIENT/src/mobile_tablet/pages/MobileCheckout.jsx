import { useCurrency } from '../../context/CurrencyContext';
import React, { useContext, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Lock } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const MobileCheckout = () => {
    const { formatPrice } = useCurrency();
    const { cart, cartTotal, finalTotal, discountAmount, promoCode, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [address, setAddress] = React.useState(user?.address || '');
    const [zip, setZip] = React.useState(user?.zip || '');
    const [city, setCity] = React.useState(user?.city || '');
    const [state, setState] = React.useState(user?.state || '');
    const [loadingLocation, setLoadingLocation] = React.useState(false);
    const navigate = useNavigate();

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
                    if (promoCode) await api.post('/promos/use', { code: promoCode.code });
                    toast.success("Order placed successfully (COD)!");
                    clearCart();
                    navigate('/my-orders');
                } else {
                    toast.error(data.message || "Failed to place order.");
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

            if (data.orderId && data.orderId.startsWith('order_mock_')) {
                toast.success("Sandbox Simulation active! Processing...", { icon: '⚙️' });
                try {
                    const verificationResult = await api.post('/payment/verify', {
                        razorpay_order_id: data.orderId,
                        razorpay_payment_id: `pay_mock_${Date.now()}`,
                        razorpay_signature: 'mock_signature',
                        userId: user?._id,
                        guestEmail: user ? undefined : guestEmail,
                        guestName: user ? undefined : guestName,
                        products: cart,
                        totalPrice: finalTotalWithPoints,
                        address: `${address}, ${city}, ${state} - ${zip}`
                    });
                    
                    if (verificationResult.data.success) {
                        if (promoCode) await api.post('/promos/use', { code: promoCode.code });
                        toast.success("Sandbox Payment Authorized!");
                        clearCart();
                        navigate('/my-orders');
                    }
                } catch (err) {
                    toast.error("Sandbox verification collapsed.");
                }
                return;
            }

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
                            if (promoCode) await api.post('/promos/use', { code: promoCode.code });
                            toast.success("Payment successful! Order placed.");
                            clearCart();
                            navigate('/my-orders');
                        }
                    } catch (err) {
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
            toast.error("Payment initiation failed.");
        }
    };

    return (
        <div className="w-full bg-[#fcfcfc] min-h-screen px-4 py-6 animate-fade-in">
            <h1 className="text-xl font-black uppercase italic tracking-widest text-center mb-8">Checkout</h1>
            
            <div className="space-y-6">
                {/* Mobile Step 1: Address */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100">
                    <h2 className="text-xs font-black uppercase tracking-widest italic mb-4 text-[#007aff]">1. Delivery Details</h2>
                    {!user && (
                        <div className="space-y-4 mb-4">
                            <input 
                                type="text" 
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="GUEST NAME"
                                className="w-full bg-zinc-50 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#007aff]/20"
                            />
                            <input 
                                type="email" 
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="GUEST EMAIL"
                                className="w-full bg-zinc-50 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#007aff]/20"
                            />
                        </div>
                    )}
                    <div className="space-y-4">
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
                                placeholder="6 DIGIT PIN"
                                className="w-full bg-zinc-50 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#007aff]/20"
                            />
                            {loadingLocation && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin"></div>}
                        </div>
                        <textarea 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="HOUSE NO, STREET, LANDMARK..."
                            className="w-full bg-zinc-50 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#007aff]/20 min-h-[80px]"
                        />
                    </div>
                </div>

                {/* Mobile Step 2: Payment Method */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100">
                    <h2 className="text-xs font-black uppercase tracking-widest italic mb-4 text-[#007aff]">2. Payment Method</h2>
                    <div className="space-y-3">
                        <div 
                            onClick={() => setPaymentMethod('online')}
                            className={`p-4 border-2 rounded-2xl flex items-center gap-4 transition-all ${paymentMethod === 'online' ? 'border-black bg-zinc-50' : 'border-zinc-100'}`}
                        >
                            <div className={`w-4 h-4 rounded-full border-4 ${paymentMethod === 'online' ? 'border-black' : 'border-zinc-200 bg-white'}`}></div>
                            <div>
                                <h4 className="text-[11px] font-black italic uppercase">Pay Online</h4>
                                <p className="text-[8px] font-bold text-zinc-400 mt-0.5 uppercase tracking-widest">Cards, UPI, Wallets</p>
                            </div>
                        </div>
                        <div 
                            onClick={() => setPaymentMethod('cod')}
                            className={`p-4 border-2 rounded-2xl flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-black bg-zinc-50' : 'border-zinc-100'}`}
                        >
                            <div className={`w-4 h-4 rounded-full border-4 ${paymentMethod === 'cod' ? 'border-black' : 'border-zinc-200 bg-white'}`}></div>
                            <div>
                                <h4 className="text-[11px] font-black italic uppercase">Cash on Delivery</h4>
                                <p className="text-[8px] font-bold text-zinc-400 mt-0.5 uppercase tracking-widest">Pay when it arrives</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Order Summary */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                    <h2 className="text-xs font-black uppercase tracking-widest italic mb-4">Summary</h2>
                    <div className="space-y-3">
                        {cart.map(item => (
                            <div key={item._id} className="flex justify-between items-center pb-3 border-b border-zinc-50">
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 bg-zinc-50 rounded-lg p-1">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-darken" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase italic tracking-tighter w-32 truncate">{item.name}</span>
                                        <span className="text-[8px] font-bold text-zinc-400">Qty: {item.qty}</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black italic">{formatPrice(item.price * item.qty)}</span>
                            </div>
                        ))}
                        
                        {user && (user.points > 0) && (
                            <div className="pt-3 pb-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Loyalty Points (Max {user.points})</span>
                                    <span className="text-[9px] font-black italic text-[#007aff]">{pointsToRedeem} PTS</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max={Math.min(user.points, finalTotal)} 
                                    value={pointsToRedeem} 
                                    onChange={(e) => setPointsToRedeem(Number(e.target.value))} 
                                    className="w-full accent-[#007aff] h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Subtotal:</span>
                            <span className="text-[10px] font-black italic text-zinc-400">{formatPrice(cartTotal)}</span>
                        </div>
                        {promoCode && (
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Promo:</span>
                                <span className="text-[10px] font-black italic text-green-500">- {formatPrice(discountAmount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Delivery:</span>
                            <span className="text-[10px] font-black italic text-green-500">FREE</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                            <span className="text-sm font-black uppercase tracking-widest">Total:</span>
                            <span className="text-sm font-black italic text-[#007aff]">{formatPrice(finalTotalWithPoints)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Footer */}
            <div className="fixed bottom-[60px] left-0 w-full bg-white/90 backdrop-blur-md border-t border-zinc-100 p-4 z-50 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
                <button 
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-4 rounded-2xl flex justify-center items-center gap-2 active:scale-[0.98] transition-transform"
                >
                    <Lock size={12} />
                    <span className="text-[11px] font-black uppercase italic tracking-widest">
                        Pay {formatPrice(finalTotalWithPoints)}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default MobileCheckout;
