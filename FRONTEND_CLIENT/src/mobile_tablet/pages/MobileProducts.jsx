import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { ProductContext } from '../../context/ProductContext';
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const categories = [
    "All Products",
    "Face Care",
    "Lip Care",
    "Hair Care",
    "Body Care",
    "Makeup",
    "Beauty",
    "Men's Care"
];

const concerns = [
    "All Concerns",
    "Acne",
    "Aging",
    "Dullness",
    "Dryness",
    "Sensitivity",
    "Dark Spots"
];



const MobileProducts = () => {
    const { formatPrice } = useCurrency();
    const { products, loading } = useContext(ProductContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryQuery = queryParams.get('category');
    const searchParam = queryParams.get('search');

    const priceRanges = [
        { label: "All Prices", min: 0, max: 100000 },
        { label: `Under ${formatPrice(500)}`, min: 0, max: 500 },
        { label: `${formatPrice(500)} - ${formatPrice(1000)}`, min: 500, max: 1000 },
        { label: `${formatPrice(1000)} - ${formatPrice(2000)}`, min: 1000, max: 2000 },
        { label: `Over ${formatPrice(2000)}`, min: 2000, max: 100000 }
    ];
    
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryQuery || "All Products");
    const [selectedConcern, setSelectedConcern] = useState("All Concerns");
    const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
    const [searchQuery, setSearchQuery] = useState(searchParam || "");
    const [sortBy, setSortBy] = useState("Newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState("small"); // 'small' (2 columns) or 'list' (1 column)

    useEffect(() => {
        if (!loading && products) {
            let filtered = [...products];

            if (selectedCategory !== "All Products") {
                filtered = filtered.filter(p => p.category === selectedCategory);
            }

            if (selectedConcern !== "All Concerns") {
                filtered = filtered.filter(p => p.skinType?.includes(selectedConcern) || (p.description && p.description.includes(selectedConcern)));
            }

            filtered = filtered.filter(p => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max);

            if (searchQuery) {
                filtered = filtered.filter(p => 
                    (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            }

            if (sortBy === "Price: Low to High") {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortBy === "Price: High to Low") {
                filtered.sort((a, b) => b.price - a.price);
            }

            setFilteredProducts(filtered);
        }
    }, [selectedCategory, selectedConcern, selectedPriceRange, searchQuery, sortBy, products, loading]);

    useEffect(() => {
        if (categoryQuery) setSelectedCategory(categoryQuery);
        if (searchParam) setSearchQuery(searchParam);
    }, [categoryQuery, searchParam]);

    return (
        <div className="pt-24 pb-20 bg-white min-h-screen overflow-x-hidden">
            <div className="px-4">
                
                {/* Header Title & Dynamic Search */}
                <div className="flex flex-col gap-4 mb-6">
                    <div>
                        <span className="text-zinc-400 text-[9px] font-black uppercase tracking-wider">Catalog</span>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                            {selectedCategory === "All Products" ? "Browse Catalog" : selectedCategory}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input 
                                type="text" 
                                placeholder="Search catalog..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-zinc-100/80 rounded-xl text-[10px] font-bold outline-none border border-transparent focus:border-zinc-200/50 transition-all"
                            />
                        </div>
                        <button 
                            onClick={() => setIsFilterOpen(true)}
                            className="p-3 bg-black text-white rounded-xl active:scale-95 transition-all flex items-center justify-center"
                        >
                            <SlidersHorizontal size={14} />
                        </button>
                    </div>
                </div>

                {/* Horizontal Quick Category Scroll */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setSearchQuery("");
                            }}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                                selectedCategory === cat 
                                ? 'bg-black text-white border-black' 
                                : 'bg-zinc-50 text-zinc-500 border-zinc-100 hover:bg-zinc-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Filter and View Toggles Bar */}
                <div className="flex items-center justify-between py-3 border-y border-zinc-100 mb-6 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Showing {filteredProducts.length} Items</span>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setViewMode('small')}
                            className={`p-1 transition-all ${viewMode === 'small' ? 'text-black scale-110' : 'opacity-40'}`}
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1 transition-all ${viewMode === 'list' ? 'text-black scale-110' : 'opacity-40'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Main Products Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#007aff] animate-loading-bar w-0"></div>
                        </div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className={`grid gap-3 ${
                        viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2'
                    }`}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} viewMode={viewMode} />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-center px-6 bg-zinc-50/40">
                        <h4 className="text-sm font-black uppercase text-zinc-400 mb-2">No Products Found</h4>
                        <button 
                            onClick={() => { setSelectedCategory("All Products"); setSearchQuery(""); }}
                            className="px-6 py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-wider"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Sheet Filter Overlay */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex justify-end">
                    <div className="bg-white w-[85%] max-w-sm h-full p-6 flex flex-col relative animate-slide-in-right overflow-y-auto">
                        <button 
                            onClick={() => setIsFilterOpen(false)}
                            className="absolute top-6 right-6 p-2 bg-zinc-100 rounded-xl"
                        >
                            <X size={16} />
                        </button>

                        <h3 className="text-lg font-black uppercase mb-8 mt-2">Filters</h3>

                        <div className="flex-grow flex flex-col gap-6 pb-6">
                            <div>
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-3">Skin Concern</span>
                                <div className="flex flex-wrap gap-2">
                                    {concerns.map(con => (
                                        <button 
                                            key={con}
                                            onClick={() => setSelectedConcern(con)}
                                            className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider border ${
                                                selectedConcern === con 
                                                ? 'bg-[#007aff] text-white border-[#007aff]' 
                                                : 'bg-zinc-50 text-zinc-500 border-zinc-100'
                                            }`}
                                        >
                                            {con}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-3">Price Range</span>
                                <div className="flex flex-wrap gap-2">
                                    {priceRanges.map(range => (
                                        <button 
                                            key={range.label}
                                            onClick={() => setSelectedPriceRange(range)}
                                            className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider border ${
                                                selectedPriceRange.label === range.label 
                                                ? 'bg-[#007aff] text-white border-[#007aff]' 
                                                : 'bg-zinc-50 text-zinc-500 border-zinc-100'
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-3">Sort By</span>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-zinc-100 rounded-xl px-4 py-3 text-[10px] font-bold outline-none border border-transparent appearance-none"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option>Newest</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
            {/* Floating Filter Button for easy thumb reach */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] md:hidden">
                <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all border border-zinc-800"
                >
                    <SlidersHorizontal size={12} /> Filter & Sort
                </button>
            </div>
        </div>
    );
};

export default MobileProducts;
