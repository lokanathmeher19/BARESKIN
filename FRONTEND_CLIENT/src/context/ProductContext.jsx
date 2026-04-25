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
            setProducts(res.data.data || res.data.products || res.data || []);

        } catch (err) {
            console.error("Error fetching products", err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

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
