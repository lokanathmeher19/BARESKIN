import React, { useContext } from 'react';
import { WishlistContext } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileWishlist = () => {
    const { wishlist } = useContext(WishlistContext);

    return (
        <div className="pt-24 pb-32 px-4 bg-white min-h-screen">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Saved Items</span>
                    <h2 className="text-2xl font-black uppercase">My Wishlist</h2>
                </div>
                <span className="text-[9px] font-black uppercase bg-red-50 text-red-500 px-2 py-1 rounded">
                    {wishlist.length} Items
                </span>
            </div>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {wishlist.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-200 mb-6">
                        <Heart size={28} />
                    </div>
                    <h3 className="text-lg font-black uppercase mb-2">Wishlist is Empty</h3>
                    <p className="text-xs text-zinc-400 mb-6 max-w-[250px]">Explore our science and save your favorite formulations for later.</p>
                    <Link to="/products" className="px-6 py-3.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        Shop Now <ArrowRight size={14} />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MobileWishlist;
