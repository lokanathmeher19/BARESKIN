import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { User, Package, CreditCard, RefreshCw, Lock, LogOut, Save, Mail, Phone, MapPin, Award } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const MobileProfile = () => {
    const { formatPrice } = useCurrency();
    const { user, logout, setUser } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [activeSection, setActiveSection] = useState('profile'); // profile, orders, subscriptions, security
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        zip: user?.zip || '',
        city: user?.city || '',
        state: user?.state || '',
        address: user?.address || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

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

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await api.post('/auth/profile-update', profileData);
            if (res.data.success) {
                setUser({ ...user, ...profileData, ...res.data.user });
                toast.success('Profile updated!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
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
                toast.success('Password updated!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    const handleZipLookup = async (pincode) => {
        setProfileData(prev => ({ ...prev, zip: pincode }));
        if (pincode.length === 6) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await response.json();
                if (data[0].Status === "Success") {
                    const po = data[0].PostOffice[0];
                    setProfileData(prev => ({
                        ...prev,
                        zip: pincode,
                        city: po.District,
                        state: po.State
                    }));
                    toast.success(`Location: ${po.District}`);
                }
            } catch (error) {
                console.error("Zip lookup failed", error);
            }
        }
    };

    return (
        <div className="pt-8 px-4 bg-white min-h-screen">
            {/* Header User Card */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-5 mb-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-[#007aff]/5 border border-[#007aff]/10 rounded-2xl flex items-center justify-center text-[#007aff]">
                    <User size={28} />
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 truncate">{user.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Live Connect</span>
                        <span className="text-[8px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                            Points: {user.points || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Segment Links */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                    { id: 'profile', icon: <User size={16} />, label: 'Details' },
                    { id: 'orders', icon: <Package size={16} />, label: 'Orders' },
                    { id: 'security', icon: <Lock size={16} />, label: 'Pass' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id)}
                        className={`py-3 rounded-2xl flex flex-col items-center gap-1.5 text-[8px] font-black uppercase tracking-wider transition-all ${
                            activeSection === tab.id
                            ? 'bg-black text-white'
                            : 'bg-zinc-50 text-zinc-400 border border-zinc-100'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
                <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-red-500 bg-red-50/50"
                >
                    <LogOut size={16} />
                    Exit
                </button>
            </div>

            {/* General Profile Info Form */}
            {activeSection === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">Full Name</label>
                        <input 
                            type="text" 
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-bold outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">Email</label>
                        <input type="text" value={user.email} disabled className="p-3.5 bg-zinc-100 border border-zinc-150 rounded-xl text-xs font-bold text-zinc-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">Phone</label>
                        <input 
                            type="text" 
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            placeholder="Phone number"
                            className="p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-bold outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">Zip Code</label>
                        <input 
                            type="text" 
                            value={profileData.zip}
                            onChange={(e) => handleZipLookup(e.target.value)}
                            placeholder="Pincode"
                            className="p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-bold outline-none"
                        />
                    </div>
                    {profileData.city && (
                        <span className="text-[9px] font-black text-[#007aff] uppercase block -mt-1 ml-1">{profileData.city}, {profileData.state}</span>
                    )}
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">Address</label>
                        <textarea 
                            value={profileData.address}
                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                            rows="2"
                            placeholder="Full address details"
                            className="p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-bold outline-none resize-none"
                        />
                    </div>
                    <button type="submit" disabled={updating} className="w-full py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2">
                        <Save size={14} /> Save Profile Changes
                    </button>
                </form>
            )}

            {/* Orders Tab */}
            {activeSection === 'orders' && (
                <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-zinc-400 mb-2">Order History</h4>
                    {loading ? (
                        <span className="text-xs text-zinc-400 font-bold uppercase block text-center py-10">Loading orders...</span>
                    ) : orders.length > 0 ? (
                        orders.map(order => (
                            <div key={order._id} className="p-4 border border-zinc-100 rounded-2xl flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black text-[#007aff]">ORDER_{order._id.slice(-6).toUpperCase()}</span>
                                    <span className="text-[8px] bg-black text-white px-2 py-0.5 rounded font-black">{order.paymentStatus || 'RECORDED'}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[8px] font-bold text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span className="text-sm font-black italic">{formatPrice(order.totalPrice)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">No Orders Found</span>
                        </div>
                    )}
                </div>
            )}

            {/* Security Tab */}
            {activeSection === 'security' && (
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-zinc-400 mb-2">Change Password</h4>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">Current Password</label>
                        <input 
                            type="password" 
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-bold outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">New Password</label>
                        <input 
                            type="password" 
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-bold outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">Confirm New Password</label>
                        <input 
                            type="password" 
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl text-xs font-bold outline-none"
                        />
                    </div>
                    <button type="submit" disabled={updating} className="w-full py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2">
                        <Save size={14} /> Update Password
                    </button>
                </form>
            )}
        </div>
    );
};

export default MobileProfile;
