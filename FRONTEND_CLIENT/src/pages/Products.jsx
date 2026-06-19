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
                        <span className="text-[#86868b] text-[11px] font-medium uppercase tracking-[0.2em] mb-3 block font-sans">Store</span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-black font-sans">{selectedCategory === "All Products" ? "Our Products" : selectedCategory}</h1>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative group w-full">
                            <Search size={16} className="absolute left-6 md:left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-14 pr-6 py-4 bg-[#f5f5f7] rounded-full text-[11px] md:text-xs font-normal tracking-wider outline-none w-full md:w-64 focus:bg-white border border-transparent focus:border-zinc-200 transition-all shadow-sm font-sans"
                            />
                        </div>
                        {/* Mobile Filter Toggle */}
                        <button 
                            onClick={() => setIsFilterOpen(true)}
                            className="lg:hidden flex items-center justify-center gap-3 w-full sm:w-auto bg-zinc-900 text-white px-8 py-4 rounded-full text-[11px] font-semibold uppercase tracking-widest shadow-xl hover:bg-black transition-all font-sans"
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
                            onClick={() => {
                                setSelectedCategory(cat);
                                setSearchQuery("");
                            }}
                            className={`whitespace-nowrap px-8 py-3 rounded-full text-[11px] font-medium uppercase tracking-wider transition-all font-sans ${
                                selectedCategory === cat 
                                ? 'bg-zinc-900 text-white shadow-md' 
                                : 'bg-zinc-50 text-zinc-500 border border-zinc-100/50 hover:bg-zinc-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters - Desktop */}
                    {/* Sidebar Filters - Desktop */}
                    <div className="lg:w-64 shrink-0 hidden lg:block">
                        <div className="sticky top-40 space-y-12 bg-[#fcfcfd]/50 backdrop-blur-lg p-8 rounded-[2.5rem] border border-zinc-100/50 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                            <div>
                                <h3 className="text-[11px] flex items-center gap-2 mb-6 uppercase tracking-[0.15em] font-semibold text-zinc-800 font-sans not-italic">
                                     <SlidersHorizontal size={14} className="text-[#007aff]" /> Categories
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {categories.map(cat => (
                                        <div key={cat} className="flex flex-col gap-2">
                                            <button 
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setSearchQuery(""); // Reset subcategory search filter when swapping categories
                                                }}
                                                className={`text-left text-[12px] font-bold tracking-wider transition-all flex items-center justify-between group uppercase font-sans italic ${
                                                    selectedCategory === cat ? 'text-zinc-900 font-black' : 'text-zinc-400 hover:text-zinc-800'
                                                }`}
                                            >
                                                {cat}
                                                <span className={`w-1.5 h-1.5 rounded-full bg-[#007aff] transition-all duration-500 ${selectedCategory === cat ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></span>
                                            </button>
                                            
                                            {/* Expandable subcategories for Face Care */}
                                            {cat === "Face Care" && selectedCategory === "Face Care" && (
                                                <div className="pl-4 flex flex-col gap-2 border-l border-zinc-100 ml-1 my-2">
                                                    {[
                                                        "Cleansers", "Exfoliators", "Toners & Mists", "Serums", 
                                                        "Moisturizers", "Sunscreens", "Face Masks", "Eye Care", "Face Oils"
                                                    ].map(sub => (
                                                        <button 
                                                            key={sub}
                                                            onClick={() => setSearchQuery(sub)}
                                                            className={`text-left text-[11px] font-bold uppercase tracking-wider transition-all font-sans italic hover:text-zinc-900 ${
                                                                searchQuery === sub ? 'text-[#007aff] font-black' : 'text-zinc-400'
                                                            }`}
                                                        >
                                                            {sub}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 border-t border-zinc-100">
                                <h3 className="text-[11px] mb-6 uppercase tracking-[0.15em] font-semibold text-zinc-800 font-sans not-italic">Skin Concern</h3>
                                <div className="flex flex-col gap-4">
                                    {concerns.map(con => (
                                        <button 
                                            key={con}
                                            onClick={() => setSelectedConcern(con)}
                                            className={`text-left text-[12px] font-bold tracking-wider transition-all uppercase font-sans italic ${
                                                selectedConcern === con ? 'text-zinc-900 font-black' : 'text-zinc-400 hover:text-zinc-800'
                                            }`}
                                        >
                                            {con}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 border-t border-zinc-100">
                                <h3 className="text-[11px] mb-6 uppercase tracking-[0.15em] font-semibold text-zinc-800 font-sans not-italic">Price Range</h3>
                                <div className="flex flex-col gap-4">
                                    {priceRanges.map(range => (
                                        <button 
                                            key={range.label}
                                            onClick={() => setSelectedPriceRange(range)}
                                            className={`text-left text-[12px] font-bold tracking-wider transition-all uppercase font-sans italic ${
                                                selectedPriceRange.label === range.label ? 'text-zinc-900 font-black' : 'text-zinc-400 hover:text-zinc-800'
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 border-t border-zinc-100">
                                <h3 className="text-[11px] mb-6 uppercase tracking-[0.15em] font-semibold text-zinc-800 font-sans not-italic">Sort By</h3>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-[#f5f5f7] rounded-full px-6 py-3 text-[11px] font-medium tracking-wider outline-none border border-transparent focus:border-zinc-200 transition-all appearance-none uppercase font-sans not-italic text-zinc-700"
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
                                <div className="flex items-center justify-between mb-8 text-[10px] font-semibold text-zinc-400 tracking-[0.2em] uppercase font-sans not-italic">
                                    <span>Showing {filteredProducts.length} Items</span>
                                    <div className="flex items-center gap-6">
                                        <button 
                                            onClick={() => setViewMode('small')}
                                            className={`transition-all ${viewMode === 'small' ? 'text-zinc-900 scale-110' : 'opacity-40 hover:opacity-100'}`}
                                            title="Small Cards"
                                        >
                                            <Grid3X3 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('large')}
                                            className={`hidden sm:block transition-all ${viewMode === 'large' ? 'text-zinc-900 scale-110' : 'opacity-40 hover:opacity-100'}`}
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
                                            className={`transition-all ${viewMode === 'list' ? 'text-zinc-900 scale-110' : 'opacity-40 hover:opacity-100'}`}
                                            title="List View"
                                        >
                                            <List size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className={`grid gap-4 md:gap-8 ${
                                    viewMode === 'list' ? 'grid-cols-1' :
                                    viewMode === 'small' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
                                    'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'

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
                            <h2 className="text-2xl font-light font-sans text-zinc-900">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-3 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto space-y-12 pb-10">
                            <div>
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-800 mb-6 font-sans not-italic">Store Section</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {categories.map(cat => (
                                        <div key={cat} className="flex flex-col gap-2">
                                            <button 
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setSearchQuery(""); // Reset search when swapping main category
                                                    if (cat !== "Face Care") setIsFilterOpen(false); // Close drawer if not Face Care
                                                }}
                                                className={`text-left px-6 py-4 rounded-full text-[11px] font-medium tracking-wider transition-all uppercase font-sans not-italic border ${
                                                    selectedCategory === cat 
                                                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                                                    : 'bg-zinc-50 text-zinc-500 border-transparent hover:bg-zinc-100'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                            
                                            {/* Mobile Subcategories for Face Care */}
                                            {cat === "Face Care" && selectedCategory === "Face Care" && (
                                                <div className="pl-4 grid grid-cols-2 gap-2 my-2">
                                                    {[
                                                        "Cleansers", "Exfoliators", "Toners & Mists", "Serums", 
                                                        "Moisturizers", "Sunscreens", "Face Masks", "Eye Care", "Face Oils"
                                                    ].map(sub => (
                                                        <button 
                                                            key={sub}
                                                            onClick={() => {
                                                                setSearchQuery(sub);
                                                                setIsFilterOpen(false); // Close drawer after fine selection
                                                            }}
                                                            className={`text-left px-4 py-2.5 rounded-full text-[10px] font-medium uppercase tracking-wider transition-all font-sans not-italic border ${
                                                                searchQuery === sub 
                                                                ? 'bg-[#007aff] text-white border-[#007aff] shadow-sm font-semibold' 
                                                                : 'bg-zinc-50/50 text-zinc-400 border-zinc-100'
                                                            }`}
                                                        >
                                                            {sub}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-800 mb-6 font-sans not-italic">Order By</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {["Newest", "Price: Low to High", "Price: High to Low"].map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => {setSortBy(opt); setIsFilterOpen(false);}}
                                            className={`text-left px-6 py-4 rounded-full text-[11px] font-medium tracking-wider transition-all uppercase font-sans not-italic border ${
                                                sortBy === opt 
                                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                                                : 'bg-zinc-50 text-zinc-500 border-transparent hover:bg-zinc-100'
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
                            className="w-full bg-zinc-900 text-white py-6 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:bg-black transition-all font-sans not-italic"
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
