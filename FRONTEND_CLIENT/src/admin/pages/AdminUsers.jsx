import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Shield, User as UserIcon, Trash2, Search, Activity, AlertCircle, Fingerprint, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching users', error);
            const errorMsg = error.response?.data?.message || error.message || 'Error: Failed to load user data.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            const toastId = toast.loading('Deleting user account...');
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
                toast.success('User account deleted successfully.', { id: toastId });
            } catch (error) {
                console.error('Error deleting user', error);
                toast.error('Failed to delete user.', { id: toastId });
            }
        }
    };

    const handleBlockUser = async (id) => {
        const toastId = toast.loading('Updating user status...');
        try {
            const res = await api.put(`/admin/users/${id}/block`);
            setUsers(users.map(u => u._id === id ? { ...u, isBlocked: res.data.isBlocked } : u));
            toast.success(res.data.message, { id: toastId });
        } catch (error) {
            console.error('Error updating user status', error);
            toast.error(error.response?.data?.message || 'Failed to update user status.', { id: toastId });
        }
    };

    const filteredUsers = users.filter(user => 
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-6 animate-pulse">
            <Fingerprint size={48} className="text-[#007aff]" />
            <span className="luxe-subheading text-zinc-300">Loading Users...</span>
        </div>
    );

    return (
        <div className="space-y-16 animate-luxe">
            {/* Header section */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-zinc-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-[#007aff]"></div>
                        <span className="luxe-subheading text-[#007aff] text-xs">User Management</span>
                    </div>
                    <h1 className="text-7xl text-black">Users<span className="text-zinc-200">.</span></h1>
                    <div className="flex items-center gap-4 py-2 px-6 bg-zinc-50 rounded-full w-fit">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Registered Users</span>
                        <span className="text-sm font-black text-black">{users.length}</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group w-full lg:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-hover:text-[#007aff] transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="SEARCH NAME OR EMAIL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-50 border border-transparent rounded-full px-14 py-5 text-[10px] font-black tracking-widest uppercase focus:bg-white focus:border-zinc-100 outline-none transition-all placeholder:text-zinc-300"
                    />
                </div>
            </header>

            {/* Table Area */}
            <div className="bg-white rounded-[4rem] border border-zinc-100 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.04)] overflow-hidden">
                <table className="min-w-full divide-y divide-zinc-50">
                    <thead>
                        <tr className="bg-zinc-50/30">
                            <th className="px-12 py-10 text-left luxe-subheading opacity-50">User Name</th>
                            <th className="px-12 py-10 text-left luxe-subheading opacity-50">Email Address</th>
                            <th className="px-12 py-10 text-left luxe-subheading opacity-50">Role</th>
                            <th className="px-12 py-10 text-left luxe-subheading opacity-50">Joined On</th>
                            <th className="px-12 py-10 text-right luxe-subheading opacity-50">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50/50">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-zinc-50/40 transition-all duration-1000 group">
                                <td className="px-12 py-8">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl transition-all duration-700 ${
                                            user.isAdmin 
                                            ? 'bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]' 
                                            : 'bg-zinc-50 text-zinc-300 group-hover:bg-[#007aff]/10 group-hover:text-[#007aff]'
                                        }`}>
                                            {user.isAdmin ? <Shield size={18} /> : <UserIcon size={18} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black italic text-black uppercase">{user.name}</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300">USER ID: {user._id.substring(user._id.length-6).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-12 py-8">
                                    <span className="text-[11px] font-bold text-zinc-400 italic lowercase tracking-tight">{user.email}</span>
                                </td>
                                <td className="px-12 py-8">
                                    <div className="flex flex-col gap-2">
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase italic transition-all duration-700 w-fit ${
                                            user.isAdmin 
                                            ? 'bg-black text-white' 
                                            : 'bg-zinc-50 text-zinc-400 group-hover:bg-[#007aff]/5 group-hover:text-[#007aff]'
                                        }`}>
                                            {user.isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER'}
                                        </div>
                                        {!user.isAdmin && user.isBlocked && (
                                            <div className="px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase italic bg-red-50 text-red-500 w-fit">
                                                BLOCKED
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-12 py-8">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 italic">
                                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </td>
                                <td className="px-12 py-8 text-right">
                                    {!user.isAdmin && (
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700">
                                            <button 
                                                onClick={() => handleBlockUser(user._id)}
                                                className={`p-4 rounded-2xl transition-all duration-700 ${user.isBlocked ? 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-orange-50 text-orange-400 hover:bg-orange-500 hover:text-white'}`}
                                                title={user.isBlocked ? "Unblock User" : "Block User"}
                                            >
                                                {user.isBlocked ? <CheckCircle size={18} /> : <Ban size={18} />}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-4 bg-red-50 text-red-200 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-700"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                    {user.isAdmin && (
                                        <div className="flex justify-end pr-4 text-zinc-200">
                                            <Shield size={14} className="animate-pulse" />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center space-y-6">
                        <div className="p-8 bg-zinc-50 rounded-full text-zinc-100">
                            <AlertCircle size={64} strokeWidth={1} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black italic text-zinc-300 uppercase tracking-widest">No Users Found</h3>
                            <p className="text-[10px] font-black text-zinc-200 uppercase tracking-[0.4em] mt-2">We couldn't find any users matching your search.</p>
                        </div>
                    </div>
                )}
            </div>

            <footer className="py-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 italic">User Management Panel // 2026 BareSkin Cloud</p>
            </footer>
        </div>
    );
};

export default AdminUsers;
