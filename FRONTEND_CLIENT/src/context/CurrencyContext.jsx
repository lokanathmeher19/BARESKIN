import React, { createContext, useState, useEffect, useContext } from 'react';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState({ symbol: '₹', code: 'INR', rate: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocationAndCurrency = async () => {
            try {
                // Fetch user's IP-based location
                const locRes = await fetch('https://ipapi.co/json/');
                const locData = await locRes.json();
                
                const userCurrency = locData.currency || 'INR';

                // If not INR, fetch exchange rate. For simplicity, we hardcode approximations or use an API.
                // Since this is a demo, we will use hardcoded approximations to avoid API rate limits.
                const rates = {
                    'INR': 1,
                    'USD': 0.012,
                    'EUR': 0.011,
                    'GBP': 0.0095
                };

                const symbols = {
                    'INR': '₹',
                    'USD': '$',
                    'EUR': '€',
                    'GBP': '£'
                };

                // If the user's currency is supported, use it. Otherwise fallback to USD if outside India.
                let selectedCode = 'INR';
                if (userCurrency !== 'INR') {
                    if (rates[userCurrency]) {
                        selectedCode = userCurrency;
                    } else {
                        selectedCode = 'USD'; // Default global currency
                    }
                }

                setCurrency({
                    symbol: symbols[selectedCode],
                    code: selectedCode,
                    rate: rates[selectedCode]
                });
            } catch (error) {
                console.error('Failed to detect currency, defaulting to INR:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocationAndCurrency();
    }, []);

    const formatPrice = (inrPrice) => {
        if (typeof inrPrice === 'string') {
            inrPrice = parseFloat(inrPrice.replace(/,/g, ''));
        }
        if (isNaN(inrPrice)) return `${currency.symbol}0`;
        
        const converted = inrPrice * currency.rate;
        
        // Return without decimals for INR, with 2 decimals for others
        return `${currency.symbol}${currency.code === 'INR' ? Math.round(converted).toLocaleString() : converted.toFixed(2)}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, formatPrice, loading }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
