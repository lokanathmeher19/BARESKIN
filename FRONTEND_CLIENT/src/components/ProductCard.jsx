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
                className="flex flex-col md:flex-row bg-white border border-transparent hover:border-zinc-100 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group p-4 md:p-6 gap-6 md:gap-10 cursor-pointer relative rounded-2xl"
            >
                {/* Section 1: Image */}
                <div className="w-full md:w-56 h-56 md:h-48 bg-zinc-50 rounded-2xl p-4 shrink-0 overflow-hidden relative">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-darken scale-90 group-hover:scale-100 transition-transform duration-500"
                    />
                    {/* Wishlist Heart - Mobile absolute to image, Desktop absolute to card */}
                    <button 
                        onClick={handleWishlist}
                        className={`absolute top-4 right-4 md:-right-4 md:hidden transition-all duration-300 transform hover:scale-125 z-30 ${isInWishlist(product._id) ? 'text-red-500' : 'text-zinc-300 hover:text-red-400'}`}
                    >
                        <Heart size={24} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Section 2: Details */}
                <div className="flex-grow flex flex-col justify-center">
                    <div className="flex flex-col gap-1 mb-3">
                        <h3 className="text-xl font-bold text-zinc-800 line-clamp-2 hover:text-[#007aff] transition-colors pr-10">{product.name}</h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-green-700 text-white px-2 py-0.5 rounded text-[11px] font-black">
                                {product.rating || '4.3'} <Star size={12} className="fill-white" />
                            </div>
                            <span className="text-zinc-400 text-xs font-bold">({(product.numReviews || 0).toLocaleString()} Reviews)</span>
                        </div>
                    </div>
                    
                    <ul className="space-y-2 mb-4 hidden sm:block">
                        <li className="text-[11px] font-medium text-zinc-500 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zinc-300"></div> Skin Type: {product.skinType?.join(', ') || 'All Skin Types'}</li>
                        <li className="text-[11px] font-medium text-zinc-500 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-zinc-300"></div> {product.description?.substring(0, 120)}...</li>
                    </ul>

                    <div className="flex items-center gap-2 mt-auto">
                        <ShieldCheck size={18} className="text-[#007aff]" />
                        <span className="text-[10px] font-black uppercase text-[#007aff] tracking-widest italic">BareSkin. Assured</span>
                    </div>
                </div>

                {/* Section 3: Pricing & Actions */}
                <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-zinc-100 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center relative">
                    {/* Desktop Wishlist Heart */}
                    <button 
                        onClick={handleWishlist}
                        className={`hidden md:block absolute top-0 right-0 transition-all duration-300 transform hover:scale-125 z-30 ${isInWishlist(product._id) ? 'text-red-500' : 'text-zinc-300 hover:text-red-400'}`}
                    >
                        <Heart size={24} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                    </button>

                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-black">{formatPrice(product.price)}</span>
                        {product.discountPercentage > 0 && (
                            <>
                                <span className="text-sm text-zinc-400 line-through">{formatPrice(Math.round(product.price / (1 - product.discountPercentage / 100)))}</span>
                                <span className="text-sm text-green-600 font-black uppercase italic">{product.discountPercentage}% OFF</span>
                            </>
                        )}
                    </div>
                    <p className="text-[11px] font-medium text-zinc-500 mb-6 italic uppercase tracking-widest">Free Delivery</p>
                    
                    <div className="flex gap-3 mt-auto">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 py-3 bg-zinc-100 text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all text-center"
                        >
                            + Cart
                        </button>
                        <button 
                            onClick={handleBuyNow}
                            className="flex-1 py-3 bg-[#007aff] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all text-center shadow-lg shadow-[#007aff]/30"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                        <span className="bg-black text-white px-8 py-3 rounded-full font-black tracking-[0.3em] uppercase italic text-sm">Sold Out</span>
                    </div>
                )}
            </div>
        );
    }

    const isSmall = viewMode === 'small';

    return (
        <div 
            onClick={() => navigate(`/product/${product._id}`)}
            className={`flex flex-col bg-white h-full relative cursor-pointer border border-transparent hover:border-zinc-100 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group ${isSmall ? 'p-3' : 'p-4'}`}
        >
            {/* Top Right: Wishlist */}
            <button 
                onClick={handleWishlist}
                className={`absolute top-4 right-4 z-30 transition-all duration-300 transform hover:scale-125 ${isInWishlist(product._id) ? 'text-red-500' : 'text-zinc-300 hover:text-red-400'}`}
            >
                <Heart size={20} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
            </button>

            {/* Image Section */}
            <div className={`relative mb-3 ${isSmall ? 'h-32' : 'h-48 sm:h-60'} bg-zinc-50/30 rounded-2xl p-2 md:p-4`}>
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-darken scale-90 group-hover:scale-95 transition-transform duration-700"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow">
                {/* Title */}
                <h3 className={`text-zinc-900 font-bold mb-0.5 line-clamp-1 leading-snug tracking-tight ${isSmall ? 'text-[12px]' : 'text-[15px]'}`}>
                    {product.name}
                </h3>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-green-700 text-white px-2 py-0.5 rounded text-[11px] font-black">
                        {product.rating || '4.3'} <Star size={12} className="fill-white" />
                    </div>
                    <span className="text-zinc-500 text-[10px] font-bold">({(product.numReviews || 0).toLocaleString()} Reviews)</span>
                    <div className="flex items-center gap-1 text-[#007aff] font-black italic ml-auto">
                         <ShieldCheck size={16} />
                         <span className="text-[10px] uppercase tracking-tighter">Assured</span>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="flex items-baseline gap-2 mb-4">
                    <span className={`font-black text-black ${isSmall ? 'text-base' : 'text-xl'}`}>{formatPrice(product.price)}</span>
                    {product.discountPercentage > 0 && (
                        <>
                            <span className="text-zinc-400 line-through text-[13px]">{formatPrice(Math.round(product.price / (1 - product.discountPercentage / 100)))}</span>
                            <span className="text-green-600 font-black text-[13px] uppercase italic">{product.discountPercentage}% OFF</span>
                        </>
                    )}
                </div>

                {/* Offers */}
                <div className="space-y-1 mb-3">
                    {product.promoTag && (
                        <p className="text-green-600 text-[10px] font-bold tracking-tight">{product.promoTag}</p>
                    )}
                    {product.badgeText ? (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest inline-block">{product.badgeText}</span>
                    ) : product.price < 500 ? (
                        <p className="text-zinc-400 text-[9px] font-medium uppercase tracking-widest italic">Free Delivery</p>
                    ) : null}
                </div>

                {/* Quick Buy & Cart */}
                <div className="mt-auto pt-3 border-t border-zinc-50 transition-all duration-300 opacity-100">
                    <div className="flex gap-2">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 py-2 bg-zinc-100 text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all"
                        >
                            + Cart
                        </button>
                        <button 
                            onClick={handleBuyNow}
                            className="flex-1 py-2 bg-[#007aff] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            
            {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <span className={`bg-black text-white px-4 py-1.5 rounded-full font-medium tracking-widest uppercase italic ${isSmall ? 'text-[6px]' : 'text-[10px]'}`}>Sold Out</span>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
