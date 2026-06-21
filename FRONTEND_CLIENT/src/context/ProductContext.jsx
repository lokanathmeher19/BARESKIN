import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/products');
            const fetched = res.data.data || res.data.products || res.data || [];
            if (fetched.length === 0) {
                setProducts(getMockProducts());
            } else {
                setProducts(fetched);
            }
        } catch (err) {
            console.error("Error fetching products", err);
            setError(err.response?.data?.message || err.message);
            // Fallback to mock data so the UI doesn't look broken when backend is offline
            setProducts(getMockProducts());
        } finally {
            setLoading(false);
        }
    };

    const getMockProducts = () => [
        {
            _id: 'm1',
            name: 'Advanced Face Toner',
            price: 899,
            image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=500&q=60',
            rating: 4.8,
            numReviews: 124,
            category: 'Face Care',
            discountPercentage: 10,
            badgeText: 'Bestseller',
            skinType: ['Oily', 'Combination']
        },
        {
            _id: 'm2',
            name: 'Salicylic Face Cleanser',
            price: 599,
            image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=500&q=60',
            rating: 4.6,
            numReviews: 89,
            category: 'Face Care',
            skinType: ['Acne-Prone']
        },
        {
            _id: 'm3',
            name: 'Active Face Serum',
            price: 1299,
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=60',
            rating: 4.9,
            numReviews: 210,
            category: 'Face Care',
            badgeText: 'New',
            skinType: ['All Skin Types']
        },
        {
            _id: 'm4',
            name: 'Hydrating Body Lotion',
            price: 749,
            image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=500&q=60',
            rating: 4.5,
            numReviews: 45,
            category: 'Body Care',
            skinType: ['Dry']
        }
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProductState = (id) => {
        setProducts(prev => prev.filter(p => p._id !== id));
    };

    const addProductState = (product) => {
        setProducts(prev => [...prev, product]);
    };

    const updateProductState = (updatedProduct) => {
        setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    };

    return (
        <ProductContext.Provider value={{ 
            products, 
            loading, 
            error, 
            refreshProducts: fetchProducts,
            deleteProductState,
            addProductState,
            updateProductState
        }}>
            {children}
        </ProductContext.Provider>
    );
};
