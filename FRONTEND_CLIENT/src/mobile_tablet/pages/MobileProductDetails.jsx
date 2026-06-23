import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { Heart, Share2, Star, ShieldCheck, Truck, MapPin, RefreshCw, Zap, CheckCircle2, Leaf, Droplets, ChevronLeft, ShoppingBag, Waves, User, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrency } from '../../context/CurrencyContext';

const MobileProductDetails = () => {
    const { formatPrice } = useCurrency();
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [pincode, setPincode] = useState('');
    const [checkingPincode, setCheckingPincode] = useState(false);
    const [pincodeData, setPincodeData] = useState(null);
    
    // Desktop parity states
    const [isSubscription, setIsSubscription] = useState(false);
    const [isNotified, setIsNotified] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [beforeImage, setBeforeImage] = useState('');
    const [afterImage, setAfterImage] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // New Features States
    const [buyersCount] = useState(() => Math.floor(Math.random() * 40) + 10);
    const [recentlyViewedItems, setRecentlyViewedItems] = useState([]);

    const { addToCart, cartCount } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    // Delivery Timer
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            
            const diff = endOfDay - now;
            if (diff <= 0) {
                setTimeLeft('0 hrs 0 mins');
                return;
            }

            const hrs = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            setTimeLeft(`${hrs} hrs ${mins}`);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000);
        return () => clearInterval(interval);
    }, []);

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

                // Update Recently Viewed
                const saved = localStorage.getItem('recentlyViewed');
                let history = saved ? JSON.parse(saved) : [];
                setRecentlyViewedItems(history.filter(item => item._id !== productData._id));

                history = history.filter(item => item._id !== productData._id);
                history.unshift({ _id: productData._id, name: productData.name, image: productData.image, price: productData.price });
                if (history.length > 10) history = history.slice(0, 10);
                localStorage.setItem('recentlyViewed', JSON.stringify(history));

                // Fetch related products for the bundle
                const allRes = await api.get('/products');
                const allProducts = allRes.data.data || [];
                setRelatedProducts(allProducts.filter(p => p.category === productData.category && p._id !== id).slice(0, 4));
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

    const handleNotify = () => {
        setIsNotified(true);
        toast.success("We'll notify you when it's back!", { icon: '🔔' });
    };

    const getDeliveryTimeframe = (state) => {
        if (!state) return '3-5 Days';
        const metros = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal'];
        if (metros.includes(state)) return '1-2 Days';
        return '3-5 Days';
    };

    const getEstimatedDeliveryDate = () => {
        if (!product) return "";
        let productBaseDays = 2;
        if (['Face Care', 'Beauty', 'Makeup'].includes(product.category)) productBaseDays = 1;
        else if (product.category === 'Lip Care') productBaseDays = 2;
        else if (['Hair Care', 'Body Care'].includes(product.category)) productBaseDays = 3;
        else productBaseDays = 4;
        
        const geoOffset = pincodeData?.State ? (getDeliveryTimeframe(pincodeData.State) === '1-2 Days' ? 1 : 3) : 3;
        const daysToAdd = productBaseDays + geoOffset;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysToAdd);
        return targetDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to write a review");
            navigate('/login');
            return;
        }
        setSubmittingReview(true);
        try {
            await api.post(`/products/${id}/reviews`, { rating, comment, beforeImage, afterImage });
            toast.success("Review submitted successfully!");
            setRating(5);
            setComment('');
            setBeforeImage('');
            setAfterImage('');
            setShowReviewForm(false);
            const res = await api.get(`/products/${id}`);
            setProduct(res.data.data || res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
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
            <Link to="/products" className="text-sm text-[#007aff] mt-4 inline-block font-medium">Back to Store</Link>
        </div>
    );

    const images = [product.image, ...(product.images || [])].filter(Boolean);
    const selectedVariant = product.variants?.find(v => v.size === selectedSize);
    const basePrice = selectedVariant ? selectedVariant.price : (product.price || 0);
    const finalPrice = isSubscription ? (basePrice * 0.9) : basePrice;

    // Cross-Selling Bundle Logic
    const bundleProduct1 = relatedProducts[0];
    const bundleProduct2 = relatedProducts[1];

    const addBundleToCart = () => {
        addToCart({ ...product, selectedSize, price: basePrice, isSubscription }, 1);
        if (bundleProduct1) addToCart({ ...bundleProduct1, price: bundleProduct1.price }, 1);
        if (bundleProduct2) addToCart({ ...bundleProduct2, price: bundleProduct2.price }, 1);
        toast.success("All items added to cart!");
        navigate('/cart');
    };

    return (
        <div className="bg-white min-h-screen pb-24 font-sans safe-top">
            {/* Transparent/Sticky Header */}
            <div className="fixed top-0 left-0 right-0 z-[110] bg-white border-b border-zinc-100 px-3 py-2 flex justify-between items-center shadow-sm h-14">
                <button onClick={() => navigate(-1)} className="p-2 -ml-1 text-zinc-800 z-10">
                    <ChevronLeft size={24}/>
                </button>

                {/* Centered Logo */}
                <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-0">
                    <img src="/LOGO.png" alt="BareSkin Logo" className="w-6 h-6 object-contain" />
                    <span className="text-[15px] font-black uppercase tracking-tighter text-zinc-900 mt-0.5">
                        BareSkin<span className="text-[#007aff]">.</span>
                    </span>
                </Link>

                <div className="flex gap-1 items-center z-10">
                    <button onClick={handleShare} className="p-2 text-zinc-800"><Share2 size={20}/></button>
                    <Link to="/cart" className="p-2 text-zinc-800 relative">
                        <ShoppingBag size={20}/>
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            <div className="pt-14">
                {/* Full Bleed Image Gallery */}
                <div className="bg-white w-full border-b border-zinc-100 relative">
                    <button className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur rounded-full shadow-sm border border-zinc-100 text-zinc-400 hover:text-red-500 transition-colors">
                        <Heart size={20} />
                    </button>
                    
                    <div className="w-full aspect-square flex items-center justify-center p-4">
                        <img 
                            src={images[selectedImage]} 
                            alt={product.name} 
                            className="w-full h-full object-contain mix-blend-darken" 
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`h-2 rounded-full transition-all ${selectedImage === i ? 'w-2 bg-zinc-800' : 'w-2 bg-zinc-300'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Details Section */}
                <div className="p-4 bg-white">
                    <div>
                        <span className="text-[#007aff] text-xs font-semibold block mb-1">
                            {product.brand || 'BareSkin'}
                        </span>
                        <h1 className="text-[17px] font-medium text-zinc-900 leading-snug">
                            {product.name}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-[11px] font-bold">
                            {product.rating || '4.3'} <Star size={10} className="fill-white" />
                        </div>
                        <span className="text-xs font-medium text-[#007aff]">
                            {(product.numReviews || 0).toLocaleString()} ratings
                        </span>
                    </div>

                    <div className="mt-4">
                        {product.discountPercentage > 0 && (
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg font-light text-red-600">-{product.discountPercentage}%</span>
                                <span className="text-3xl font-medium text-zinc-900">{formatPrice(finalPrice)}</span>
                            </div>
                        )}
                        {product.discountPercentage === 0 && (
                             <span className="text-3xl font-medium text-zinc-900 block">{formatPrice(finalPrice)}</span>
                        )}
                        {product.discountPercentage > 0 && (
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                M.R.P.: <span className="line-through">{formatPrice(Math.round(basePrice / (1 - product.discountPercentage / 100)))}</span>
                            </p>
                        )}
                        <p className="text-xs text-zinc-900 font-medium mt-1">Inclusive of all taxes</p>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <ShieldCheck size={18} className="text-[#007aff]" />
                        <span className="text-xs font-bold text-[#007aff] uppercase tracking-wide">BareSkin Assured</span>
                    </div>

                    {/* Social Proof Banner */}
                    <div className="mt-4 inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-600 px-3 py-1.5 rounded-lg">
                        <Zap size={14} className="fill-orange-600" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">🔥 {buyersCount} bought recently</span>
                    </div>
                </div>

                <div className="h-2 bg-zinc-100 w-full"></div>

                {/* Special Offers Section */}
                <div className="p-4 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={14} className="text-red-500" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Special Offers</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                        <div className="min-w-[200px] border border-zinc-200 rounded-lg p-3 shrink-0">
                            <span className="text-[10px] font-bold uppercase text-zinc-900 block mb-1">Bank Offer</span>
                            <p className="text-[10px] text-zinc-600">Upto ₹500 discount on select Credit Cards.</p>
                        </div>
                        <div className="min-w-[200px] border border-zinc-200 rounded-lg p-3 shrink-0">
                            <span className="text-[10px] font-bold uppercase text-zinc-900 block mb-1">Partner Offer</span>
                            <p className="text-[10px] text-zinc-600">Get GST invoice and save up to 28%.</p>
                        </div>
                    </div>
                </div>

                <div className="h-2 bg-zinc-100 w-full"></div>

                {/* Purchase Options */}
                <div className="p-4 bg-white">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#007aff] mb-4">Purchase Options</h3>
                    <div className="space-y-3">
                        <button 
                            onClick={() => setIsSubscription(false)}
                            className={`w-full p-4 rounded-xl border transition-all text-left flex justify-between items-center ${!isSubscription ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200'}`}
                        >
                            <div>
                                <span className="text-sm font-semibold block mb-1">One-time purchase</span>
                                <span className="text-lg font-bold">{formatPrice(basePrice)}</span>
                            </div>
                            {!isSubscription && <CheckCircle2 size={20} className="text-zinc-900" />}
                        </button>

                        <button 
                            onClick={() => setIsSubscription(true)}
                            className={`w-full p-4 rounded-xl border transition-all text-left flex justify-between items-center relative overflow-hidden ${isSubscription ? 'border-[#007aff] bg-[#007aff]/5' : 'border-zinc-200'}`}
                        >
                            <div className="absolute top-0 right-0 bg-[#007aff] text-white px-3 py-1 text-[9px] font-bold uppercase rounded-bl-lg">Best Value</div>
                            <div>
                                <span className="text-sm font-semibold block mb-1">Subscribe & Save 10%</span>
                                <span className="text-lg font-bold">{formatPrice(basePrice * 0.9)}</span>
                                <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-wide">Auto-replenish every 30 days</p>
                            </div>
                            {isSubscription && <CheckCircle2 size={20} className="text-[#007aff]" />}
                        </button>
                    </div>
                </div>

                <div className="h-2 bg-zinc-100 w-full"></div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                    <>
                        <div className="p-4 bg-white">
                            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Select Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                                            selectedSize === size 
                                            ? 'border-zinc-900 bg-zinc-900 text-white' 
                                            : 'border-zinc-300 text-zinc-800 bg-white'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-2 bg-zinc-100 w-full"></div>
                    </>
                )}

                {/* Delivery & Stock */}
                <div className="p-4 bg-white">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-2 h-2 rounded-full ${(!selectedVariant && product.stock > 0) || (selectedVariant && selectedVariant.stock > 0) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-bold uppercase tracking-wide ${(!selectedVariant && product.stock > 0) || (selectedVariant && selectedVariant.stock > 0) ? 'text-green-600' : 'text-red-600'}`}>
                            {(!selectedVariant && product.stock > 0) || (selectedVariant && selectedVariant.stock > 0) ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>

                    <div className="flex gap-2 mb-4">
                        <div className="relative flex-grow">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input 
                                type="text" 
                                placeholder="Enter Pincode" 
                                className="w-full pl-9 pr-4 py-3 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:border-[#007aff]"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={handlePincodeCheck} 
                            disabled={checkingPincode}
                            className="px-6 bg-zinc-900 text-white rounded-lg text-xs font-semibold active:scale-95 transition-transform"
                        >
                            {checkingPincode ? '...' : 'Check'}
                        </button>
                    </div>

                    {pincodeData && (
                        <div className="mb-4 text-xs font-medium text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                            Serving {pincodeData.City}, {pincodeData.State}
                        </div>
                    )}

                    <div className="space-y-4 pt-4 border-t border-zinc-100">
                        <div className="flex items-start gap-3">
                            <Truck size={20} className="text-[#007aff] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-zinc-900">
                                    FREE delivery <span className="underline decoration-[#007aff] underline-offset-2">{getEstimatedDeliveryDate()}</span>
                                </p>
                                <p className="text-xs text-[#ffa41c] font-medium mt-1">
                                    Order within {timeLeft}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <RefreshCw size={20} className="text-zinc-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-zinc-900">7 Days Returnable</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck size={20} className="text-zinc-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-zinc-900">Secure transaction</p>
                        </div>
                    </div>

                    {/* AR Try-On Link for Tinted Products */}
                    {(product.category === 'Lip Care' || product.category === 'Beauty' || product.category === 'Makeup') && (
                        <Link 
                            to="/ar-tryon" 
                            className="mt-6 w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-[#007aff]/5 text-[#007aff] border border-[#007aff]/20 active:bg-[#007aff]/10 transition-colors"
                        >
                            <Sparkles size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Open Virtual AR Mirror</span>
                        </Link>
                    )}
                </div>

                <div className="h-2 bg-zinc-100 w-full"></div>

                {/* About & Trust Badges */}
                <div className="p-4 bg-white space-y-5">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 mb-3">About this item</h3>
                        <ul className="space-y-2 text-sm text-zinc-700">
                            <li>• Suitable for: {Array.isArray(product.skinType) ? product.skinType.join(', ') : (product.skinType || 'All Skin Types')}</li>
                            <li>• {product.description || "Premium skincare scientifically formulated for maximum safety and visible results."}</li>
                            <li>• Cruelty-free and Vegan certified formula.</li>
                            <li>• Dermatologically tested.</li>
                        </ul>
                    </div>

                    {/* Bio-Safety stats */}
                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center shadow-sm shrink-0 border border-zinc-100">
                            <span className="text-base font-bold text-[#007aff]">9.1</span>
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-semibold text-zinc-900">Bio-Safety Rating</span>
                            <p className="text-xs text-zinc-600 mt-1 leading-snug">Formula contains zero high-risk irritants. Certified pure quality.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="flex flex-col items-center text-center gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                            <Leaf size={20} className="text-green-600" />
                            <span className="text-[10px] font-medium text-zinc-600 leading-tight">Cruelty<br/>Free</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                            <ShieldCheck size={20} className="text-blue-600" />
                            <span className="text-[10px] font-medium text-zinc-600 leading-tight">Derm<br/>Tested</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                            <Droplets size={20} className="text-cyan-600" />
                            <span className="text-[10px] font-medium text-zinc-600 leading-tight">Paraben<br/>Free</span>
                        </div>
                    </div>
                </div>

                <div className="h-2 bg-zinc-100 w-full"></div>

                {/* Comparative Analysis Table */}
                <div className="p-4 bg-white overflow-x-auto">
                    <h3 className="text-sm font-bold text-zinc-900 mb-4">Compare with similar items</h3>
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="bg-zinc-50 border-y border-zinc-100">
                                <th className="p-3 text-[10px] font-bold uppercase text-zinc-500">Attributes</th>
                                <th className="p-3 text-xs font-bold border-l border-zinc-100 bg-white">This Item</th>
                                <th className="p-3 text-xs font-medium border-l border-zinc-100 text-zinc-400">Basic Version</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {[
                                { label: 'Rating', val: `${(product.rating || 0).toFixed(1)}/5`, alt: '4.1/5' },
                                { label: 'Price', val: formatPrice(finalPrice), alt: formatPrice(650) },
                                { label: 'Natural Ingredients', val: '98%', alt: '85%' },
                                { label: 'Dermatologically Tested', val: 'Yes', alt: 'No' }
                            ].map((row, i) => (
                                <tr key={i}>
                                    <td className="p-3 text-[10px] font-bold text-zinc-500 uppercase">{row.label}</td>
                                    <td className="p-3 text-xs font-bold text-black border-l border-zinc-100">{row.val}</td>
                                    <td className="p-3 text-xs text-zinc-500 border-l border-zinc-100">{row.alt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="h-2 bg-zinc-100 w-full"></div>

                {/* Reviews Section */}
                <div className="p-4 bg-white">
                    <h3 className="text-sm font-bold text-zinc-900 mb-4">Customer Reviews</h3>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                            {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= Math.round(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-zinc-200 fill-zinc-200"} />)}
                        </div>
                        <span className="text-sm font-bold text-zinc-800">{(product.rating || 0).toFixed(1)} out of 5</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-6">Total Ratings: {(product.numReviews || 0).toLocaleString()}</p>

                    {/* Review Form Toggle */}
                    <button 
                        onClick={() => user ? setShowReviewForm(!showReviewForm) : navigate('/login')}
                        className="w-full py-3 border border-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-zinc-50 mb-6"
                    >
                        {showReviewForm ? 'Cancel Review' : 'Write a product review'}
                    </button>

                    {showReviewForm && (
                        <form onSubmit={submitReviewHandler} className="mb-8 space-y-4 p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-zinc-500 mb-2 block">Rating</label>
                                <div className="flex gap-2">
                                    {[1,2,3,4,5].map(num => (
                                        <button type="button" key={num} onClick={() => setRating(num)}>
                                            <Star size={20} className={num <= rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-200"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-zinc-500 mb-2 block">Your Review</label>
                                <textarea 
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full border border-zinc-200 rounded-lg p-3 text-xs outline-none focus:border-zinc-500 resize-none h-24"
                                    placeholder="What did you like or dislike?"
                                ></textarea>
                            </div>
                            <button 
                                disabled={submittingReview}
                                className="w-full bg-zinc-900 text-white py-3 rounded-lg text-xs font-bold uppercase disabled:opacity-50"
                            >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((rev) => (
                                <div key={rev._id} className="pb-6 border-b border-zinc-100 last:border-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold block">{rev.name}</span>
                                            <div className="flex text-yellow-400 mt-0.5">
                                                {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= rev.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-200 fill-zinc-200"} />)}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1 mb-2">
                                        <CheckCircle2 size={10} className="text-green-500" /> Verified Purchase
                                    </p>
                                    <p className="text-xs text-zinc-700 leading-relaxed">{rev.comment}</p>
                                    
                                    {(rev.beforeImage || rev.afterImage) && (
                                        <div className="flex gap-3 mt-3">
                                            {rev.beforeImage && (
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-200">
                                                    <img src={rev.beforeImage} alt="Before" className="w-full h-full object-cover" />
                                                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1 rounded">Before</span>
                                                </div>
                                            )}
                                            {rev.afterImage && (
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-200">
                                                    <img src={rev.afterImage} alt="After" className="w-full h-full object-cover" />
                                                    <span className="absolute bottom-1 left-1 bg-[#007aff]/80 text-white text-[8px] font-bold px-1 rounded">After</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-zinc-500 text-center py-6">No reviews yet.</p>
                        )}
                    </div>
                </div>

                <div className="h-2 bg-zinc-100 w-full"></div>

                {/* FREQUENTLY BOUGHT TOGETHER - CROSS SELLING */}
                {bundleProduct1 && (
                    <div className="p-4 bg-white">
                        <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                            Frequently Bought Together
                        </h3>
                        
                        <div className="flex items-center gap-3 mb-5 overflow-x-auto pb-2 scrollbar-hide">
                            <div className="w-20 h-20 bg-white rounded-xl p-2 shadow-sm border border-zinc-200 flex-shrink-0">
                                <img src={images[0]} className="w-full h-full object-contain mix-blend-darken" alt={product.name} />
                            </div>
                            <span className="text-zinc-400 font-bold">+</span>
                            <div className="w-20 h-20 bg-white rounded-xl p-2 shadow-sm border border-zinc-200 flex-shrink-0" onClick={() => navigate(`/product/${bundleProduct1._id}`)}>
                                <img src={bundleProduct1.image} className="w-full h-full object-contain mix-blend-darken" alt={bundleProduct1.name} />
                            </div>
                            {bundleProduct2 && (
                                <>
                                    <span className="text-zinc-400 font-bold">+</span>
                                    <div className="w-20 h-20 bg-white rounded-xl p-2 shadow-sm border border-zinc-200 flex-shrink-0" onClick={() => navigate(`/product/${bundleProduct2._id}`)}>
                                        <img src={bundleProduct2.image} className="w-full h-full object-contain mix-blend-darken" alt={bundleProduct2.name} />
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="space-y-3">
                            <ul className="text-xs text-zinc-600 space-y-2">
                                <li className="flex gap-2 items-start">
                                    <CheckCircle2 size={14} className="text-[#007aff] shrink-0 mt-0.5" /> 
                                    <span className="text-zinc-900 font-medium line-clamp-1">This item: {product.name}</span>
                                </li>
                                <li className="flex gap-2 items-start" onClick={() => navigate(`/product/${bundleProduct1._id}`)}>
                                    <CheckCircle2 size={14} className="text-[#007aff] shrink-0 mt-0.5" /> 
                                    <span className="text-zinc-600 hover:text-[#007aff] line-clamp-1">{bundleProduct1.name}</span>
                                </li>
                                {bundleProduct2 && (
                                    <li className="flex gap-2 items-start" onClick={() => navigate(`/product/${bundleProduct2._id}`)}>
                                        <CheckCircle2 size={14} className="text-[#007aff] shrink-0 mt-0.5" /> 
                                        <span className="text-zinc-600 hover:text-[#007aff] line-clamp-1">{bundleProduct2.name}</span>
                                    </li>
                                )}
                            </ul>

                            <div className="pt-4 border-t border-zinc-100 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-zinc-500">Total Price:</span>
                                    <span className="text-lg font-bold text-zinc-900">
                                        {formatPrice(((finalPrice) + (bundleProduct1?.price || 0) + (bundleProduct2?.price || 0)))}
                                    </span>
                                </div>
                                <button 
                                    onClick={addBundleToCart} 
                                    className="w-full py-3.5 bg-black text-white text-sm font-semibold rounded-full active:scale-[0.98] transition-transform"
                                >
                                    Add All To Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recently Viewed Carousel */}
                {recentlyViewedItems.length > 0 && (
                    <div className="p-4 bg-white mt-2">
                        <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                            <RefreshCw size={14} className="text-[#007aff]" /> Recently Viewed By You
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                            {recentlyViewedItems.map(item => (
                                <div 
                                    key={item._id} 
                                    onClick={() => navigate(`/product/${item._id}`)}
                                    className="min-w-[120px] flex-shrink-0 cursor-pointer snap-start"
                                >
                                    <div className="w-full aspect-square bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100 relative mb-2 p-2">
                                        <img src={item.image} className="w-full h-full object-contain mix-blend-darken" alt={item.name} />
                                    </div>
                                    <h4 className="text-[10px] font-bold text-zinc-600 line-clamp-1">{item.name}</h4>
                                    <span className="text-[10px] font-black italic text-zinc-900 block">{formatPrice(item.price)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 z-[210] bg-white border-t border-zinc-200 px-3 py-3 flex gap-3 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                {(!selectedVariant && product.stock > 0) || (selectedVariant && selectedVariant.stock > 0) ? (
                    <>
                        <button 
                            onClick={() => {
                                addToCart({ ...product, selectedSize, price: finalPrice, isSubscription }, 1);
                                toast.success(isSubscription ? 'Subscription added to cart' : 'Added to Cart');
                            }}
                            className="flex-1 py-3.5 bg-white border border-zinc-300 text-zinc-900 rounded-full text-sm font-semibold active:bg-zinc-50 transition-colors flex items-center justify-center"
                        >
                            Add to Cart
                        </button>
                        <button 
                            onClick={() => {
                                addToCart({ ...product, selectedSize, price: finalPrice, isSubscription }, 1);
                                navigate('/checkout');
                            }}
                            className="flex-1 py-3.5 bg-[#ffa41c] text-zinc-900 rounded-full text-sm font-semibold active:scale-[0.98] transition-transform flex items-center justify-center"
                        >
                            Buy Now
                        </button>
                    </>
                ) : (
                     <button 
                        onClick={handleNotify}
                        disabled={isNotified}
                        className={`w-full py-3.5 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${isNotified ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-zinc-900 text-white'}`}
                    >
                        {isNotified ? <><ShieldCheck size={16}/> We'll notify you</> : <><Zap size={16}/> Notify Me</>}
                    </button>
                )}
            </div>
        </div>
    );
};

export default MobileProductDetails;
