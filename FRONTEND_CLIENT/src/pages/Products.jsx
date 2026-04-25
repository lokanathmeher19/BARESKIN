import { useCurrency } from '../context/CurrencyContext';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductContext } from '../context/ProductContext';
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown, Filter, X } from 'lucide-react';

const categories = [
    "All Products",
    "Face Care",
    "Lip Care",
    "Hair Care",
    "Body Care",
    "Makeup",
    "Beauty",
    "Men's Care"];

const concerns = [
    "All Concerns",
    "Acne",
    "Aging",
    "Dullness",
    "Dryness",
    "Sensitivity",
    "Dark Spots"
];

const priceRanges = [
    { label: "All Prices", min: 0, max: 100000 },
    { label: "Under {formatPrice(500)}", min: 0, max: 500 },
    { label: "{formatPrice(500)} - {formatPrice(1000)}", min: 500, max: 1000 },
    { label: "{formatPrice(1000)} - {formatPrice(2000)}", min: 1000, max: 2000 },
    { label: "Over {formatPrice(2000)}", min: 2000, max: 100000 }
];

const Products = () => {
    const { formatPrice } = useCurrency();

    const { products, loading } = useContext(ProductContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryQuery = queryParams.get('category');
    const searchParam = queryParams.get('search');
    
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryQuery || "All Products");
    const [selectedConcern, setSelectedConcern] = useState("All Concerns");
    const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
    const [searchQuery, setSearchQuery] = useState(searchParam || "");
    const [sortBy, setSortBy] = useState("Newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState("large"); // default to large grid (2-3 columns)
    const filterRef = useRef(null);

    useEffect(() => {
        if (!loading && products) {
            let filtered = [...products];

            // Category Filter
            if (selectedCategory !== "All Products") {
                filtered = filtered.filter(p => p.category === selectedCategory);
            }

            // Concern Filter
            if (selectedConcern !== "All Concerns") {
                filtered = filtered.filter(p => p.skinType?.includes(selectedConcern) || (p.description && p.description.includes(selectedConcern)));
            }

            // Price Range Filter
            filtered = filtered.filter(p => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max);

            // Search Filter
            if (searchQuery) {
                filtered = filtered.filter(p => 
                    (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            }

            // Sorting
            if (sortBy === "Price: Low to High") {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortBy === "Price: High to Low") {
                filtered.sort((a, b) => b.price - a.price);
            }

            setFilteredProducts(filtered);
        }
    }, [selectedCategory, selectedConcern, selectedPriceRange, searchQuery, sortBy, products, loading]);

    // Handle incoming category from URL
    useEffect(() => {
        if (categoryQuery) {
            setSelectedCategory(categoryQuery);
        }
        if (searchParam) {
            setSearchQuery(searchParam);
        }
    }, [categoryQuery, searchParam]);

    return (
        <div className="pt-24 md:pt-40 pb-20 bg-white min-h-screen overflow-x-hidden">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-16 border-b border-gray-100 pb-10 md:pb-16 text-center md:text-left">
                    <div>
                        <span className="luxe-subheading text-[#007aff] mb-4 block">Store</span>
                        <h1 className="text-4xl md:text-6xl">{selectedCategory === "All Products" ? "Our Products" : selectedCategory}</h1>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative group w-full">
                            <Search size={16} className="absolute left-6 md:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-14 pr-6 py-4 bg-[#f5f5f7] rounded-2xl text-[10px] md:text-xs font-normal tracking-widest outline-none w-full md:w-64 focus:bg-white border border-transparent focus:border-gray-200 transition-all shadow-sm"
                            />
                        </div>
                        {/* Mobile Filter Toggle */}
                        <button 
                            onClick={() => setIsFilterOpen(true)}
                            className="lg:hidden flex items-center justify-center gap-3 w-full sm:w-auto bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-xl"
                        >
                            <Filter size={14} /> Filter & Sort
                        </button>
                    </div>
                </div>

                {/* Mobile Scrollable Categories */}
                <div className="lg:hidden -mx-4 px-4 overflow-x-auto no-scrollbar mb-10 flex gap-4">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`whitespace-nowrap px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                selectedCategory === cat 
                                ? 'bg-black text-white shadow-xl' 
                                : 'bg-zinc-50 text-zinc-400 border border-zinc-100/50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters - Desktop */}
                    <div className="lg:w-64 shrink-0 hidden lg:block">
                        <div className="sticky top-40 space-y-12">
                            <div>
                                <h3 className="text-[10px] flex items-center gap-2 mb-6 uppercase tracking-widest font-black text-[#007aff]">
                                     <SlidersHorizontal size={14} /> Categories
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {categories.map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`text-left text-[11px] font-black tracking-widest transition-all flex items-center justify-between group uppercase italic ${
                                                selectedCategory === cat ? 'text-black translate-x-2' : 'text-zinc-400 hover:text-black hover:translate-x-1'
                                            }`}
                                        >
                                            {cat}
                                            <span className={`w-1.5 h-1.5 rounded-full bg-[#007aff] transition-all duration-500 ${selectedCategory === cat ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 border-t border-zinc-100">
                                <h3 className="text-[10px] mb-6 uppercase tracking-widest font-black text-[#007aff]">Skin Concern</h3>
                                <div className="flex flex-col gap-4">
                                    {concerns.map(con => (
                                        <button 
                                            key={con}
                                            onClick={() => setSelectedConcern(con)}
                                            className={`text-left text-[11px] font-black tracking-widest transition-all uppercase italic ${
                                                selectedConcern === con ? 'text-black' : 'text-zinc-400 hover:text-black'
                                            }`}
                                        >
                                            {con}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 border-t border-zinc-100">
                                <h3 className="text-[10px] mb-6 uppercase tracking-widest font-black text-[#007aff]">Price Range</h3>
                                <div className="flex flex-col gap-4">
                                    {priceRanges.map(range => (
                                        <button 
                                            key={range.label}
                                            onClick={() => setSelectedPriceRange(range)}
                                            className={`text-left text-[11px] font-black tracking-widest transition-all uppercase italic ${
                                                selectedPriceRange.label === range.label ? 'text-black' : 'text-zinc-400 hover:text-black'
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 border-t border-zinc-100">
                                <h3 className="text-[10px] mb-6 uppercase tracking-widest font-black text-zinc-300">Sort By</h3>
                                <select 
                                    className="w-full bg-[#f5f5f7] rounded-xl px-4 py-3 text-[10px] font-medium tracking-widest outline-none border border-transparent focus:border-gray-200 transition-all appearance-none uppercase italic"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option>Newest</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid/List */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="flex items-center justify-center py-40">
                                <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#007aff] animate-loading-bar w-0"></div>
                                </div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between mb-8 text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase italic">
                                    <span>Showing {filteredProducts.length} Items</span>
                                    <div className="flex items-center gap-6">
                                        <button 
                                            onClick={() => setViewMode('small')}
                                            className={`transition-all ${viewMode === 'small' ? 'text-black scale-110' : 'opacity-20 hover:opacity-100'}`}
                                            title="Small Cards"
                                        >
                                            <Grid3X3 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('large')}
                                            className={`hidden sm:block transition-all ${viewMode === 'large' ? 'text-black scale-110' : 'opacity-20 hover:opacity-100'}`}
                                            title="Large Cards"
                                        >
                                            <div className="grid grid-cols-2 gap-0.5">
                                                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                                            </div>
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('list')}
                                            className={`transition-all ${viewMode === 'list' ? 'text-black scale-110' : 'opacity-20 hover:opacity-100'}`}
                                            title="List View"
                                        >
                                            <List size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className={`grid gap-4 md:gap-8 ${
                                    viewMode === 'list' ? 'grid-cols-1' :
                                    viewMode === 'small' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
                                    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                }`}>
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product._id} product={product} viewMode={viewMode} />
                                    ))}
                                </div>
                                <div className="mt-20 text-center border-t border-zinc-50 pt-20">
                                    <span className="text-[10px] uppercase font-black tracking-[0.5em] text-zinc-200">End of Products</span>
                                </div>
                            </>
                        ) : (
                            <div className="py-24 md:py-40 border-2 border-dashed border-zinc-100 rounded-[2.5rem] md:rounded-[3rem] flex flex-col items-center justify-center text-center px-10 bg-zinc-50/30">
                                <h3 className="text-xl font-medium text-gray-300 mb-4 uppercase tracking-[0.2em] italic">No Products Found</h3>
                                <p className="text-[10px] font-medium tracking-widest text-gray-400 mb-8 uppercase">We couldn't find any items matching your search.</p>
                                <button 
                                    onClick={() => {setSelectedCategory("All Products"); setSearchQuery("");}}
                                    className="px-10 py-5 bg-black text-white rounded-full text-[10px] font-black tracking-widest hover:bg-[#007aff] transition-all shadow-lg shadow-black/20 uppercase italic"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Mobile Filter Drawer Overlay */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-[1000] lg:hidden animate-fade-in">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsFilterOpen(false)}></div>
                    <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white p-8 flex flex-col animate-slide-in-right">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl italic">Filters.</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-3 bg-zinc-50 rounded-2xl">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto space-y-12 pb-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#007aff] mb-6">Store Section</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {categories.map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => {setSelectedCategory(cat); setIsFilterOpen(false);}}
                                            className={`text-left px-6 py-4 rounded-2xl text-[11px] font-black tracking-widest transition-all uppercase italic border ${
                                                selectedCategory === cat 
                                                ? 'bg-black text-white border-black' 
                                                : 'bg-zinc-50 text-gray-400 border-transparent'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#007aff] mb-6">Order By</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {["Newest", "Price: Low to High", "Price: High to Low"].map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => {setSortBy(opt); setIsFilterOpen(false);}}
                                            className={`text-left px-6 py-4 rounded-2xl text-[11px] font-black tracking-widest transition-all uppercase italic border ${
                                                sortBy === opt 
                                                ? 'bg-black text-white border-black' 
                                                : 'bg-zinc-50 text-gray-400 border-transparent'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full bg-black text-white py-6 rounded-full text-[11px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-black/20"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
