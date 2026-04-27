import React, { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Save, Sparkles, Image as ImageIcon, Database, 
    ClipboardList, Beaker, ShieldCheck, ChevronRight, CheckCircle2, 
    Info, Waves, Layout, Fingerprint, Zap, Plus, Star, Sun, User, X, Camera, Upload, Trash2
} from 'lucide-react';
import { ProductContext } from '../../context/ProductContext';
import toast from 'react-hot-toast';
import { useCurrency } from '../../context/CurrencyContext';

const AddProduct = () => {
    const { formatPrice } = useCurrency();

    const { addProductState } = React.useContext(ProductContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('core');

    const [formData, setFormData] = useState({
        name: '',
        brand: 'BareSkin.',
        price: '',
        category: '',
        subCategory: '',
        description: '',
        stock: 0,
        image: '',
        images: [],
        skinType: [],
        ingredients: '',
        usage: '',
        phLevel: '',
        sizes: [],
        variants: [],
        discountPercentage: 0,
        rating: 0,
        numReviews: 0,
        promoTag: '',
        badgeText: ''
    });

    const [variantInput, setVariantInput] = useState({ size: '', price: '', stock: '' });

    const skinTypeOptions = ['All', 'Oily', 'Dry', 'Sensitive', 'Combination', 'Neutral', 'Acne-Prone'];
    const categoryOptions = ['Skin Care', 'Lip Care', 'Hair Care', 'Body Care', 'Makeup', 'Beauty', "Men's Care"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleSkinType = (type) => {
        const newTypes = formData.skinType.includes(type)
            ? formData.skinType.filter(t => t !== type)
            : [...formData.skinType, type];
        setFormData({ ...formData, skinType: newTypes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Specific Validation check
        if (!formData.name || !formData.category || !formData.price || !formData.image) {
            let missing = [];
            if (!formData.name) missing.push('Name');
            if (!formData.category) missing.push('Category');
            if (!formData.price) missing.push('Price');
            if (!formData.image) missing.push('Main Image');
            
            toast.error(`Required: ${missing.join(', ')}`, {
                icon: '⚠️',
                style: { borderRadius: '15px', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
            });
            setActiveTab(missing.includes('Main Image') ? 'images' : 'core');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Saving product to store...');

        try {
            const res = await api.post('/products', formData);
            if (res.data.success) {
                addProductState(res.data.data);
                toast.success('Product added successfully!', { id: toastId });
                navigate('/admin/products');
            }
        } catch (error) {
            console.error('Error creating product', error);
            const errorMsg = error.response?.data?.message || 'Failed to add product.';
            toast.error(errorMsg, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const isStepComplete = (step) => {
        switch(step) {
            case 'core': return formData.name && formData.category && formData.price && formData.brand;
            case 'science': return formData.description && formData.skinType.length > 0;
            case 'media': return formData.image.startsWith('http');
            default: return false;
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto py-10 px-6 animate-in fade-in duration-700">
            {/* Breadcrumbs / Header */}
            <header className="mb-10 space-y-6">
                <button 
                    onClick={() => navigate('/admin/products')}
                    className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-[#007aff] transition-all"
                >
                    <ArrowLeft size={16} /> Back to Inventory
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Add New Item to Catalog</h1>
                        <p className="text-sm text-zinc-500 mt-1">Provide accurate details to ensure your product lists correctly on the store.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                        <CheckCircle2 size={16} className="text-green-600" />
                        <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Linked to Cloud Database</span>
                    </div>
                </div>
            </header>

            {/* Horizontal Tabs (Amazon Seller Style) */}
            <div className="flex border-b border-zinc-200 mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
                {[
                    { id: 'core', label: 'Vital Info', icon: Database },
                    { id: 'offer', label: 'Offer & Price', icon: Zap },
                    { id: 'images', label: 'Images', icon: ImageIcon },
                    { id: 'description', label: 'Description', icon: Info },
                    { id: 'details', label: 'Product Details', icon: Beaker }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-8 py-4 text-sm font-semibold border-b-2 transition-all ${
                            activeTab === tab.id 
                            ? 'border-[#007aff] text-[#007aff] bg-[#007aff]/5' 
                            : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
                        }`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form Main Area */}
                <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl shadow-sm p-8 space-y-10">
                    {activeTab === 'core' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">Vital Information</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                        Item Name <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" name="name" value={formData.name} onChange={handleInputChange} required
                                        className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10 outline-none transition-all"
                                        placeholder="E.g. Natural Vitamin C Face Serum"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Brand</label>
                                        <input 
                                            type="text" name="brand" value={formData.brand} onChange={handleInputChange} required
                                            className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:border-[#007aff] focus:ring-4 focus:ring-[#007aff]/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">Product Category <span className="text-red-500">*</span></label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                                {[
                                                    { id: 'Face Care', label: 'FACE CARE', icon: Sparkles },
                                                    { id: 'Lip Care', label: 'LIP CARE', icon: Waves },
                                                    { id: 'Hair Care', label: 'HAIR CARE', icon: Waves },
                                                    { id: 'Body Care', label: 'BODY CARE', icon: Sun },
                                                    { id: 'Makeup', label: 'MAKEUP', icon: User },
                                                    { id: 'Beauty', label: 'BEAUTY', icon: Layout },
                                                    { id: "Men's Care", label: "MEN'S CARE", icon: Fingerprint }
                                                ].map((cat) => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, category: cat.id, subCategory: '' })}
                                                        className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                                                            formData.category === cat.id
                                                            ? 'bg-[#007aff]/5 border-[#007aff] text-[#007aff] shadow-sm ring-1 ring-[#007aff]'
                                                            : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300'
                                                        }`}
                                                    >
                                                        <cat.icon size={20} className={formData.category === cat.id ? 'text-[#007aff]' : 'text-zinc-300'} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-center">{cat.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {formData.category === 'Face Care' && (
                                            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300 bg-zinc-50/50 p-6 rounded-2xl border border-zinc-100">
                                                <label className="text-[11px] font-bold text-[#007aff] uppercase tracking-wider flex items-center gap-1">Select Face Care Sub-Category</label>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {[
                                                        "Cleansers", "Exfoliators", "Toners & Mists", "Serums", 
                                                        "Moisturizers", "Sunscreens", "Face Masks", "Eye Care", "Face Oils"
                                                    ].map((sub) => (
                                                        <button
                                                            key={sub}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, subCategory: sub })}
                                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                                                                formData.subCategory === sub
                                                                ? 'bg-black text-white border-black shadow-md'
                                                                : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300'
                                                            }`}
                                                        >
                                                            {sub}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <button type="button" onClick={() => setActiveTab('offer')} className="bg-[#007aff] text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg shadow-[#007aff]/20 hover:bg-black transition-all">
                                    Continue to Offer
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'offer' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">Offer & Pricing Details</h2>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Your Price (₹) <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</span>
                                        <input 
                                            type="number" name="price" value={formData.price} onChange={handleInputChange} required
                                            className="w-full border border-zinc-300 rounded-lg pl-10 pr-4 py-3 text-sm font-bold outline-none focus:border-[#007aff] transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Stock Availability <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" name="stock" value={formData.stock} onChange={handleInputChange} required
                                        className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#007aff] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-100">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Discount (%)</label>
                                    <input 
                                        type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleInputChange}
                                        className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#007aff] transition-all"
                                        placeholder="E.g. 10"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Manual Rating (0-5)</label>
                                    <input 
                                        type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleInputChange}
                                        className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#007aff] transition-all"
                                        placeholder="E.g. 4.5"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Review Count</label>
                                    <input 
                                        type="number" name="numReviews" value={formData.numReviews} onChange={handleInputChange}
                                        className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#007aff] transition-all"
                                        placeholder="E.g. 120"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-100">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-green-600">Promo Line (e.g. Buy 2 save 20%)</label>
                                    <input 
                                        type="text" name="promoTag" value={formData.promoTag} onChange={handleInputChange}
                                        className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#007aff] transition-all"
                                        placeholder="Add special offer text..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-[#007aff]">Badge Text (e.g. HOT DEAL)</label>
                                    <input 
                                        type="text" name="badgeText" value={formData.badgeText} onChange={handleInputChange}
                                        className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#007aff] transition-all"
                                        placeholder="Add highlight badge..."
                                    />
                                </div>
                            </div>

                            {/* Variants Management */}
                            <div className="space-y-4 pt-6 border-t border-zinc-100">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Dynamic Product Variants (Size, Price, Stock)</label>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <input 
                                        type="text" value={variantInput.size} onChange={(e) => setVariantInput({ ...variantInput, size: e.target.value })}
                                        className="border border-zinc-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#007aff]"
                                        placeholder="Size (e.g. 50ml)"
                                    />
                                    <input 
                                        type="number" value={variantInput.price} onChange={(e) => setVariantInput({ ...variantInput, price: e.target.value })}
                                        className="border border-zinc-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#007aff]"
                                        placeholder="Price (₹)"
                                    />
                                    <input 
                                        type="number" value={variantInput.stock} onChange={(e) => setVariantInput({ ...variantInput, stock: e.target.value })}
                                        className="border border-zinc-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#007aff]"
                                        placeholder="Stock"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            if (variantInput.size && variantInput.price && variantInput.stock) {
                                                const newVariant = {
                                                    size: variantInput.size.trim(),
                                                    price: Number(variantInput.price),
                                                    stock: Number(variantInput.stock)
                                                };
                                                setFormData({ 
                                                    ...formData, 
                                                    variants: [...formData.variants, newVariant],
                                                    sizes: [...formData.sizes, newVariant.size] // Keep sizes in sync for backward compatibility
                                                });
                                                setVariantInput({ size: '', price: '', stock: '' });
                                            } else {
                                                toast.error('Please fill all variant fields');
                                            }
                                        }}
                                        className="px-6 py-2 bg-[#007aff] text-white rounded-lg text-xs font-bold"
                                    > Add Variant </button>
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    {formData.variants.map((v, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-bold text-zinc-600">
                                            <div className="flex items-center gap-4">
                                                <span className="w-20 font-black uppercase text-[#007aff]">{v.size}</span>
                                                <span className="w-20">₹{v.price}</span>
                                                <span className="w-20">Stock: {v.stock}</span>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const newVariants = formData.variants.filter((_, i) => i !== idx);
                                                    setFormData({ 
                                                        ...formData, 
                                                        variants: newVariants,
                                                        sizes: newVariants.map(nv => nv.size)
                                                    });
                                                }} 
                                                className="text-zinc-400 hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6">
                                <button type="button" onClick={() => setActiveTab('images')} className="bg-[#007aff] text-white px-8 py-3 rounded-lg text-sm font-bold transition-all">
                                    Next: Add Images
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">Product Marketplace Gallery</h2>
                            
                            {/* Primary Main Image (File Upload Only) */}
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                    <Zap size={14} className="text-[#007aff]" /> Main Listing Image <span className="text-red-500">*</span>
                                </label>
                                
                                <div className="relative group">
                                    <input 
                                        type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, image: reader.result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <div className={`w-full aspect-[21/9] rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${formData.image ? 'bg-zinc-50 border-[#007aff]/30' : 'bg-[#f5f5f7] border-zinc-200 hover:border-[#007aff] hover:bg-white'}`}>
                                        {formData.image ? (
                                            <div className="relative w-full h-full p-2">
                                                <img src={formData.image} alt="Main Preview" className="w-full h-full object-contain rounded-[1.5rem]" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center">
                                                    <span className="text-white text-[10px] font-black uppercase tracking-widest italic">Change Main Image</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="p-5 bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform">
                                                    <Upload size={24} className="text-[#007aff]" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Upload High-Res Main Image</p>
                                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-2">Recommended: 1200x1200px (PNG/JPG)</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {formData.image && (
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({...formData, image: ''})} 
                                        className="text-[9px] font-black uppercase text-red-500 italic hover:underline"
                                    >
                                        Remove Main Image
                                    </button>
                                )}
                            </div>


                            {/* Secondary Gallery (Multiple Photos / File Import) */}
                            <div className="space-y-6 pt-6 border-t border-zinc-100">
                                <div className="flex justify-between items-center">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                        <Camera size={14} className="text-[#007aff]" /> Product Gallery ({formData.images ? formData.images.length : 0}/4)
                                    </label>
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Supports Both Links & Gallery Import</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Upload/Add Slot */}
                                    {(!formData.images || formData.images.length < 4) && (
                                        <div className="relative group">
                                            <input 
                                                type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFormData({ ...formData, images: [...(formData.images || []), reader.result] });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <div className="aspect-square bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-[#007aff] group-hover:bg-[#007aff]/5 transition-all">
                                                <Upload size={20} className="text-zinc-400 group-hover:text-[#007aff]" />
                                                <span className="text-[9px] font-black uppercase text-zinc-400 group-hover:text-[#007aff]">Import From Gallery</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Existing Gallery Images */}
                                    {formData.images && formData.images.map((img, idx) => (
                                        <div key={idx} className="aspect-square bg-zinc-100 rounded-xl overflow-hidden relative group border border-zinc-200">
                                            <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Link Fallback for Gallery */}
                                <div className="relative mt-4">
                                    <input 
                                        type="text" 
                                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-[10px] uppercase font-bold tracking-widest outline-none focus:border-[#007aff]"
                                        placeholder="Or add secondary image via link..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = e.target.value.trim();
                                                if (val && (!formData.images || formData.images.length < 4)) {
                                                    setFormData({ ...formData, images: [...(formData.images || []), val] });
                                                    e.target.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-zinc-300">PRESS ENTER TO ADD</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-zinc-100">
                                <button type="button" onClick={() => setActiveTab('description')} className="bg-black text-white px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#007aff] transition-all">
                                    Final Review: Details & Specs
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'description' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">Product Description & Marketing</h2>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Public Description <span className="text-red-500">*</span></label>
                                <textarea 
                                    name="description" value={formData.description} onChange={handleInputChange} required rows="10"
                                    className="w-full border border-zinc-300 rounded-lg px-4 py-4 text-sm outline-none focus:border-[#007aff] transition-all leading-relaxed"
                                    placeholder="Tell customers about the product features, benefits, and results..."
                                />
                                <p className="text-[10px] text-zinc-400 font-medium italic mt-2">Clear descriptions help in better store indexing and sales conversion.</p>
                            </div>
                            <div className="pt-6">
                                <button type="button" onClick={() => setActiveTab('details')} className="bg-[#007aff] text-white px-8 py-3 rounded-lg text-sm font-bold transition-all">
                                    Last Step: Scientific Details
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">Product Science & Technical Specs</h2>
                            
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Recommended Skin Types</label>
                                <div className="flex flex-wrap gap-2">
                                    {skinTypeOptions.map(type => (
                                        <button
                                            key={type} type="button" onClick={() => toggleSkinType(type)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                                                formData.skinType.includes(type)
                                                ? 'bg-[#007aff] text-white border-[#007aff]'
                                                : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400'
                                            }`}
                                        > {type} </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Ingredients List</label>
                                    <textarea 
                                        name="ingredients" value={formData.ingredients} onChange={handleInputChange} rows="4"
                                        className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-xs outline-none focus:border-[#007aff]"
                                        placeholder="E.g. Aqua, Glycerin, Sodium..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">How to Apply</label>
                                    <textarea 
                                        name="usage" value={formData.usage} onChange={handleInputChange} rows="4"
                                        className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-xs outline-none focus:border-[#007aff]"
                                        placeholder="Step by step usage instructions..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">pH Level</label>
                                <input 
                                    type="text" name="phLevel" value={formData.phLevel} onChange={handleInputChange}
                                    className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#007aff]"
                                    placeholder="E.g. 5.5 - Balance"
                                />
                            </div>

                            <div className="pt-10 flex gap-4">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 bg-[#232f3e] hover:bg-black text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : <><Save size={18} /> Save & Finalize Product</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Summary Sidebar (Amazon Preview Style) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm sticky top-32">
                        <h3 className="text-sm font-bold text-zinc-900 mb-6 flex items-center gap-2">
                             <Sparkles size={16} className="text-[#007aff]" /> Listing Preview
                        </h3>
                        <div className="space-y-6">
                            <div className="aspect-square bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100 flex items-center justify-center">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (formData.images && formData.images.length > 0) ? (
                                    <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={48} className="text-zinc-200" />
                                )}
                            </div>
                            {/* Mini Gallery Scroll Preview */}
                            {formData.images && formData.images.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {formData.images.map((img, i) => (
                                        <div key={i} className="w-12 h-12 flex-shrink-0 border border-zinc-100 rounded-lg overflow-hidden bg-zinc-50 border-zinc-200"><img src={img} className="w-full h-full object-cover" /></div>
                                    ))}
                                </div>
                            )}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <span className="text-[11px] font-bold text-[#007aff] uppercase">{formData.category || 'Category'}</span>
                                    <h4 className="text-lg font-bold text-zinc-900 leading-tight">{formData.name || 'Your Product Name'}</h4>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-yellow-400" />)}
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Preview Only</span>
                                </div>
                                <div className="text-2xl font-bold text-black italic">₹{formData.price || '0.00'}</div>
                            </div>
                            
                            <div className="pt-6 border-t border-zinc-100 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-400 font-bold uppercase">Inventory Status</span>
                                    <span className={`font-black uppercase italic ${formData.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {formData.stock > 0 ? 'Available' : 'Out of Stock'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-400 font-bold uppercase">Database Sync</span>
                                    <span className="text-[#007aff] font-black uppercase italic">Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
