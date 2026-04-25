import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Persistence handled by AuthContext and localStorage
    React.useEffect(() => {
        // Only redirect if already logged in as admin
        const savedToken = localStorage.getItem('token');
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (savedToken && savedUser.isAdmin) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = await login(email, password);
            if (userData) {
                // Check if the user is an admin
                if (userData.isAdmin) {
                    navigate('/admin');
                } else {
                    logout();
                    setError('Access Denied: You do not have administrative privileges.');
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 mb-32 animate-fade-in px-4">
            <h1 className="text-4xl font-bold mb-10 text-center tracking-tight">Login</h1>
            {error && <div className="bg-red-50 text-red-600 p-4 mb-6 text-sm text-center border border-red-100">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="remember" 
                            defaultChecked 
                            className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black"
                        />
                        <label htmlFor="remember" className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Remember Me</label>
                    </div>
                </div>
                <button type="submit" className="w-full bg-black text-white hover:bg-gray-800 transition duration-300 py-5 uppercase tracking-widest text-sm font-semibold mt-4 shadow-sm hover:shadow-md">
                    Sign In
                </button>
            </form>
            <div className="mt-10 text-center text-gray-400 text-xs italic">
                BareSkin Administrative Access Only
            </div>
        </div>
    );
};

export default Login;
