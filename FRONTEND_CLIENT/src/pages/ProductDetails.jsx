import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, RefreshCw, Star, Heart, Share2, Info, CheckCircle2, Waves, Zap, Plus, MapPin, User, ArrowRight, Leaf, Droplets, Sparkles } from 'lucide-react';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useCurrency } from '../context/CurrencyContext';

const ProductDetails = () => {
    const { formatPrice } = useCurrency();

    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [isSubscription, setIsSubscription] = useState(false);
    const [isNotified, setIsNotified] = useState(false);
    const [pincode, setPincode] = useState('');
    const [checkingPincode, setCheckingPincode] = useState(false);
    const [pincodeData, setPincodeData] = useState(null);
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    // Cross-Selling Bundle
    const bundleProduct1 = relatedProducts[0];
    const bundleProduct2 = relatedProducts[1];
    
    const addBundleToCart = () => {
        addToCart({ ...product, selectedSize, isSubscription, price }, 1);
        if (bundleProduct1) addToCart({ ...bundleProduct1, price: bundleProduct1.price, isSubscription: false }, 1);
        if (bundleProduct2) addToCart({ ...bundleProduct2, price: bundleProduct2.price, isSubscription: false }, 1);
        toast.success("Bundle added to cart!", { icon: '🛍️' });
        navigate('/cart');
    };

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [beforeImage, setBeforeImage] = useState('');
    const [afterImage, setAfterImage] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

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
            // Refetch product
            const res = await api.get(`/products/${id}`);
            setProduct(res.data.data || res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    const getDeliveryTimeframe = (state) => {
        if (!state) return '3-5 Days';
        const metros = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal'];
        if (metros.includes(state)) return '1-2 Days';
        return '3-5 Days';
    };

    const [timeLeft, setTimeLeft] = useState('');

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

    const getEstimatedDeliveryDate = () => {
        if (!product) return "";
        
        let productBaseDays = 2;
        if (product.category === 'Face Care' || product.category === 'Beauty' || product.category === 'Makeup') {
            productBaseDays = 1;
        } else if (product.category === 'Lip Care') {
            productBaseDays = 2;
        } else if (product.category === 'Hair Care' || product.category === 'Body Care') {
            productBaseDays = 3;
        } else {
            productBaseDays = 4;
        }
        
        const geoOffset = pincodeData?.State ? (getDeliveryTimeframe(pincodeData.State) === '1-2 Days' ? 1 : 3) : 3;
        
        const daysToAdd = productBaseDays + geoOffset;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysToAdd);
        
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return targetDate.toLocaleDateString('en-IN', options);
    };


    const handlePincodeCheck = async () => {
        if (pincode.length !== 6) {
            toast.error('Enter a valid 6-digit Pincode');
            return;
        }
        setCheckingPincode(true);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            if (data[0].Status === "Success") {
                const po = data[0].PostOffice[0];
                setPincodeData({ City: po.District, State: po.State });
                toast.success(`Delivery available in ${po.District}!`);
            } else {
                toast.error("Delivery not available here yet.");
                setPincodeData(null);
            }
        } catch (error) {
            toast.error("Check failed. Try again.");
        } finally {
            setCheckingPincode(false);
        }
    };

    const handleNotify = () => {
        setIsNotified(true);
        toast.success("We'll notify you when it's back!", { icon: '🔔' });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: 'Check out this premium skincare product on BareSkin!',
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Product link copied to clipboard!");
        }
    };

    const selectedVariant = product?.variants?.find(v => v.size === selectedSize);
    const basePrice = selectedVariant ? selectedVariant.price : (product?.price || 0);
    const price = isSubscription ? (basePrice * 0.9) : basePrice;

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
                history = history.filter(item => item._id !== productData._id);
                history.unshift({ _id: productData._id, name: productData.name, image: productData.image, price: productData.price });
                if (history.length > 10) history = history.slice(0, 10);
                localStorage.setItem('recentlyViewed', JSON.stringify(history));

                // Fetch related products (same category)
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

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-white">
            <div className="w-16 h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-black animate-loading-bar w-0"></div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="text-center py-40 bg-white">
            <h2 className="text-2xl font-light text-zinc-300">Product Not Found</h2>
            <button onClick={() => navigate('/products')} className="mt-8 text-[11px] font-bold tracking-widest text-black border-b-2 border-black pb-2">BACK TO STORE</button>
        </div>
    );

    const images = [product.image, ...(product.images || [])].filter(Boolean);

    return (
        <>
            <div className="bg-white min-h-screen animate-luxe">

            <Helmet>
                <title>{product.name} | BareSkin Premium Skincare</title>
                <meta name="description" content={product.description || `Buy ${product.name} on BareSkin. High-quality dermatologically-tested skincare.`} />
                <meta property="og:title" content={`${product.name} | BareSkin`} />
                <meta property="og:description" content={product.description} />
                <meta property="og:image" content={product.image} />
                <meta property="og:type" content="product" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 z-[110] bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-6 py-4 md:px-10 flex justify-between items-center lg:hidden">
                <button onClick={() => navigate(-1)} className="p-2"><ChevronLeft size={20}/></button>
                <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[200px]">{product.name}</span>
                <button onClick={handleShare} className="p-2"><Share2 size={18}/></button>
            </div>

            <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-20 pt-32 pb-32">
                <BackButton className="mb-10 hidden lg:flex" />

                
                {/* Desktop Breadcrumbs */}
                <nav className="flex items-center gap-3 mb-8 text-[11px] font-medium text-zinc-500">
                    <button onClick={() => navigate('/products')} className="hover:text-[#007aff] transition-colors underline underline-offset-4">Store</button>
                    <span>/</span>
                    <span className="hover:text-[#007aff] transition-colors cursor-pointer capitalize">{product.category}</span>
                    <span>/</span>
                    <span className="text-zinc-400 truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* 1. IMAGE GALLERY (Amazon Style - MASSIVE) */}
                    <div className="w-full lg:w-[45%] flex flex-col md:flex-row gap-6 lg:sticky lg:top-40">


                        {/* Vertical Thumbnails */}
                        <div className="hidden md:flex flex-col gap-3 order-1">
                            {images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onMouseEnter={() => setSelectedImage(idx)}
                                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all p-1 ${selectedImage === idx ? 'border-[#007aff] shadow-md' : 'border-zinc-100 hover:border-[#007aff]/50 opacity-80 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt="preview" />
                                </button>
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="flex-1 bg-white p-10 flex items-center justify-center relative cursor-zoom-in order-2 border border-zinc-100 rounded-2xl group overflow-hidden">
                             <img 
                                src={images[selectedImage]} 
                                alt={product.name} 
                                className="w-full object-contain aspect-square mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
                            />
                            <button className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 transition-colors p-2 bg-white rounded-full shadow-sm"><Heart size={20}/></button>
                        </div>
                    </div>

                    {/* 2. PRODUCT INFO (Middle Column) */}
                    <div className="w-full lg:w-[30%] space-y-6">

                        <div className="border-b border-zinc-100 pb-6 space-y-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-snug">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                 <div className="flex items-center">
                                    {[1,2,3,4,5].map((s) => (
                                        <Star key={s} size={16} className={s <= Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-zinc-200 fill-zinc-200"} />
                                    ))}
                                 </div>
                                 <span className="text-sm font-medium text-[#007aff] hover:underline cursor-pointer">{(product.numReviews || 0).toLocaleString()} ratings</span>
                                 <span className="h-4 w-[1px] bg-zinc-200"></span>
                                 <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-2 py-0.5 bg-zinc-50 rounded">Top Rated</span>
                            </div>
                        </div>
                        <div className="border-b border-zinc-100 pb-10 space-y-2">
                            <div className="flex items-baseline gap-4">
                                {product.discountPercentage > 0 && (
                                    <span className="text-red-600 text-4xl font-light">-{product.discountPercentage}%</span>
                                )}
                                <div className="flex items-start">
                                    <span className="text-xl font-bold mt-2.5 mr-0.5">₹</span>
                                    <span className="text-6xl font-black tracking-tighter">{basePrice.toLocaleString()}</span>
                                </div>
                            </div>
                            {product.discountPercentage > 0 && (
                                <p className="text-zinc-500 text-sm font-medium">M.R.P.: <span className="line-through">{formatPrice(Math.round(basePrice / (1 - product.discountPercentage / 100)))}</span></p>
                            )}
                            <p className="text-[11px] font-black text-[#007aff] uppercase tracking-widest mt-2 flex items-center gap-1.5 bg-[#007aff]/5 px-3 py-1 rounded-full w-fit">
                                INCLUSIVE OF ALL TAXES | FREE DELIVERY
                            </p>
                            <div className="flex items-center gap-2 mt-6">
                                <ShieldCheck size={20} className="text-[#007aff]" />
                                <span className="text-sm font-black text-[#007aff] italic uppercase tracking-wider">BareSkin. Assured Listing</span>
                            </div>
                        </div>

                        {/* Amazon-style Offers Section */}
                        <div className="border-b border-zinc-100 pb-6 space-y-3">
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-red-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Special Offers</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="border border-zinc-200 rounded-xl p-3 space-y-1 hover:shadow-sm transition-shadow">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-900 block italic">Bank Offer</span>
                                    <p className="text-[10px] text-zinc-600 leading-relaxed italic font-medium">Upto ₹500.00 discount on select Credit Cards.</p>
                                </div>
                                <div className="border border-zinc-200 rounded-xl p-3 space-y-1 hover:shadow-sm transition-shadow">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-900 block italic">Partner Offer</span>
                                    <p className="text-[10px] text-zinc-600 leading-relaxed italic font-medium">Get GST invoice and save up to 28%.</p>
                                </div>
                            </div>
                        </div>

                        {/* Subscription & One-time Purchase Selection */}
                        <div className="space-y-4 border-b border-zinc-100 pb-8">
                             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#007aff] mb-6 underline underline-offset-8">Purchase Options</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setIsSubscription(false)}
                                    className={`p-6 rounded-[2rem] border-2 transition-all text-left group ${!isSubscription ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest">One-time purchase</span>
                                        {!isSubscription && <CheckCircle2 size={16} className="text-black" />}
                                    </div>
                                    <span className="text-2xl font-black italic">{formatPrice(basePrice)}</span>
                                </button>
                                <button 
                                    onClick={() => setIsSubscription(true)}
                                    className={`p-6 rounded-[2rem] border-2 transition-all text-left relative group overflow-hidden ${isSubscription ? 'border-[#007aff] bg-[#007aff]/5' : 'border-zinc-100 hover:border-zinc-200'}`}
                                >
                                    <div className="absolute top-0 right-0 bg-[#007aff] text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest italic rounded-bl-xl">Best Value</div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Subscribe & Save 10%</span>
                                        {isSubscription && <CheckCircle2 size={16} className="text-[#007aff]" />}
                                    </div>
                                    <span className="text-2xl font-black italic">{formatPrice((basePrice * 0.9))}</span>
                                    <p className="text-[8px] font-bold text-zinc-400 mt-2 italic uppercase tracking-widest">Auto-replenish every 30 days</p>
                                </button>
                            </div>
                        </div>


                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="space-y-4 border-b border-zinc-100 pb-8">
                                <h3 className="text-sm font-bold">Select Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button 
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-6 py-2.5 rounded-lg border-2 text-xs font-bold transition-all ${
                                                selectedSize === size 
                                                ? 'border-black bg-black text-white shadow-md' 
                                                : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description / Features */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-tight">About this item</h3>
                            <ul className="space-y-3">
                                {[
                                    `Suitable for: ${Array.isArray(product.skinType) ? product.skinType.join(', ') : (product.skinType || 'All Skin Types')}`,
                                    product.description || "Premium skincare scientifically formulated for maximum safety and visible results.",
                                    "Cruelty-free and Vegan certified formula.",
                                    "Dermatologically tested and approved for sensitive skin."
                                ].map((bullet, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-zinc-600 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-2 shrink-0"></div>
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Trust Badges */}
                            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-100">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                        <Leaf size={16} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-400 leading-tight">Cruelty<br/>Free</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-400 leading-tight">Derm<br/>Tested</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 bg-zinc-50 text-zinc-900 rounded-full flex items-center justify-center">
                                        <Droplets size={16} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-400 leading-tight">Paraben<br/>Free</span>
                                </div>
                            </div>
                        </div>

                        {/* FREQUENTLY BOUGHT TOGETHER - CROSS SELLING */}
                        {bundleProduct1 && (
                            <div className="mt-8 p-6 sm:p-8 border border-zinc-200 bg-zinc-50/50 rounded-2xl animate-fade-in">
                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-6 flex items-center gap-2">
                                    <Sparkles size={16} className="text-[#007aff]" /> Frequently Bought Together
                                </h3>
                                
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white rounded-xl p-2 shadow-sm border border-zinc-100 flex-shrink-0">
                                        <img src={images[0]} className="w-full h-full object-contain mix-blend-darken" />
                                    </div>
                                    <span className="text-zinc-300 font-black">+</span>
                                    <div className="w-16 h-16 bg-white rounded-xl p-2 shadow-sm border border-zinc-100 flex-shrink-0 cursor-pointer group" onClick={() => navigate(`/product/${bundleProduct1._id}`)}>
                                        <img src={bundleProduct1.image} className="w-full h-full object-contain mix-blend-darken group-hover:scale-110 transition-transform" />
                                    </div>
                                    {bundleProduct2 && (
                                        <>
                                            <span className="text-zinc-300 font-black">+</span>
                                            <div className="w-16 h-16 bg-white rounded-xl p-2 shadow-sm border border-zinc-100 flex-shrink-0 cursor-pointer group" onClick={() => navigate(`/product/${bundleProduct2._id}`)}>
                                                <img src={bundleProduct2.image} className="w-full h-full object-contain mix-blend-darken group-hover:scale-110 transition-transform" />
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                <div className="space-y-4">
                                    <ul className="text-[10px] font-black uppercase text-zinc-500 space-y-2">
                                        <li className="flex gap-2">
                                            <CheckCircle2 size={12} className="text-[#007aff] shrink-0" /> <span className="truncate text-black">This item: {product.name}</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <CheckCircle2 size={12} className="text-[#007aff] shrink-0" /> <span className="truncate hover:text-[#007aff] cursor-pointer" onClick={() => navigate(`/product/${bundleProduct1._id}`)}>{bundleProduct1.name}</span>
                                        </li>
                                        {bundleProduct2 && (
                                            <li className="flex gap-2">
                                                <CheckCircle2 size={12} className="text-[#007aff] shrink-0" /> <span className="truncate hover:text-[#007aff] cursor-pointer" onClick={() => navigate(`/product/${bundleProduct2._id}`)}>{bundleProduct2.name}</span>
                                            </li>
                                        )}
                                    </ul>
                                    <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex flex-col text-center sm:text-left">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total Bundle Price</span>
                                            <span className="text-xl font-black italic">
                                                {formatPrice(((price) + (bundleProduct1?.price || 0) + (bundleProduct2?.price || 0)))}
                                            </span>
                                        </div>
                                        <button onClick={addBundleToCart} className="w-full sm:w-auto px-6 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#007aff] transition-colors shadow-lg shadow-black/10">
                                            Add All To Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. BUY BOX (Right Column - Fixed Style) */}
                    <div className="w-full lg:w-[20%] lg:sticky lg:top-40 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">

                         <div className="space-y-4">
                            <div className="flex items-start">
                                <span className="text-lg mt-1 mr-0.5 font-bold">₹</span>
                                <span className="text-4xl font-black">{price.toLocaleString()}</span>
                                {isSubscription && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded ml-2 font-bold uppercase mt-2 italic">Save 10%</span>}
                            </div>
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic leading-relaxed">Verified pricing. Secure checkout active.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${(!selectedVariant && product.stock > 0) || (selectedVariant && selectedVariant.stock > 0) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`text-sm font-bold uppercase tracking-widest italic ${(!selectedVariant && product.stock > 0) || (selectedVariant && selectedVariant.stock > 0) ? 'text-green-600' : 'text-red-600'}`}>
                                    {(!selectedVariant && product.stock > 0) || (selectedVariant && selectedVariant.stock > 0) ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            <div className="flex items-start gap-3 text-zinc-600 border-y border-zinc-100 py-3">
                                <Truck size={18} className="text-[#007aff] mt-0.5 shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-zinc-800 leading-tight">
                                        FREE delivery <span className="text-black font-black underline decoration-[#007aff] decoration-2 underline-offset-4">{getEstimatedDeliveryDate()}</span>
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#ffa41c] italic flex items-center gap-1 mt-1.5">
                                        <Zap size={12} className="fill-[#ffa41c] text-[#ffa41c] shrink-0"/> Order within <span className="text-zinc-900 font-bold">{timeLeft}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="bg-zinc-50 p-4 rounded-xl space-y-3">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase text-zinc-400">Deliver to</span>
                                        {pincodeData?.City && <span className="text-[8px] font-black text-green-600 uppercase italic">Verified</span>}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 focus-within:border-[#007aff] transition-all">
                                        <MapPin size={12} className={pincodeData?.City ? "text-green-500" : "text-[#007aff]"} />
                                        <input 
                                            type="text" 
                                            placeholder="Enter Pincode" 
                                            className="bg-transparent outline-none text-[10px] w-full font-bold uppercase tracking-widest placeholder:text-zinc-300" 
                                            maxLength="6" 
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                        />
                                        <button 
                                            onClick={handlePincodeCheck}
                                            disabled={checkingPincode}
                                            className="text-[10px] font-black text-[#007aff] uppercase hover:underline disabled:opacity-50"
                                        >
                                            {checkingPincode ? '...' : 'Check'}
                                        </button>
                                    </div>
                                    {pincodeData?.City && (
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter mt-1 italic leading-none">
                                            Serving {pincodeData.City}, {pincodeData.State}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-400 border-t border-zinc-100 pt-3">
                                    <span>Quantity</span>
                                    <span className="text-black italic">1 Unit</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {(!selectedVariant && product.stock > 0) || (selectedVariant && selectedVariant.stock > 0) ? (
                                <>
                                    {/* AR Try-On Link for Tinted Products */}
                                    {(product.category === 'Lip Care' || product.category === 'Beauty' || product.category === 'Makeup') && (
                                        <Link 
                                            to="/ar-tryon" 
                                            className="w-full flex items-center justify-center gap-4 p-5 rounded-2xl bg-[#007aff]/5 text-[#007aff] border border-[#007aff]/10 hover:bg-[#007aff]/10 transition-all mb-2 group"
                                        >
                                            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Open Virtual AR Mirror</span>
                                        </Link>
                                    )}

                                    <button 
                                        onClick={() => {
                                            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                                                toast.error('Please select a size first.');
                                                return;
                                            }
                                            addToCart({ ...product, selectedSize, isSubscription, price }, 1);
                                            toast.success(isSubscription ? 'Subscription added to cart!' : 'Added to your cart!');
                                        }}
                                        className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black py-4 rounded-full text-xs font-bold transition-all shadow-sm uppercase tracking-widest italic"
                                    >
                                        Add to Cart
                                    </button>

                                    <button 
                                        onClick={() => {
                                            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                                                toast.error('Please select a size first.');
                                                return;
                                            }

                                            addToCart({ ...product, selectedSize, isSubscription, price }, 1);
                                            navigate('/checkout');
                                        }}
                                        className="w-full bg-[#ffa41c] hover:bg-[#ff8f00] text-black py-4 rounded-full text-xs font-bold transition-all shadow-sm uppercase tracking-widest italic"
                                    >
                                        Buy Now
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={handleNotify}
                                    disabled={isNotified}
                                    className={`w-full py-4 rounded-full text-xs font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-2 ${isNotified ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-black text-white hover:bg-[#007aff]'}`}
                                >
                                    {isNotified ? <><ShieldCheck size={16}/> Sync Active</> : <><Zap size={16}/> Notify Me</>}
                                </button>
                            )}
                        </div>


                        <div className="pt-4 border-t border-zinc-100 flex flex-col gap-3">
                           <div className="flex items-center gap-3 text-zinc-500">
                                <div className="p-2 bg-zinc-50 rounded-lg"><RefreshCw size={14}/></div>
                                <span className="text-[10px] font-black uppercase tracking-widest italic">7 Days Returns</span>
                           </div>
                           <div className="flex items-center gap-3 text-zinc-500">
                                <div className="p-2 bg-zinc-50 rounded-lg"><ShieldCheck size={14}/></div>
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Secure Transaction</span>
                           </div>
                        </div>
                    </div>
                </div>

                {/* INGREDIENT SAFETY ANALYSIS (Step 2 Implementation) */}
                <div className="mt-32 p-12 md:p-20 bg-[#fbfbfb] rounded-[4rem] border border-zinc-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                        <Zap size={300} />
                    </div>
                    <div className="max-w-4xl relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 bg-white rounded-3xl shadow-sm">
                                <Waves className="text-[#007aff]" size={24} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Bio-Safety Analysis</h2>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">Scientific safety rating for {product.name}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-10">
                                <div className="flex items-center gap-8">
                                    <div className="relative w-28 h-28 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="56" cy="56" r="50" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                                            <circle cx="56" cy="56" r="50" fill="none" stroke="#007aff" strokeWidth="8" strokeDasharray="314" strokeDashoffset="31.4" className="transition-all duration-1000" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black italic tracking-tighter">9.1</span>
                                            <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Safe</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900 mb-2">High Purity Grade</p>
                                        <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic">Formula contains zero high-risk irritants. Clinically verified safe for all identified skin profiles.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: "Carcinogen-Free", score: 100 },
                                        { label: "pH Stabilization", score: 98 },
                                        { label: "Fragrance Transparency", score: 95 }
                                    ].map((stat, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">
                                                <span>{stat.label}</span>
                                                <span className="text-black">{stat.score}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-black" style={{ width: `${stat.score}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="p-10 bg-white rounded-[3rem] border border-zinc-100 shadow-sm space-y-6">
                                <h4 className="text-sm font-black uppercase tracking-widest mb-4">Science Overview</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#007aff]/10 flex items-center justify-center text-[#007aff] shrink-0"><CheckCircle2 size={14}/></div>
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">Paraben and Sulfate free for long-term skin health.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#007aff]/10 flex items-center justify-center text-[#007aff] shrink-0"><CheckCircle2 size={14}/></div>
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">Clinically tested to reduce irritation by 42% compared to base formulas.</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/analyze-ingredients')}
                                        className="w-full mt-6 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#007aff] transition-all italic"
                                    >
                                        Full Ingredient Audit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COMPARATIVE ANALYSIS (Amazon Style) */}
                <div className="mt-24 border-t border-zinc-100 pt-20">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
                         <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-3 italic uppercase tracking-tighter decoration-[#007aff] decoration-wavy underline underline-offset-8">
                            Compare with similar items<span className="text-[#007aff]">.</span>
                         </h3>
                         <button onClick={() => navigate('/compare')} className="px-6 py-3 bg-zinc-50 border border-zinc-200 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black hover:text-white transition-colors">
                             Open Compare Tool
                         </button>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50 border-y border-zinc-100">
                                    <th className="p-6 text-[10px] font-black uppercase text-zinc-400">Attributes</th>
                                    <th className="p-6 text-sm font-bold border-l border-zinc-100 bg-white">This Item</th>
                                     <th className="p-6 text-sm font-bold border-l border-zinc-100 text-zinc-400 italic">Basic Version</th>
                                    <th className="p-6 text-sm font-bold border-l border-zinc-100 text-zinc-400 italic">Premium Version</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {[
                                    { label: 'Customer Rating', val: `${(product.rating || 0).toFixed(1)}/5`, alt: '4.1/5', pro: '4.8/5' },
                                    { label: 'Price', val: `${formatPrice(basePrice)}`, alt: '{formatPrice(650)}', pro: '{formatPrice(1,240)}' },
                                    { label: 'Sold by', val: 'BareSkin Official', alt: 'CloudTail', pro: 'BareSkin Premium' },
                                    { label: 'Natural Ingredients', val: '98%', alt: '85%', pro: '100%' },
                                    { label: 'pH Balanced', val: 'Yes', alt: 'Yes', pro: 'Yes' },
                                    { label: 'Dermatologically Tested', val: 'Yes', alt: 'No', pro: 'Yes' }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-zinc-50 transition-colors">
                                        <td className="p-6 text-[9px] font-black uppercase text-zinc-400 tracking-widest">{row.label}</td>
                                        <td className="p-6 text-sm font-bold text-black border-l border-zinc-100">{row.val}</td>
                                        <td className="p-6 text-sm font-medium text-zinc-500 border-l border-zinc-100 italic">{row.alt}</td>
                                        <td className="p-6 text-sm font-medium text-zinc-500 border-l border-zinc-100 italic">{row.pro}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>

                {/* REVIEW HISTOGRAM (Amazon Style) */}
                <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-4 space-y-8">
                        <h3 className="text-xl font-bold text-zinc-900 italic decoration-[#007aff] underline underline-offset-8">Customer Reviews</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={20} className={s <= Math.round(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-zinc-200 fill-zinc-200"} />)}
                                </div>
                                <span className="text-lg font-bold text-zinc-800">{(product.rating || 0).toFixed(1)} out of 5</span>
                            </div>
                            <p className="text-xs font-medium text-zinc-400 italic">Total Global Ratings: {(product.numReviews || 0).toLocaleString()}</p>
                            
                            <div className="space-y-3 pt-4">
                                {[
                                    { star: 5, pct: 72 },
                                    { star: 4, pct: 18 },
                                    { star: 3, pct: 6 },
                                    { star: 2, pct: 2 },
                                    { star: 1, pct: 2 }
                                ].map(r => (
                                    <div key={r.star} className="flex items-center gap-4 group cursor-pointer hover:text-[#007aff] transition-colors">
                                        <span className="text-xs font-bold w-12">{r.star} Star</span>
                                        <div className="flex-1 h-5 bg-zinc-100 rounded overflow-hidden">
                                            <div className="h-full bg-yellow-400 transition-all group-hover:bg-[#007aff]" style={{ width: `${r.pct}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-zinc-400 w-8">{r.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pt-8 border-t border-zinc-100">
                             <h4 className="text-sm font-black uppercase mb-4">Review this product</h4>
                             <p className="text-xs text-zinc-500 mb-6 leading-relaxed">Share your thoughts with other customers</p>
                             <button 
                                onClick={() => user ? setShowReviewForm(!showReviewForm) : navigate('/login')}
                                className="w-full py-4 border border-zinc-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                             >
                                 {showReviewForm ? 'Cancel Review' : 'Write a product review'}
                             </button>

                             {showReviewForm && (
                                 <form onSubmit={submitReviewHandler} className="mt-8 space-y-6 animate-fade-in">
                                     <div>
                                         <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Rating</label>
                                         <div className="flex gap-2">
                                            {[1,2,3,4,5].map(num => (
                                                <button 
                                                    type="button" 
                                                    key={num} 
                                                    onClick={() => setRating(num)}
                                                    className="focus:outline-none"
                                                >
                                                    <Star size={24} className={num <= rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-200"} />
                                                </button>
                                            ))}
                                         </div>
                                     </div>
                                     <div>
                                         <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Your Review</label>
                                         <textarea 
                                             required
                                             value={comment}
                                             onChange={(e) => setComment(e.target.value)}
                                             className="w-full border border-zinc-200 rounded-xl p-4 text-sm outline-none focus:border-black transition-all resize-none h-32"
                                             placeholder="What did you like or dislike?"
                                         ></textarea>
                                     </div>
                                     
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                         <div>
                                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Before Photo</label>
                                             <input 
                                                 type="file" 
                                                 accept="image/*"
                                                 onChange={(e) => {
                                                     const file = e.target.files[0];
                                                     if (file) {
                                                         const reader = new FileReader();
                                                         reader.onloadend = () => setBeforeImage(reader.result);
                                                         reader.readAsDataURL(file);
                                                     }
                                                 }}
                                                 className="w-full border border-zinc-200 rounded-xl p-3 text-[10px] outline-none focus:border-black transition-all"
                                             />
                                             {beforeImage && (
                                                 <div className="mt-2 w-20 h-20 border border-zinc-100 rounded-xl overflow-hidden">
                                                     <img src={beforeImage} alt="Before Preview" className="w-full h-full object-cover" />
                                                 </div>
                                             )}
                                         </div>
                                         <div>
                                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">After Photo</label>
                                             <input 
                                                 type="file" 
                                                 accept="image/*"
                                                 onChange={(e) => {
                                                     const file = e.target.files[0];
                                                     if (file) {
                                                         const reader = new FileReader();
                                                         reader.onloadend = () => setAfterImage(reader.result);
                                                         reader.readAsDataURL(file);
                                                     }
                                                 }}
                                                 className="w-full border border-zinc-200 rounded-xl p-3 text-[10px] outline-none focus:border-black transition-all"
                                             />
                                             {afterImage && (
                                                 <div className="mt-2 w-20 h-20 border border-zinc-100 rounded-xl overflow-hidden">
                                                     <img src={afterImage} alt="After Preview" className="w-full h-full object-cover" />
                                                 </div>
                                             )}
                                         </div>
                                     </div>

                                     <button 
                                        disabled={submittingReview}
                                        className="w-full bg-black text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#007aff] transition-all disabled:opacity-50"
                                     >
                                         {submittingReview ? 'Submitting...' : 'Submit Review'}
                                     </button>
                                 </form>
                             )}
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-lg font-black uppercase text-[#007aff] tracking-widest underline underline-offset-8">Top Featured Reviews</h3>
                        </div>
                        <div className="space-y-12">
                             {product.reviews && product.reviews.length > 0 ? (
                                 product.reviews.map((rev) => (
                                     <div key={rev._id} className="space-y-4 pb-12 border-b border-zinc-50 last:border-0">
                                         <div className="flex items-center justify-between">
                                             <div className="flex items-center gap-3">
                                                 <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-300">
                                                     <User size={20} />
                                                 </div>
                                                 <div>
                                                     <div className="flex items-center gap-2">
                                                         <span className="text-sm font-bold">{rev.name}</span>
                                                     </div>
                                                 </div>
                                             </div>
                                             <span className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest">
                                                 {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                             </span>
                                         </div>
                                         <div className="flex items-center gap-3 pt-2">
                                             <div className="flex text-yellow-400">
                                                {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= rev.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-200 fill-zinc-200"} />)}
                                             </div>
                                         </div>
                                         <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic flex items-center gap-2">
                                             <CheckCircle2 size={12} className="text-[#007aff]" /> Verified Purchase
                                         </p>
                                         <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl italic">{rev.comment}</p>

                                         {(rev.beforeImage || rev.afterImage) && (
                                             <div className="flex gap-4 pt-2">
                                                 {rev.beforeImage && (
                                                     <div className="relative rounded-xl overflow-hidden border border-zinc-100 w-32 h-32 group">
                                                         <img src={rev.beforeImage} alt="Before" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                                                         <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded">Before</span>
                                                     </div>
                                                 )}
                                                 {rev.afterImage && (
                                                     <div className="relative rounded-xl overflow-hidden border border-zinc-100 w-32 h-32 group">
                                                         <img src={rev.afterImage} alt="After" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                                                         <span className="absolute bottom-2 left-2 bg-[#007aff]/85 text-white text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded">After</span>
                                                     </div>
                                                 )}
                                             </div>
                                         )}
                                         
                                         <div className="flex gap-4 pt-6">
                                             <button className="px-8 py-2.5 border border-zinc-200 rounded-lg text-[9px] font-black uppercase hover:bg-black hover:text-white transition-all flex items-center gap-2">
                                                 Helpful <Zap size={10}/>
                                             </button>
                                             <button className="text-[9px] font-black uppercase text-zinc-300 hover:text-black">Report Review</button>
                                         </div>
                                     </div>
                                 ))
                             ) : (
                                 <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-100">
                                     <Star size={40} className="mx-auto text-zinc-300 mb-4" />
                                     <p className="text-sm font-bold text-zinc-400">No reviews yet.</p>
                                     <p className="text-xs text-zinc-400 mt-2">Be the first to review this product!</p>
                                 </div>
                             )}
                        </div>
                    </div>

                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-40">
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <span className="luxe-subheading text-[#007aff] mb-4 block underline underline-offset-8">You might also like</span>
                                <h2 className="text-6xl text-black">Similar Items<span className="text-zinc-200">.</span></h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(p => (
                                <div 
                                    key={p._id} 
                                    onClick={() => navigate(`/product/${p._id}`)}
                                    className="group cursor-pointer space-y-6"
                                >
                                    <div className="aspect-[4/5] bg-zinc-50 rounded-[2.5rem] overflow-hidden border border-zinc-100 relative">
                                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2000ms]" alt={p.name} />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                                                <Zap size={20}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black italic uppercase text-zinc-400 group-hover:text-black transition-colors">{p.name}</h4>
                                        <span className="text-xs font-black italic mt-2 block">{formatPrice(p.price)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            

            {/* Minimalist Footer Detail */}
            <div className="py-20 border-t border-zinc-50 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-200">BareSkin // Premium Skincare</p>
            </div>
        </div>
        {/* MOBILE STICKY ACTION BAR (Amazon/Flipkart Style) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-3 flex gap-3 z-[250] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <button 
                onClick={() => {
                    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                        toast.error('Please select a size first.');
                        return;
                    }
                    addToCart({ ...product, selectedSize, isSubscription, price }, 1);
                    toast.success(isSubscription ? 'Subscription added to cart!' : 'Added to your cart!');
                }}
                className="flex-1 bg-[#ffd814] hover:bg-[#f7ca00] text-black py-3.5 rounded-full text-xs font-bold transition-all shadow-sm uppercase tracking-widest italic"
            >
                Add to Cart
            </button>
            <button 
                onClick={() => { 
                    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                        toast.error('Please select a size first.');
                        return;
                    }
                    if (!user) {
                        toast('Please create an account to place an order.', { icon: '👋' });
                        navigate('/register');
                        return;
                    }
                    addToCart({ ...product, selectedSize, isSubscription, price }, 1); 
                    navigate('/checkout'); 
                }}
                className="flex-1 bg-[#ffa41c] hover:bg-[#ff8f00] text-black py-3.5 rounded-full text-xs font-bold transition-all shadow-sm uppercase tracking-widest italic"
            >
                Buy Now
            </button>
        </div>
        </>
    );

};

export default ProductDetails;
