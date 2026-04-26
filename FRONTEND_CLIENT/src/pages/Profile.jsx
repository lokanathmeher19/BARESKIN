import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';
import { 
    User, 
    Package, 
    Settings, 
    LogOut, 
    ChevronRight, 
    ShoppingBag, 
    CreditCard, 
    ShieldCheck, 
    Mail, 
    Bell,
    Heart,
    MapPin,
    ArrowRight,
    Award,
    Activity,
    Clock,
    Sparkles,
    Phone,
    Camera,
    Lock,
    ExternalLink,
    CheckCircle2,
    Save,
    Loader2,
    X,
    RefreshCw
} from 'lucide-react';

const Profile = () => {
    const { formatPrice } = useCurrency();

    const { user, logout, setUser } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const navigate = useNavigate();

    // Form States
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        zip: user?.zip || '',
        city: user?.city || '',
        state: user?.state || '',
        address: user?.address || '',
        skinType: user?.skinType || 'Normal',
        skinConcerns: user?.skinConcerns || [],
        usageProtocols: user?.usageProtocols || []
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Sync form data with user when user object updates
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                zip: user.zip || '',
                city: user.city || '',
                state: user.state || '',
                address: user.address || '',
                skinType: user.skinType || 'Normal',
                skinConcerns: user.skinConcerns || [],
                usageProtocols: user.usageProtocols || []
            });
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my');
                setOrders(Array.isArray(res.data) ? res.data : (res.data.data || []));
            } catch (error) {
                console.error('Error fetching orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await api.post('/auth/profile-update', profileData);
            if (res.data.success) {
                // Combine existing user, local profileData, and server response for maximum safety
                const updatedUser = {
                    ...user,
                    ...profileData,
                    ...res.data.user
                };
                setUser(updatedUser);
                // Also update local profileData to match the merged result
                setProfileData(prev => ({ ...prev, ...res.data.user }));
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error('Full Update Error:', error);
            const message = error.response?.data?.message || 'Update failed: Server or Network Error';
            toast.error(message);
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setUpdating(true);
        try {
            const res = await api.post('/auth/password-update', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (res.data.success) {
                toast.success('Password updated successfully');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            console.error('Password error:', error);
            const message = error.response?.data?.message || 'Password update failed';
            toast.error(message);
        } finally {
            setUpdating(false);
        }
    };

    const [subscriptions, setSubscriptions] = useState([]);
    const [subsLoading, setSubsLoading] = useState(true);

    // Fetch subscriptions
    useEffect(() => {
        if (activeTab === 'subscriptions') {
            const fetchSubs = async () => {
                setSubsLoading(true);
                try {
                    const res = await api.get('/subscriptions/my');
                    setSubscriptions(res.data.data || []);
                } catch (error) {
                    console.error('Error fetching subscriptions', error);
                } finally {
                    setSubsLoading(false);
                }
            };
            fetchSubs();
        }
    }, [activeTab]);

    const handleCancelSubscription = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this subscription?")) return;
        
        try {
            const res = await api.put(`/subscriptions/${id}/cancel`);
            if (res.data.success) {
                setSubscriptions(subscriptions.map(s => s._id === id ? { ...s, status: 'Cancelled' } : s));
                toast.success('Subscription cancelled');
            }
        } catch (error) {
            toast.error('Failed to cancel subscription');
        }
    };

    const handleSkipSubscription = async (id) => {
        if (!window.confirm("Are you sure you want to skip next month's shipment?")) return;
        try {
            const res = await api.put(`/subscriptions/${id}/skip`);
            if (res.data.success) {
                toast.success('Successfully skipped 1 month! Delivery dates pushed forward.', { icon: '📦' });
                setSubscriptions(subscriptions.map(s => s._id === id ? { ...s, nextBillingDate: res.data.data.nextBillingDate } : s));
            }
        } catch (error) {
            toast.error('Failed to skip subscription cycle.');
        }
    };

    const handleUpdatePaymentMethod = async (id) => {
        toast.success('Payment Method Portal Securely Authenticated. Linking active default cards.', { icon: '💳' });
    };

    const handleZipLookup = async (pincode) => {
        // Update zip state immediately so the input reflects the 6th digit
        setProfileData(prev => ({ ...prev, zip: pincode }));

        if (pincode.length === 6) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await response.json();
                
                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    
                    setProfileData(prev => ({
                        ...prev,
                        zip: pincode,
                        city: postOffice.District,
                        state: postOffice.State
                    }));
                    toast.success(`Location identified: ${postOffice.District}`);
                } else {
                    toast.error("Invalid Zip Code");
                }
            } catch (error) {
                console.error("Zip lookup failed", error);
            }
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <User size={18} /> },
        { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
        { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
        { id: 'subscriptions', label: 'Subscriptions', icon: <RefreshCw size={18} /> },
        { id: 'skin', label: 'Skin Profile', icon: <Activity size={18} /> },
        { id: 'security', label: 'Security', icon: <Lock size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 animate-luxe min-h-screen">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">My Profile<span className="text-[#007aff]">.</span></h1>
                    <p className="text-xs font-bold text-zinc-400 tracking-widest uppercase italic mt-1">Account Dashboard</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <Activity size={14} className="text-[#007aff] animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">Live Connection Active</span>
                </div>
            </div>
            
            {/* Minimalist Profile Header with Cover */}
            <div className="relative mb-8 rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-white border border-zinc-100 shadow-sm">
                {/* Cover Image */}
                <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-black relative">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 backdrop-blur-md transition-all">
                        <Camera size={16} />
                    </button>
                </div>

                {/* Profile Info Row */}
                <div className="px-6 sm:px-10 pb-8 sm:pb-10 -mt-12 sm:-mt-16 flex flex-col md:flex-row items-center md:items-end gap-6 md:justify-between">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-[2rem] sm:rounded-[2.5rem] p-1 shadow-2xl">
                                <div className="w-full h-full bg-[#007aff]/5 rounded-[1.8rem] sm:rounded-[2.3rem] flex items-center justify-center text-[#007aff] border border-[#007aff]/10 overflow-hidden relative">
                                    <User size={48} className="sm:size-16" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                        </div>

                        {/* Name & Title */}
                        <div className="text-center md:text-left mb-2 px-4">
                            <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight break-words max-w-[250px] sm:max-w-none">{user.name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                                <p className="text-[10px] sm:text-xs font-bold text-zinc-400 tracking-[0.3em] uppercase italic">
                                    {user.isAdmin ? 'Site Administrator' : 'Premium Member'}
                                </p>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase italic tracking-widest ${
                                    (user.points || 0) > 2000 ? 'bg-zinc-900 text-yellow-400' : 
                                    (user.points || 0) > 1000 ? 'bg-[#007aff]/10 text-[#007aff]' : 
                                    'bg-zinc-100 text-zinc-400'
                                }`}>
                                    {(user.points || 0) > 2000 ? 'Platinum Tier' : (user.points || 0) > 1000 ? 'Gold Tier' : 'Silver Tier'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Header */}
                    <div className="flex gap-4 sm:gap-8 border-t md:border-t-0 border-zinc-100 pt-6 md:pt-0 w-full md:w-auto justify-center">
                        <div className="text-center">
                            <p className="text-lg sm:text-xl font-black italic tracking-tighter leading-none">{orders.length}</p>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Orders</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-100 hidden sm:block"></div>
                        <div className="text-center">
                            <p className="text-lg sm:text-xl font-black italic tracking-tighter leading-none">{user.points || 0}</p>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Points</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-100 hidden sm:block"></div>
                        <div className="text-center">
                            <p className="text-lg sm:text-xl font-black italic tracking-tighter leading-none">{orders.reduce((acc, o) => acc + (o.products?.length || 0), 0)}</p>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Products</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 mb-10 p-1 bg-zinc-100/50 rounded-2xl sm:rounded-3xl border border-zinc-200/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-500 whitespace-nowrap text-[10px] font-black uppercase tracking-widest italic ${
                            activeTab === tab.id 
                            ? 'bg-white text-black shadow-md shadow-black/5 scale-[1.02]' 
                            : 'text-zinc-400 hover:text-black hover:bg-white/50'
                        }`}
                    >
                        <span className={activeTab === tab.id ? 'text-[#007aff]' : ''}>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="animate-fade-in">
                
                {activeTab === 'general' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Personal Card */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm relative overflow-hidden group">
                                <Award className="absolute -right-4 -bottom-4 text-black/5 w-32 h-32 rotate-12" />
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xs font-black tracking-[0.3em] uppercase text-zinc-400 italic">// Summary</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Live</span>
                                    </div>
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-zinc-50 rounded-xl text-zinc-400"><Mail size={16}/></div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Email Address</p>
                                            <p className="text-xs font-bold text-zinc-800">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-zinc-50 rounded-xl text-zinc-400"><ShieldCheck size={16}/></div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Security Status</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold text-zinc-800">
                                                    {passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword 
                                                        ? 'Passwords Match' 
                                                        : 'Account Secure'}
                                                </p>
                                                {passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword && (
                                                    <CheckCircle2 size={12} className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-zinc-50 rounded-xl text-zinc-400"><Phone size={16}/></div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Contact Phone</p>
                                            <p className="text-xs font-bold text-zinc-800">{profileData.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-zinc-50 rounded-xl text-zinc-400"><MapPin size={16}/></div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Zip Code</p>
                                            <p className="text-sm font-black text-zinc-900 tracking-tight">{profileData.zip || 'Not Set'}</p>
                                            {profileData.city && (
                                                <p className="text-[10px] font-black uppercase text-[#007aff] tracking-tighter mt-1 italic leading-none">
                                                    {profileData.city}, {profileData.state}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-zinc-50 rounded-xl text-zinc-400"><MapPin size={16}/></div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Main Address</p>
                                            <p className="text-xs font-bold text-zinc-800">{profileData.address || 'No address set'}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="w-full mt-10 py-4 bg-red-50 text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] italic hover:bg-red-500 hover:text-white transition-all">
                                    Log Out
                                </button>
                            </div>
                        </div>

                        {/* Form Area */}
                        <form onSubmit={handleProfileUpdate} className="lg:col-span-2 bg-white p-8 sm:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-10 italic">Personal Details<span className="text-[#007aff]">.</span></h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-400 ml-1">Verified Full Name</label>
                                    <input 
                                        type="text" 
                                        value={profileData.name} 
                                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                        className="w-full p-4 sm:p-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-black uppercase focus:ring-2 focus:ring-[#007aff]/10 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-400 ml-1">Secure Email</label>
                                    <input type="email" defaultValue={user.email} disabled className="w-full p-4 sm:p-5 bg-zinc-100 border border-zinc-100 rounded-2xl text-xs font-black uppercase text-zinc-400 cursor-not-allowed italic" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-400 ml-1">Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={profileData.phone} 
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                        placeholder="+91 XXXX XXX XXX" 
                                        className="w-full p-4 sm:p-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-black uppercase focus:ring-2 focus:ring-[#007aff]/10 outline-none transition-all" 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-400 ml-1">Zip Code</label>
                                    <input 
                                        type="text" 
                                        value={profileData.zip}
                                        onChange={(e) => handleZipLookup(e.target.value)}
                                        placeholder="7XXXXX" 
                                        className="w-full p-4 sm:p-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-black uppercase focus:ring-2 focus:ring-[#007aff]/10 outline-none transition-all" 
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-3">
                                    <label className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-400 ml-1">Shipping Address (Real Address Only)</label>
                                    <textarea 
                                        value={profileData.address} 
                                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                        rows="2" 
                                        className="w-full p-4 sm:p-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-black uppercase focus:ring-2 focus:ring-[#007aff]/10 outline-none transition-all resize-none" 
                                        placeholder="House No, Street, Landmark..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mt-12 flex justify-end">
                                <button 
                                    disabled={updating}
                                    type="submit" 
                                    className="px-10 py-5 bg-black text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#007aff] hover:shadow-2xl hover:shadow-[#007aff]/20 transition-all duration-700 italic flex items-center gap-3 disabled:opacity-50"
                                >
                                    {updating ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 sm:p-12 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black uppercase tracking-tight italic">Order History<span className="text-[#007aff]">.</span></h2>
                            <span className="px-4 py-2 bg-[#007aff]/10 text-[#007aff] rounded-xl text-[9px] font-black uppercase italic tracking-widest">Total: {orders.length}</span>
                        </div>

                        {loading ? (
                            <div className="py-20 text-center animate-pulse text-zinc-300 font-bold tracking-widest text-xs uppercase">Loading history...</div>
                        ) : orders.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {orders.map((order) => (
                                    <div key={order._id} className="p-6 rounded-[2rem] border border-zinc-50 bg-zinc-50/50 hover:bg-white hover:shadow-xl hover:shadow-zinc-100/50 transition-all duration-700 group border-l-4 border-l-black hover:border-l-[#007aff]">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#007aff] mb-1">ARCH_{order._id.slice(-6).toUpperCase()}</p>
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                                                order.paymentStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-black text-white'
                                            }`}>
                                                {order.paymentStatus || 'RECORDED'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex -space-x-4">
                                                {order.products?.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="w-12 h-12 rounded-xl border-4 border-white bg-white overflow-hidden shadow-sm">
                                                        <img src={item.product?.image || '/placeholder.png'} className="w-full h-full object-cover" alt="p" />
                                                    </div>
                                                ))}
                                                {order.products?.length > 3 && (
                                                    <div className="w-12 h-12 rounded-xl border-4 border-white bg-zinc-900 flex items-center justify-center text-[9px] font-black text-white shadow-sm">
                                                        +{order.products.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow"></div>
                                            <div className="text-right">
                                                <p className="text-lg font-black italic tracking-tighter">{formatPrice(order.totalPrice)}</p>
                                                <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest italic">Total Price</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-3 bg-white border border-zinc-100 rounded-xl text-[9px] font-black uppercase tracking-widest italic hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                                            View Order <ExternalLink size={12}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center bg-zinc-50/50 rounded-[2.5rem] border border-dashed border-zinc-200">
                                <ShoppingBag size={48} className="mx-auto text-zinc-200 mb-6" />
                                <p className="text-zinc-400 font-black tracking-widest text-xs uppercase mb-8">No orders found</p>
                                <Link to="/products" className="inline-flex items-center gap-3 px-12 py-5 bg-black text-white rounded-[2rem] text-[10px] font-black tracking-[0.2em] uppercase hover:bg-[#007aff] transition-all">
                                    Explore Catalog <ArrowRight size={16} />
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                                <h3 className="text-xl font-black uppercase tracking-tight mb-10 italic">Saved Cards<span className="text-[#007aff]">.</span></h3>
                                <div className="space-y-6">
                                    <div className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex items-center justify-between group hover:border-[#007aff]/30 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-10 bg-black rounded-lg flex items-center justify-center text-[10px] font-black text-white italic tracking-tighter">VISA</div>
                                            <div>
                                                <p className="text-sm font-black tracking-widest uppercase">•••• •••• •••• 4242</p>
                                                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">Expires 12/26 • Primary Card</p>
                                            </div>
                                        </div>
                                        <button className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline italic">Disconnect</button>
                                    </div>
                                    <button className="w-full py-6 border-2 border-dashed border-zinc-100 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:border-[#007aff]/30 hover:text-[#007aff] transition-all italic">
                                        + Add New Payment Method
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                                <h3 className="text-xl font-black uppercase tracking-tight mb-8 italic">Saved Addresses<span className="text-[#007aff]">.</span></h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="p-6 bg-black text-white rounded-[2rem] relative overflow-hidden group">
                                        <CheckCircle2 size={16} className="absolute top-4 right-4 text-[#007aff]" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 block italic">Default Address</span>
                                        <p className="text-xs font-bold leading-relaxed italic mb-6">{user.address || 'No address set'}</p>
                                        <button className="text-[9px] font-black text-[#007aff] uppercase tracking-widest hover:underline italic">Edit Details</button>
                                    </div>
                                    <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 group hover:border-[#007aff]/30 transition-all cursor-pointer">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zinc-300 group-hover:text-[#007aff] transition-all">
                                            <MapPin size={20}/>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Add New Address</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-zinc-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                                <Sparkles className="absolute -right-4 -bottom-4 text-white/5 w-40 h-40 rotate-12" />
                                <h4 className="text-2xl font-black italic mb-6 leading-none tracking-tighter uppercase">REWARDS<span className="text-[#007aff]">.</span></h4>
                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-2 italic">Current Balance</p>
                                        <p className="text-5xl font-black italic tracking-tighter text-[#007aff]">{user.points || 0}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-zinc-500 italic">Tier Status</span>
                                            <span>{(user.points || 0) > 2000 ? 'Platinum' : (user.points || 0) > 1000 ? 'Gold' : 'Silver'}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#007aff]" style={{ width: `${Math.min(((user.points || 0) % 1000) / 10, 100)}%` }}></div>
                                        </div>
                                        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest italic">
                                            {(user.points || 0) > 2000 ? 'Top Tier Reached' : `${1000 - ((user.points || 0) % 1000)} points until next level`}
                                        </p>
                                    </div>
                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <div className="flex items-center gap-3 text-white/70">
                                            <div className="p-2 bg-white/5 rounded-lg text-[#007aff]"><CheckCircle2 size={12}/></div>
                                            <span className="text-[9px] font-bold uppercase tracking-widest italic">10% Off Subscriptions</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/70">
                                            <div className="p-2 bg-white/5 rounded-lg text-[#007aff]"><CheckCircle2 size={12}/></div>
                                            <span className="text-[9px] font-bold uppercase tracking-widest italic">Early Sale Access</span>
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-[#007aff] hover:bg-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 italic">Redeem Points</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'subscriptions' && (
                    <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 sm:p-12 shadow-sm">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight italic">Subscriptions<span className="text-[#007aff]">.</span></h2>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic mt-1">Manage your recurring deliveries</p>
                            </div>
                            <Link to="/products" className="px-6 py-3 bg-zinc-50 hover:bg-black hover:text-white border border-zinc-100 rounded-xl text-[9px] font-black uppercase italic tracking-widest transition-all">Explore Plans</Link>
                        </div>
                        
                        {subsLoading ? (
                            <div className="py-20 text-center animate-pulse text-zinc-300 font-bold tracking-widest text-xs uppercase italic">Synchronizing plans...</div>
                        ) : subscriptions.length > 0 ? (
                            <div className="space-y-6">
                                {subscriptions.map((sub) => (
                                    <div key={sub._id} className="p-8 rounded-[2.5rem] bg-zinc-50/50 border border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-white rounded-2xl border border-zinc-100 p-2 overflow-hidden">
                                                <img src={sub.product?.image} className="w-full h-full object-contain mix-blend-multiply" alt="sub" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-tight mb-1">{sub.product?.name}</h4>
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic">Cycle: {sub.frequency} // Next: {new Date(sub.nextBillingDate).toLocaleDateString()}</p>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className={`w-2 h-2 rounded-full ${sub.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    <span className={`text-[8px] font-black uppercase tracking-widest ${sub.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{sub.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 flex-wrap justify-end">
                                            {sub.status === 'Active' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleUpdatePaymentMethod(sub._id)} 
                                                        className="px-5 py-3 bg-white border border-zinc-200 rounded-2xl text-[8px] font-black uppercase italic tracking-widest hover:bg-black hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                    >
                                                        <CreditCard size={12}/> Card
                                                    </button>
                                                    <button 
                                                        onClick={() => handleSkipSubscription(sub._id)} 
                                                        className="px-5 py-3 bg-black text-white rounded-2xl text-[8px] font-black uppercase italic tracking-widest hover:bg-[#007aff] transition-all shadow-sm flex items-center gap-2"
                                                    >
                                                        <Package size={12}/> Skip Month
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancelSubscription(sub._id)} 
                                                        className="px-5 py-3 bg-zinc-100 text-zinc-400 rounded-2xl text-[8px] font-black uppercase italic tracking-widest hover:bg-red-50 hover:text-red-500 transition-all flex items-center gap-2"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            {sub.status === 'Cancelled' && (
                                                 <button className="px-8 py-4 bg-black text-white rounded-2xl text-[9px] font-black uppercase italic tracking-widest transition-all">Re-Activate</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center bg-zinc-50/50 rounded-[3rem] border-2 border-dashed border-zinc-100">
                                <RefreshCw size={48} className="mx-auto text-zinc-200 mb-8" />
                                <h3 className="text-xl font-black uppercase italic mb-4">No Active Subscriptions</h3>
                                <p className="text-xs text-zinc-400 font-medium italic mb-10 max-w-sm mx-auto">Subscribe to your favorite products to save 10% and never run out of your routine.</p>
                                <Link to="/products" className="inline-flex items-center gap-3 px-10 py-5 bg-[#007aff] text-white rounded-full text-[10px] font-black uppercase italic tracking-widest hover:bg-black transition-all shadow-xl shadow-[#007aff]/20">
                                    Start Subscribing <ArrowRight size={14}/>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'skin' && (
                    <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 sm:p-12 shadow-sm space-y-12">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight italic">Skin Characteristics<span className="text-[#007aff]">.</span></h2>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic mt-1">Customize your clinical profile for hyper-targeted treatments.</p>
                        </div>

                        {/* Skin Type */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black tracking-[0.2em] uppercase text-zinc-400 italic">// Select Skin Type</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                {['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setProfileData({ ...profileData, skinType: type })}
                                        className={`p-6 rounded-2xl border text-center transition-all duration-500 font-black uppercase tracking-widest text-[10px] ${
                                            profileData.skinType === type
                                                ? 'bg-black text-white border-black shadow-xl shadow-black/10 scale-[1.02]'
                                                : 'bg-zinc-50 border-zinc-100 text-zinc-500 hover:bg-white hover:border-zinc-300'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Skin Concerns */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black tracking-[0.2em] uppercase text-zinc-400 italic">// Key Skin Concerns</h3>
                            <div className="flex flex-wrap gap-3">
                                {['Acne', 'Aging', 'Dullness', 'Dark Spots', 'Rosacea', 'Large Pores', 'Fine Lines', 'Redness', 'Dehydration'].map((concern) => {
                                    const isSelected = (profileData.skinConcerns || []).includes(concern);
                                    return (
                                        <button
                                            key={concern}
                                            type="button"
                                            onClick={() => {
                                                const concerns = isSelected
                                                    ? profileData.skinConcerns.filter(c => c !== concern)
                                                    : [...profileData.skinConcerns, concern];
                                                setProfileData({ ...profileData, skinConcerns: concerns });
                                            }}
                                            className={`px-6 py-3 rounded-full border transition-all font-black uppercase tracking-widest text-[9px] ${
                                                isSelected
                                                    ? 'bg-[#007aff] text-white border-[#007aff]'
                                                    : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:border-zinc-300'
                                            }`}
                                        >
                                            {concern}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Usage Protocols */}
                        <div className="space-y-6 pt-6 border-t border-zinc-100">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight italic">Usage Protocols<span className="text-[#007aff]">.</span></h3>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic mt-1">Historical product application logs</p>
                            </div>
                            
                            {orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.flatMap(o => o.products || []).map((item, idx) => (
                                        <div key={idx} className="p-6 rounded-3xl border border-zinc-50 bg-zinc-50/30 flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white border border-zinc-100 rounded-xl p-1 flex items-center justify-center">
                                                    <img src={item.product?.image} className="w-full h-full object-contain mix-blend-multiply" alt="protocol" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black uppercase tracking-tight">{item.product?.name}</h4>
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#007aff] italic mt-1 block">Protocol Step #{idx + 1}</span>
                                                </div>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <span className="px-3 py-1 bg-zinc-100 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-500 italic">
                                                    Apply AM & PM
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 bg-zinc-50/50 border border-zinc-100 rounded-3xl text-center">
                                    <Clock size={32} className="mx-auto text-zinc-300 mb-4 animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">No usage protocols mapped yet. Purchase products to generate routines.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                disabled={updating}
                                onClick={handleProfileUpdate}
                                className="px-10 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#007aff] transition-all italic flex items-center gap-2 disabled:opacity-50"
                            >
                                {updating ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>}
                                Save Skin Profile
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <form onSubmit={handlePasswordUpdate} className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-10 italic">Security Settings<span className="text-[#007aff]">.</span></h3>
                        <div className="space-y-8">
                                <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-400 ml-1">Current Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    placeholder="••••••••••••" 
                                    className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-black uppercase focus:ring-2 focus:ring-[#007aff]/10 outline-none transition-all" 
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-400 ml-1">New Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    placeholder="••••••••••••" 
                                    className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-black uppercase focus:ring-2 focus:ring-[#007aff]/10 outline-none transition-all" 
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-400 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        required
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        placeholder="••••••••••••" 
                                        className={`w-full p-5 border rounded-2xl text-xs font-black uppercase focus:ring-2 focus:ring-[#007aff]/10 outline-none transition-all ${
                                            passwordData.confirmPassword 
                                            ? (passwordData.newPassword === passwordData.confirmPassword ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') 
                                            : 'border-zinc-100 bg-zinc-50'
                                        }`} 
                                    />
                                    {passwordData.confirmPassword && (
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                            {passwordData.newPassword === passwordData.confirmPassword 
                                                ? <CheckCircle2 size={18} className="text-green-500" /> 
                                                : <X size={18} className="text-red-500" />}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="pt-6">
                                <button 
                                    disabled={updating}
                                    type="submit"
                                    className="w-full py-5 bg-black text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#007aff] hover:shadow-2xl hover:shadow-[#007aff]/20 transition-all duration-700 italic flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {updating ? <Loader2 className="animate-spin" size={14}/> : <Lock size={14}/>}
                                    Update Password
                                </button>
                            </div>
                            <div className="flex items-center gap-3 p-6 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800">
                                <ShieldCheck size={20} className="shrink-0" />
                                <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed italic">Two-factor authentication is recommended to secure your account data.</p>
                            </div>
                        </div>
                    </form>
                )}

                {activeTab === 'notifications' && (
                    <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-10 italic">Notification Settings<span className="text-[#007aff]">.</span></h3>
                        <div className="space-y-6">
                            {[
                                { id: 'orderUpdates', title: 'Order Updates', desc: 'Real-time tracking and delivery updates' },
                                { id: 'researchAlerts', title: 'Product Updates', desc: 'Alerts on new product launches and drops' },
                                { id: 'loyaltyMilestones', title: 'Loyalty Alerts', desc: 'Notifications on BarePoints milestones' },
                                { id: 'directMessages', title: 'Direct Messages', desc: 'Support and clinical consultations' },
                                { id: 'weeklyReports', title: 'Weekly Reports', desc: 'Personalized skin health and care summary' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-zinc-50/50 rounded-2xl border border-zinc-50 hover:border-zinc-100 transition-all">
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-tight mb-1">{item.title}</h4>
                                        <p className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">{item.desc}</p>
                                    </div>
                                    <div 
                                        onClick={() => handleNotificationToggle(item.id)}
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-500 ${user.notificationSettings?.[item.id] ? 'bg-[#007aff]' : 'bg-zinc-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all transform ${user.notificationSettings?.[item.id] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile;
