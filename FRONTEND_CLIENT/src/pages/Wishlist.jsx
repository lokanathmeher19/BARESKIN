import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

const Wishlist = () => {
    const { wishlist } = useContext(WishlistContext);

    return (
        <div className="pt-32 pb-20 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
                <BackButton className="mb-10" />
                
                <div className="flex items-center justify-between mb-16">
                    <div>
                        <span className="luxe-subheading text-[#007aff] mb-4 block underline underline-offset-8">Saved Items</span>
                        <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Your Wishlist<span className="text-zinc-200">.</span></h1>
                    </div>
                    <div className="hidden md:flex items-center gap-4 px-8 py-4 bg-zinc-50 rounded-3xl border border-zinc-100 shadow-sm">
                        <Heart className="text-red-500 fill-red-500" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{wishlist.length} Items Saved</span>
                    </div>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlist.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                        <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-200 mb-8 border border-zinc-100">
                            <Heart size={40} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4">Wishlist is Empty</h3>
                        <p className="text-sm text-zinc-400 font-medium italic mb-10 leading-relaxed">You haven't saved any products yet. Explore our catalog and save your favorites for later.</p>
                        <Link 
                            to="/products" 
                            className="w-full py-5 bg-black text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#007aff] transition-all duration-500 italic flex items-center justify-center gap-4"
                        >
                            Explore Products <ArrowRight size={16} />
                        </Link>
                    </div>
                )}

                {wishlist.length > 0 && (
                    <div className="mt-24 p-12 bg-zinc-900 rounded-[3rem] text-white relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Ready to purchase?</h2>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic">Free express shipping on all wishlist items today.</p>
                            </div>
                            <Link to="/cart" className="px-12 py-5 bg-[#007aff] hover:bg-white hover:text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 italic shadow-xl shadow-[#007aff]/20 flex items-center gap-4">
                                <ShoppingBag size={16} /> Go to Cart
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
