'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (res.ok) {
        // Automatically log in after signup
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();

        if (loginRes.ok) {
          login(loginData.user);
          router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-[#A3FF00] selection:text-black font-inter">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#A3FF00] rounded-xl rotate-12 flex items-center justify-center border-2 border-black group-hover:rotate-0 transition-transform duration-500">
              <div className="w-3 h-3 bg-black rounded-full" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#A3FF00] uppercase italic">TrustRoute</span>
          </Link>
          <h1 className="mt-8 text-4xl font-black text-white tracking-tight uppercase italic underline decoration-[#A3FF00] decoration-4 underline-offset-8">
            Join the Route
          </h1>
          <p className="mt-4 text-white/40 text-sm font-medium uppercase tracking-widest">
            Create your account to get started
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          {/* Decorative Gradient */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#A3FF00]/10 blur-[60px] rounded-full -ml-16 -mt-16 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#A3FF00] focus:ring-1 focus:ring-[#A3FF00] transition-all placeholder:text-white/10 text-sm font-medium"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#A3FF00] focus:ring-1 focus:ring-[#A3FF00] transition-all placeholder:text-white/10 text-sm font-medium"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#A3FF00] focus:ring-1 focus:ring-[#A3FF00] transition-all placeholder:text-white/10 text-sm font-medium"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A3FF00] text-black font-black uppercase tracking-[0.15em] py-5 rounded-2xl hover:bg-white transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#A3FF00]/10 mt-4 text-sm"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
          Already registered?{' '}
          <Link href="/login" className="text-[#A3FF00] hover:underline underline-offset-4 decoration-2">
            Sign In Instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
