import { useCurrency } from '../context/CurrencyContext';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ChevronRight, Plus, ShoppingBag, Star, ShieldCheck, Heart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, viewMode = 'grid' }) => {
    const { formatPrice } = useCurrency();

    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        toast.success(`'${product.name}' added to your cart.`, {
            icon: '🛍️',
            style: {
                borderRadius: '20px',
                background: '#000',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '600',
            },
        });
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        navigate('/checkout');

    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    if (viewMode === 'list') {
        return (
            <div 
                onClick={() => navigate(`/product/${product._id}`)}
                className="flex flex-col md:flex-row bg-white border border-zinc-100/50 hover:border-zinc-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 group p-6 gap-6 md:gap-10 cursor-pointer relative rounded-[2rem]"
            >
                {/* Section 1: Image */}
                <div className="w-full md:w-56 h-56 md:h-48 bg-[#fcfcfd] rounded-2xl p-4 shrink-0 overflow-hidden relative border border-zinc-100/50">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-darken scale-90 group-hover:scale-95 transition-transform duration-700"
                    />
                    {/* Wishlist Heart - Mobile absolute to image, Desktop absolute to card */}
                    <button 
                        onClick={handleWishlist}
                        className={`absolute top-4 right-4 md:-right-4 md:hidden transition-all duration-300 transform hover:scale-110 z-30 ${isInWishlist(product._id) ? 'text-rose-500' : 'text-zinc-300 hover:text-rose-400'}`}
                    >
                        <Heart size={20} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Section 2: Details */}
                <div className="flex-grow flex flex-col justify-center">
                    <div className="flex flex-col gap-1 mb-3 font-sans">
                        <h3 className="text-xl font-medium text-zinc-900 line-clamp-2 hover:text-zinc-600 transition-colors pr-10 font-sans">{product.name}</h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-zinc-900 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold font-sans">
                                {product.rating || '4.3'} <Star size={10} className="fill-white text-white" />
                            </div>
                            <span className="text-zinc-400 text-[11px] font-medium">({(product.numReviews || 0).toLocaleString()} Reviews)</span>
                        </div>
                    </div>
                    
                    <ul className="space-y-2 mb-4 hidden sm:block font-sans">
                        <li className="text-[11px] font-normal text-zinc-500 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zinc-300"></div> Skin Type: {product.skinType?.join(', ') || 'All Skin Types'}</li>
                        <li className="text-[11px] font-normal text-zinc-500 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zinc-300"></div> {product.description?.substring(0, 120)}...</li>
                    </ul>

                    <div className="flex items-center gap-2 mt-auto">
                        <ShieldCheck size={16} className="text-zinc-400" />
                        <span className="text-[10px] font-semibold uppercase text-zinc-400 tracking-[0.15em] font-sans">BareSkin. Assured</span>
                    </div>
                </div>

                {/* Section 3: Pricing & Actions */}
                <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-zinc-100 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center relative font-sans">
                    {/* Desktop Wishlist Heart */}
                    <button 
                        onClick={handleWishlist}
                        className={`hidden md:block absolute top-0 right-0 transition-all duration-300 transform hover:scale-110 z-30 ${isInWishlist(product._id) ? 'text-rose-500' : 'text-zinc-300 hover:text-rose-400'}`}
                    >
                        <Heart size={22} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                    </button>

                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-light text-zinc-900">{formatPrice(product.price)}</span>
                        {product.discountPercentage > 0 && (
                            <>
                                <span className="text-sm text-zinc-400 line-through">{formatPrice(Math.round(product.price / (1 - product.discountPercentage / 100)))}</span>
                                <span className="text-sm text-rose-600 font-semibold uppercase tracking-wider">{product.discountPercentage}% OFF</span>
                            </>
                        )}
                    </div>
                    <p className="text-[11px] font-medium text-zinc-400 mb-6 tracking-wider uppercase font-sans">Free Delivery</p>
                    
                    <div className="flex gap-3 mt-auto">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 py-3 bg-zinc-50 text-zinc-800 text-[11px] font-semibold uppercase tracking-wider rounded-full hover:bg-zinc-100 transition-all text-center border border-zinc-100/80"
                        >
                            + Cart
                        </button>
                        <button 
                            onClick={handleBuyNow}
                            className="flex-1 py-3 bg-zinc-900 text-white text-[11px] font-semibold uppercase tracking-wider rounded-full hover:bg-black transition-all text-center shadow-md shadow-black/10"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-[2rem]">
                        <span className="bg-zinc-900 text-white px-8 py-3 rounded-full font-semibold tracking-[0.2em] uppercase text-xs font-sans">Sold Out</span>
                    </div>
                )}
            </div>
        );
    }

    const isSmall = viewMode === 'small';

    return (
        <div 
            onClick={() => navigate(`/product/${product._id}`)}
            className={`flex flex-col bg-white h-full relative cursor-pointer border border-zinc-100/50 hover:border-zinc-200 hover:shadow-lg transition-all duration-500 group overflow-hidden font-sans ${isSmall ? 'rounded-2xl p-2.5' : 'rounded-[2rem] p-4 sm:p-6'}`}
        >
            {/* Top Right: Wishlist */}
            <button 
                onClick={handleWishlist}
                className={`absolute top-4 right-4 z-30 transition-all duration-300 transform hover:scale-110 ${isInWishlist(product._id) ? 'text-rose-500' : 'text-zinc-300 hover:text-rose-400'}`}
            >
                <Heart size={18} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
            </button>

            {/* Image Section */}
            <div className={`relative mb-3 ${isSmall ? 'h-28 sm:h-32 p-2 rounded-xl' : 'h-40 sm:h-48 md:h-64 p-4 md:p-6 rounded-2xl'} bg-[#fcfcfd] overflow-hidden border border-zinc-100/50`}>
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-darken scale-95 group-hover:scale-100 transition-transform duration-700"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow font-sans">
                {/* Brand / Mini Info */}
                <span className={`text-[#007aff] font-bold uppercase tracking-widest mb-1 ${isSmall ? 'text-[8px]' : 'text-[10px]'}`}>
                    {product.brand || 'BareSkin'}
                </span>

                {/* Title */}
                <h3 className={`text-zinc-900 font-bold mb-1.5 line-clamp-2 leading-snug tracking-tight font-sans ${isSmall ? 'text-[11px]' : 'text-[16px]'}`}>
                    {product.name}
                </h3>

                {/* Rating & Reviews */}
                <div className={`flex items-center gap-1.5 mb-2.5 ${isSmall ? '' : 'mb-3'}`}>
                    <div className="flex items-center gap-0.5">
                        <Star size={isSmall ? 10 : 12} className="fill-[#007aff] text-[#007aff]" />
                        <span className={`font-bold text-zinc-900 ${isSmall ? 'text-[10px]' : 'text-xs'}`}>{product.rating || '4.3'}</span>
                    </div>
                    <span className={`text-zinc-400 font-medium ${isSmall ? 'text-[9px]' : 'text-[10px]'}`}>({(product.numReviews || 0).toLocaleString()})</span>
                    {!isSmall && (
                        <div className="flex items-center gap-1 text-zinc-400 ml-auto">
                            <ShieldCheck size={14} />
                            <span className="text-[9px] uppercase font-semibold tracking-wider">Assured</span>
                        </div>
                    )}
                </div>

                {/* Pricing Section */}
                <div className="flex items-baseline gap-1.5 mb-2">
                    <span className={`font-black text-zinc-900 ${isSmall ? 'text-sm' : 'text-2xl'}`}>{formatPrice(product.price)}</span>
                    {product.discountPercentage > 0 && (
                        <>
                            <span className={`text-zinc-400 line-through ${isSmall ? 'text-[9px]' : 'text-[12px]'}`}>{formatPrice(Math.round(product.price / (1 - product.discountPercentage / 100)))}</span>
                            <span className={`text-rose-600 font-black uppercase tracking-wider ${isSmall ? 'text-[8px]' : 'text-[11px]'}`}>{product.discountPercentage}% OFF</span>
                        </>
                    )}
                </div>

                {/* Quick Add Button */}
                <div className="mt-auto pt-2">
                    <button 
                        onClick={handleAddToCart}
                        className={`w-full bg-white border border-zinc-200 text-zinc-900 font-black uppercase tracking-widest rounded-xl hover:bg-zinc-50 transition-all ${isSmall ? 'py-1.5 text-[9px]' : 'py-2.5 text-[10px]'}`}
                    >
                        Add to bag
                    </button>
                </div>
            </div>
            
            {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                    <span className={`bg-zinc-900 text-white px-4 py-1.5 rounded-full font-semibold tracking-[0.15em] uppercase text-[10px] font-sans`}>Sold Out</span>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
