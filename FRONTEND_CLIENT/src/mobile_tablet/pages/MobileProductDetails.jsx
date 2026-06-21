import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { Heart, Share2, Star, ShieldCheck, Truck, MapPin, RefreshCw, Zap, CheckCircle2, Leaf, Droplets, Sparkles, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrency } from '../../context/CurrencyContext';

const MobileProductDetails = () => {
    const { formatPrice } = useCurrency();
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [isSubscription, setIsSubscription] = useState(false);
    const [isNotified, setIsNotified] = useState(false);
    const [pincode, setPincode] = useState('');
    const [checkingPincode, setCheckingPincode] = useState(false);
    const [pincodeData, setPincodeData] = useState(null);
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/products/${id}`);
                const productData = res.data.data || res.data;
                setProduct(productData);
                if (productData.sizes && productData.sizes.length > 0) {
                    setSelectedSize(productData.sizes[0]);
                }
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: 'Check out this premium skincare product on BareSkin!',
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!");
        }
    };

    const handlePincodeCheck = async () => {
        if (pincode.length !== 6) {
            toast.error('Enter valid 6-digit Pincode');
            return;
        }
        setCheckingPincode(true);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            if (data[0].Status === "Success") {
                const po = data[0].PostOffice[0];
                setPincodeData({ City: po.District, State: po.State });
                toast.success(`Delivery available!`);
            } else {
                toast.error("Delivery unavailable here.");
                setPincodeData(null);
            }
        } catch (error) {
            toast.error("Check failed.");
        } finally {
            setCheckingPincode(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-white">
            <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#007aff] animate-loading-bar w-0"></div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="text-center py-40">
            <h4 className="text-zinc-400">Product Not Found</h4>
            <Link to="/products" className="text-sm text-[#007aff] mt-4 inline-block font-bold">Back to Store</Link>
        </div>
    );

    const images = [product.image, ...(product.images || [])].filter(Boolean);
    const basePrice = product.price || 0;
    const price = isSubscription ? (basePrice * 0.9) : basePrice;

    return (
        <div className="bg-white min-h-screen pb-32">
            {/* Header Toolbar */}
            <div className="fixed top-0 left-0 right-0 z-[110] bg-white/95 backdrop-blur-xl border-b border-zinc-100 px-4 py-3 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="p-2 bg-zinc-50 rounded-xl"><ChevronLeft size={16}/></button>
                <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[200px]">{product.name}</span>
                <button onClick={handleShare} className="p-2 bg-zinc-50 rounded-xl"><Share2 size={16}/></button>
            </div>

            <div className="pt-20 px-4">
                {/* Images Carousel */}
                <div className="bg-zinc-50/50 rounded-3xl p-6 flex flex-col items-center justify-center relative mb-6">
                    <img 
                        src={images[selectedImage]} 
                        alt={product.name} 
                        className="w-full max-h-[300px] object-contain aspect-square" 
                    />
                    <div className="flex gap-1.5 mt-4">
                        {images.map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`w-2 h-2 rounded-full ${selectedImage === i ? 'bg-black' : 'bg-zinc-200'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-4">
                    <div>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">{product.category}</span>
                        <h2 className="text-2xl font-black uppercase text-black mt-1 leading-tight">{product.name}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[1,2,3,4,5].map((s) => (
                                <Star key={s} size={14} className={s <= Math.floor(product.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-zinc-200 fill-zinc-200"} />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500">{(product.numReviews || 0)} Reviews</span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-black italic">{formatPrice(price)}</span>
                        {isSubscription && <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-black italic">Save 10%</span>}
                    </div>

                    {/* Purchase Options */}
                    <div className="flex flex-col gap-3 my-4">
                        <button 
                            onClick={() => setIsSubscription(false)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${!isSubscription ? 'border-black bg-zinc-50' : 'border-zinc-100'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] font-black uppercase tracking-wider">One-time purchase</span>
                                {!isSubscription && <CheckCircle2 size={14} className="text-black" />}
                            </div>
                            <span className="text-lg font-black italic">{formatPrice(basePrice)}</span>
                        </button>

                        <button 
                            onClick={() => setIsSubscription(true)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${isSubscription ? 'border-[#007aff] bg-[#007aff]/5' : 'border-zinc-100'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] font-black uppercase tracking-wider">Subscribe & Save 10%</span>
                                {isSubscription && <CheckCircle2 size={14} className="text-[#007aff]" />}
                            </div>
                            <span className="text-lg font-black italic">{formatPrice((basePrice * 0.9))}</span>
                        </button>
                    </div>

                    {/* Pincode Check */}
                    <div className="bg-zinc-50 p-4 rounded-2xl flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase">Delivery Check</span>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="ENTER PINCODE" 
                                className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-[10px] font-bold flex-grow outline-none"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                            <button onClick={handlePincodeCheck} className="px-4 bg-black text-white rounded-xl text-[10px] font-black uppercase">
                                Check
                            </button>
                        </div>
                        {pincodeData && (
                            <span className="text-[8px] font-bold text-zinc-500 uppercase">Available in {pincodeData.City}</span>
                        )}
                    </div>

                    {/* About */}
                    <div className="mt-4">
                        <h4 className="text-xs font-black uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            {product.description || "Dermatologically-tested advanced formulation made with clinical accuracy to deliver visible skincare improvements."}
                        </p>
                    </div>

                    {/* Bio-Safety stats */}
                    <div className="my-6 p-4 bg-zinc-50 rounded-2xl flex items-center gap-4">
                        <div className="w-16 h-16 bg-white border border-zinc-100 rounded-full flex flex-col items-center justify-center shadow-sm">
                            <span className="text-lg font-black italic text-[#007aff]">9.1</span>
                            <span className="text-[7px] font-bold uppercase text-zinc-400">Safe</span>
                        </div>
                        <div className="flex-1">
                            <span className="text-[9px] font-black uppercase text-zinc-400">Bio-Safety Rating</span>
                            <p className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-tight">Formula contains zero high-risk irritants. Certified pure quality.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 z-[210] bg-white border-t border-zinc-100 px-4 py-3 flex gap-2">
                <button 
                    onClick={() => {
                        addToCart({ ...product, selectedSize, isSubscription, price }, 1);
                        toast.success('Added to Cart');
                    }}
                    className="flex-1 py-4 bg-zinc-100 text-black rounded-xl text-xs font-bold uppercase tracking-wider active:scale-95 transition-all"
                >
                    Add To Cart
                </button>
                <button 
                    onClick={() => {
                        addToCart({ ...product, selectedSize, isSubscription, price }, 1);
                        navigate('/checkout');
                    }}
                    className="flex-1 py-4 bg-[#ffa41c] text-white rounded-xl text-xs font-bold uppercase tracking-wider active:scale-95 transition-all"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default MobileProductDetails;
