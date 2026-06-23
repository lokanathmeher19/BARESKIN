import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { Heart, Share2, Star, ShieldCheck, Truck, MapPin, RefreshCw, Zap, CheckCircle2, Leaf, Droplets, ChevronLeft, ShoppingBag } from 'lucide-react';
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
    const [pincode, setPincode] = useState('');
    const [checkingPincode, setCheckingPincode] = useState(false);
    const [pincodeData, setPincodeData] = useState(null);
    const { addToCart, cartCount } = useContext(CartContext);
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
            <Link to="/products" className="text-sm text-[#007aff] mt-4 inline-block font-medium">Back to Store</Link>
        </div>
    );

    const images = [product.image, ...(product.images || [])].filter(Boolean);
    const selectedVariant = product.variants?.find(v => v.size === selectedSize);
    const basePrice = selectedVariant ? selectedVariant.price : (product.price || 0);

    return (
        <div className="bg-white min-h-screen pb-24 font-sans safe-top">
            {/* Transparent/Sticky Header */}
            <div className="fixed top-0 left-0 right-0 z-[110] bg-white border-b border-zinc-100 px-3 py-2.5 flex justify-between items-center shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 -ml-1 text-zinc-800">
                    <ChevronLeft size={24}/>
                </button>
                <div className="flex gap-2 items-center">
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

            <div className="pt-[52px]">
                {/* Full Bleed Image Gallery */}
                <div className="bg-white w-full border-b border-zinc-100 relative">
                    <div className="w-full aspect-[4/5] flex items-center justify-center p-4">
                        <img 
                            src={images[selectedImage]} 
                            alt={product.name} 
                            className="w-full h-full object-contain mix-blend-darken" 
                        />
                    </div>
                    {/* Dots */}
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
                                <span className="text-3xl font-medium text-zinc-900">{formatPrice(basePrice)}</span>
                            </div>
                        )}
                        {product.discountPercentage === 0 && (
                             <span className="text-3xl font-medium text-zinc-900 block">{formatPrice(basePrice)}</span>
                        )}
                        {product.discountPercentage > 0 && (
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                M.R.P.: <span className="line-through">{formatPrice(Math.round(basePrice / (1 - product.discountPercentage / 100)))}</span>
                            </p>
                        )}
                        <p className="text-xs text-zinc-900 font-medium mt-1">Inclusive of all taxes</p>
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

                {/* Delivery & Pincode */}
                <div className="p-4 bg-white">
                    <h3 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                        Delivery Options
                    </h3>
                    
                    <div className="flex gap-2">
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
                        <div className="mt-3 text-xs font-medium text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                            Delivery available to {pincodeData.City}, {pincodeData.State}
                        </div>
                    )}

                    <div className="space-y-4 pt-5">
                        <div className="flex items-start gap-3">
                            <RefreshCw size={20} className="text-zinc-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-zinc-900">7 Days Returnable</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck size={20} className="text-zinc-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-zinc-900">Secure transaction</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-2 bg-zinc-100 w-full"></div>

                {/* About & Trust Badges */}
                <div className="p-4 bg-white space-y-5">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 mb-3">Product Description</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            {product.description || "Dermatologically-tested advanced formulation made with clinical accuracy to deliver visible skincare improvements. Specially designed for everyday use."}
                        </p>
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
            </div>

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 z-[210] bg-white border-t border-zinc-200 px-4 py-3 flex gap-3 pb-safe">
                <button 
                    onClick={() => {
                        addToCart({ ...product, selectedSize, price: basePrice }, 1);
                        toast.success('Added to Bag');
                    }}
                    className="flex-1 py-3.5 bg-white border border-zinc-300 text-zinc-900 rounded-full text-sm font-semibold active:bg-zinc-50 transition-colors flex items-center justify-center"
                >
                    Add to Cart
                </button>
                <button 
                    onClick={() => {
                        addToCart({ ...product, selectedSize, price: basePrice }, 1);
                        navigate('/checkout');
                    }}
                    className="flex-1 py-3.5 bg-[#ffa41c] text-zinc-900 rounded-full text-sm font-semibold active:scale-[0.98] transition-transform flex items-center justify-center"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default MobileProductDetails;
