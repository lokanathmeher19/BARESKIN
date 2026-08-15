import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await register(name, email, password);
            if (success) navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 mb-32 animate-fade-in px-4">
            <h1 className="text-4xl font-bold mb-10 text-center tracking-tight">Create Account</h1>
            {error && <div className="bg-red-50 text-red-600 p-4 mb-6 text-sm text-center border border-red-100">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Full Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors"
                        required
                    />
                </div>
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
                <button type="submit" className="w-full bg-black text-white hover:bg-gray-800 transition duration-300 py-5 uppercase tracking-widest text-sm font-semibold mt-8 shadow-sm hover:shadow-md">
                    Register
                </button>
            </form>
            <div className="mt-10 text-center text-gray-500 text-sm">
                Already have an account? <Link to="/login" className="text-black hover:underline font-medium">Log in</Link>
            </div>
        </div>
    );
};

export default Register;
