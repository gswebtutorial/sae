"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flower, Lock, User, ArrowRight } from 'lucide-react';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-[#C9973A]/20 overflow-hidden">
        <div className="bg-[#7B1E1E] p-8 text-center text-white">
          <div className="bg-white/10 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <Flower size={32} className="text-[#C9973A]" />
          </div>
          <h1 className="text-2xl font-bold font-serif mb-1 uppercase tracking-tight">Admin Portal</h1>
          <p className="text-[#C9973A] text-xs font-medium uppercase tracking-[0.2em]">Shree Annapurna Events</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 italic">
              * {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#7B1E1E] uppercase tracking-widest flex items-center gap-1">
              <User size={12} className="text-[#C9973A]" /> Username
            </label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[#FFF8F0]/50 border border-[#C9973A]/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
              placeholder="admin"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#7B1E1E] uppercase tracking-widest flex items-center gap-1">
              <Lock size={12} className="text-[#C9973A]" /> Password
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#FFF8F0]/50 border border-[#C9973A]/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#7B1E1E] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#C9973A] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : (
              <>
                Login System <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
