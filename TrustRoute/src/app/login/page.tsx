'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-6 selection:bg-[#A3FF00] selection:text-black font-inter relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#A3FF00]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A3FF00]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-10 md:mb-12">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-[#A3FF00] rounded-xl rotate-12 flex items-center justify-center border-2 border-black group-hover:rotate-0 transition-transform duration-500">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-black rounded-full" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-[#A3FF00] uppercase italic">TrustRoute</span>
          </Link>
          <h1 className="mt-6 md:mt-8 text-3xl md:text-4xl font-black text-white tracking-tight uppercase italic underline decoration-[#A3FF00] decoration-4 underline-offset-8">
            Welcome Back
          </h1>
          <p className="mt-3 md:mt-4 text-white/40 text-[10px] md:text-sm font-medium uppercase tracking-widest">
            Enter your credentials to continue
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 relative">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-3.5 md:py-4 text-white focus:outline-none focus:border-[#A3FF00] focus:ring-1 focus:ring-[#A3FF00] transition-all placeholder:text-white/10 text-sm font-medium"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 flex justify-between">
                <span>Password</span>
                <a href="#" className="text-[#A3FF00]/40 hover:text-[#A3FF00] transition-colors">Forgot?</a>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-3.5 md:py-4 text-white focus:outline-none focus:border-[#A3FF00] focus:ring-1 focus:ring-[#A3FF00] transition-all placeholder:text-white/10 text-sm font-medium"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A3FF00] text-black font-black uppercase tracking-[0.15em] py-4 md:py-5 rounded-2xl hover:bg-white transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#A3FF00]/10 mt-2 md:mt-4 text-xs md:text-sm"
            >
              {loading ? 'Authenticating...' : 'Sign In Now'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-white/30 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
          New to the route?{' '}
          <Link href="/signup" className="text-[#A3FF00] hover:underline underline-offset-4 decoration-2">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
