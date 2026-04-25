import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Edit, PackageSearch, ArrowUpDown, Search, AlertCircle, Filter } from 'lucide-react';
import { ProductContext } from '../../context/ProductContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCurrency } from '../../context/CurrencyContext';

const ProductList = () => {
    const { formatPrice } = useCurrency();

    const { deleteProductState } = React.useContext(ProductContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data.data);
        } catch (error) {
            console.error('Error fetching products', error);
            toast.error('Product Load Error: Sync failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this product?')) {
            const toastId = toast.loading('Deleting product from store...');
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter((p) => p._id !== id));
                deleteProductState(id);
                toast.success('Product successfully deleted.', { id: toastId });
            } catch (error) {
                console.error('Deletion Failure:', error.response?.data || error.message);
                toast.error('Delete action failed.', { id: toastId });
            }
        }
    };

    const filteredProducts = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-6 animate-pulse">
            <PackageSearch size={48} className="text-zinc-200" />
            <span className="luxe-subheading text-zinc-300">Loading Products...</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Manage Inventory</h1>
                    <p className="text-sm text-zinc-500 mt-1">View and update your product catalog across all categories.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-[#007aff]/20 outline-none transition-all"
                        />
                    </div>
                    <Link 
                        to="/admin/add-product"
                        className="bg-[#232f3e] hover:bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={16} /> Add Product
                    </Link>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-800 uppercase tracking-widest">Inventory List ({filteredProducts.length})</span>
                    <button className="text-xs font-bold text-[#007aff] flex items-center gap-1 hover:underline">
                        <Filter size={14} /> Batch Actions
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-50 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Product Details</th>
                            <th className="px-6 py-4 text-center">Price</th>
                            <th className="px-6 py-4 text-center">Inventory</th>
                            <th className="px-6 py-4 text-center">Promos/Badges</th>
                            <th className="px-6 py-4 text-right">Settings</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filteredProducts.map((product) => (
                            <tr key={product._id} className="hover:bg-zinc-50/50 transition-colors">
                                <td className="px-6 py-4 shrink-0">
                                    <div className="w-16 h-16 bg-white border border-zinc-100 rounded-lg overflow-hidden p-1 flex items-center justify-center">
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="max-w-full max-h-full object-contain" 
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#007aff] transition-colors">{product.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded font-bold uppercase">{product.category}</span>
                                        <span className="text-[10px] text-zinc-300 font-bold tracking-tighter uppercase italic">{product.brand || 'Original'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-bold text-black italic">{formatPrice(Number(product.price))}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stock > 10 ? 'Active' : 'Low Stock'}
                                        </div>
                                        <span className="text-xs font-bold text-zinc-500">{product.stock} units</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        {product.promoTag ? (
                                            <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded italic truncate max-w-[100px]">{product.promoTag}</span>
                                        ) : (
                                            <span className="text-[9px] text-zinc-300 italic font-bold">No Promo</span>
                                        )}
                                        {product.badgeText ? (
                                            <span className="text-[9px] font-black text-[#007aff] bg-[#007aff]/5 px-2 py-0.5 rounded uppercase tracking-tighter">{product.badgeText}</span>
                                        ) : (
                                            <span className="text-[9px] text-zinc-300 italic font-bold">No Badge</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                                            className="p-2 text-zinc-400 hover:text-black transition-colors"
                                            title="Edit Item"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product._id)} 
                                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="py-24 text-center">
                        <AlertCircle size={48} className="mx-auto text-zinc-200 mb-4" />
                        <h3 className="text-lg font-bold text-zinc-400">No results found</h3>
                        <p className="text-sm text-zinc-400 mt-1 italic">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
            
            <div className="text-center pb-8">
                <p className="text-xs font-bold text-zinc-300 italic uppercase tracking-[0.3em]">Inventory fully synced with cloud</p>
            </div>
        </div>
    );
};

export default ProductList;
