import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token && wishlist.length > 0) {
            api.post('/auth/sync-wishlist', { wishlist }).catch(err => console.error('Wishlist sync failed', err));
        }
    }, [wishlist]);

    useEffect(() => {
        if (user && user.wishlist) {
            setWishlist(user.wishlist);
        } else if (!user) {
            setWishlist([]); // Clear on logout
        }
    }, [user]);

    const toggleWishlist = async (product) => {
        if (!user) {
            toast.error("Please login to use Wishlist");
            return;
        }

        const isExist = wishlist.find(item => item._id === product._id);
        let updatedWishlist;

        if (isExist) {
            updatedWishlist = wishlist.filter(item => item._id !== product._id);
            toast.success("Removed from Wishlist");
        } else {
            updatedWishlist = [...wishlist, product];
            toast.success("Added to Wishlist");
        }

        setWishlist(updatedWishlist);
    };

    const isInWishlist = (id) => {
        return wishlist.some(item => item._id === id);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
