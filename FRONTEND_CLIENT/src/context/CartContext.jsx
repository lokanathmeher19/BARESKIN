import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [promoCode, setPromoCode] = useState(null);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            // Debounce or just simple fire and forget to sync with DB
            api.post('/auth/sync-cart', { cart }).catch(err => console.error('Cart sync failed', err));
        }
    }, [cart]);

    // Listen for login events to merge/load cart from DB
    useEffect(() => {
        const handleAuthChange = () => {
            const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (savedUser) {
                const userObj = JSON.parse(savedUser);
                if (userObj.cart && userObj.cart.length > 0) {
                    setCart(userObj.cart);
                }
            } else {
                setCart([]); // Clear cart on logout
            }
        };

        window.addEventListener('authChange', handleAuthChange);
        return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => 
                item._id === (product._id || product.id) && 
                item.selectedSize === product.selectedSize
            );
            if (existing) {
                return prev.map(item => 
                    (item._id === (product._id || product.id) && item.selectedSize === product.selectedSize) 
                    ? { ...item, qty: item.qty + 1 } 
                    : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, selectedSize, qty) => {
        if (qty < 1) return removeFromCart(id, selectedSize);
        setCart(prev => prev.map(item => 
            ((item._id || item.id) === id && item.selectedSize === selectedSize) 
            ? { ...item, qty } 
            : item
        ));
    };

    const removeFromCart = (id, selectedSize) => {
        setCart(prev => prev.filter(item => 
            !((item._id || item.id) === id && item.selectedSize === selectedSize)
        ));
    };

    const clearCart = () => {
        setCart([]);
        setPromoCode(null);
    };

    const applyPromo = (promo) => {
        setPromoCode(promo);
    };

    const removePromo = () => {
        setPromoCode(null);
    };

    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    
    // Default fallback discount: 25% (simulating previous hardcoded behavior if no promo applied)
    // Actually, if we are implementing proper Promo Codes, let's keep the hardcoded 25% IF no promo is applied to maintain existing UI feel, OR we replace it.
    // Let's replace the hardcoded discount entirely. If no promo, discount is 0.
    const discountAmount = promoCode 
        ? (promoCode.discountType === 'percentage' 
            ? (cartTotal * (promoCode.discountValue / 100)) 
            : promoCode.discountValue)
        : 0;
        
    const finalTotal = Math.max(0, cartTotal - discountAmount);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount, finalTotal, discountAmount, promoCode, applyPromo, removePromo }}>
            {children}
        </CartContext.Provider>
    );
};
