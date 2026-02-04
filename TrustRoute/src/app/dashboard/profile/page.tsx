'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Settings, LogOut, ArrowLeft, Mail, Calendar, Phone, Edit2, Lock, Save, X, CheckCircle2, AlertCircle, Loader2, Bus, History } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: authLoading, refreshUser } = useAuth();

    // UI States
    const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'security'>('overview');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phoneNumber: user.phoneNumber || '',
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                await refreshUser();
                setTimeout(() => setActiveTab('overview'), 1500); // Switch back after success
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong. Please check your network and try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
            setMessage({ type: 'error', text: 'New password cannot be the same as your current password' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to change password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/me', { method: 'POST' }); // Using the logout endpoint in me/route.ts
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand animate-spin" />
            </div>
        );
    }

    if (!user) {
        // Should be redirected by middleware or AuthContext, but just in case
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50/30 font-inter">
            {/* Decorative Background */}
            <div className="fixed inset-0 -z-10 pointer-events-none opacity-30">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand rounded-full blur-[140px] opacity-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[140px] opacity-10" />
            </div>

            {/* Sidebar (Consistency with Dashboard) */}
            <aside className="hidden md:flex w-64 bg-white/80 border-r border-gray-200 flex-col p-6 shadow-sm min-h-screen fixed top-0 left-0 z-20 backdrop-blur-xl">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-brand italic font-serif tracking-tight">TrustRoute</h2>
                </div>
                <nav className="flex flex-col gap-2">
                    <Link href="/dashboard" className="flex items-center gap-3 text-gray-500 hover:bg-gray-100 font-medium rounded-xl px-4 py-3 transition-all">
                        <Bus size={20} /> Dashboard
                    </Link>
                    <Link href="/dashboard/bookings" className="flex items-center gap-3 text-gray-500 hover:bg-gray-100 font-medium rounded-xl px-4 py-3 transition-all">
                        <History size={20} /> My Bookings
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-3 bg-brand/10 text-brand font-semibold rounded-xl px-4 py-3 transition-all">
                        <Settings size={20} /> Profile
                    </Link>
                </nav>
                <div className="mt-auto pt-10">
                    <Link href="/" className="text-gray-400 hover:text-brand text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                        ← Return Home
                    </Link>
                </div>
            </aside>

            <div className="md:ml-64 p-4 md:p-8 mb-24 md:mb-0">
                <div className="md:hidden flex items-center gap-2 mb-6 text-brand">
                    <Bus size={20} />
                    <span className="text-xl font-bold font-serif italic">TrustRoute</span>
                </div>

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pt-2 md:pt-4 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-1 md:mb-2">Account Settings</h1>
                        <p className="text-gray-500 text-sm md:text-base">Manage your personal information and security.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* User Summary Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-sm border border-gray-200 p-6 md:p-8 text-center sticky top-8">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-brand font-bold text-3xl md:text-4xl border-4 border-white shadow-lg">
                                {user.name ? user.name[0].toUpperCase() : 'U'}
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{user.name || 'User'}</h2>
                            <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6">{user.email}</p>

                            <div className="flex justify-center gap-2 mb-6 md:mb-8">
                                <span className="px-3 md:px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-[10px] md:text-xs font-bold border border-green-100">
                                    Verified Account
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-xl px-4 py-3 transition-all font-bold text-sm border border-transparent hover:border-red-100"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Areas */}
                    <div className="lg:col-span-8">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1.5 md:p-2 mb-6 md:mb-8 flex flex-wrap md:flex-nowrap gap-1 md:gap-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 min-w-[100px] py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'overview' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <User size={16} className="md:w-[18px] md:h-[18px]" /> Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('edit')}
                                className={`flex-1 min-w-[100px] py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'edit' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <Edit2 size={16} className="md:w-[18px] md:h-[18px]" /> Edit
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`flex-1 min-w-[100px] py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'security' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <Lock size={16} className="md:w-[18px] md:h-[18px]" /> Security
                            </button>
                        </div>

                        {/* Status Messages */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <p className="font-medium text-sm">{message.text}</p>
                            </div>
                        )}

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-sm border border-gray-200 p-6 md:p-8 space-y-4 md:space-y-6 animate-in fade-in duration-300">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 font-serif">Profile Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="p-3 md:p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                                            <div className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm">
                                                <User size={16} className="text-brand md:w-[18px] md:h-[18px]" />
                                            </div>
                                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">Full Name</p>
                                        </div>
                                        <p className="text-gray-900 font-bold ml-1 text-sm md:text-base">{user.name || 'Not provided'}</p>
                                    </div>

                                    <div className="p-3 md:p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                                            <div className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm">
                                                <Mail size={16} className="text-brand md:w-[18px] md:h-[18px]" />
                                            </div>
                                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">Email Address</p>
                                        </div>
                                        <p className="text-gray-900 font-bold ml-1 text-sm md:text-base truncate">{user.email}</p>
                                    </div>

                                    <div className="p-3 md:p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                                            <div className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm">
                                                <Phone size={16} className="text-brand md:w-[18px] md:h-[18px]" />
                                            </div>
                                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">Phone Number</p>
                                        </div>
                                        <p className="text-gray-900 font-bold ml-1 text-sm md:text-base">{user.phoneNumber || 'Not provided'}</p>
                                    </div>

                                    <div className="p-3 md:p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                                            <div className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm">
                                                <Calendar size={16} className="text-brand md:w-[18px] md:h-[18px]" />
                                            </div>
                                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">Member Since</p>
                                        </div>
                                        <p className="text-gray-900 font-bold ml-1 text-sm md:text-base">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Tab */}
                        {activeTab === 'edit' && (
                            <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-sm border border-gray-200 p-6 md:p-8 animate-in fade-in duration-300">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 font-serif mb-4 md:mb-6">Update Information</h3>
                                <form onSubmit={handleProfileUpdate} className="space-y-4 md:space-y-6">
                                    <div>
                                        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-3 md:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand form-input text-sm"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setFormData({ ...formData, phoneNumber: val });
                                            }}
                                            className="w-full p-3 md:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand form-input text-sm"
                                            placeholder="Enter 10 digit number"
                                            pattern="[0-9]{10}"
                                            title="10 digit phone number"
                                        />
                                        <div className="flex justify-between items-center mt-2 ml-1">
                                            <p className="text-xs text-gray-500">Must be a valid 10-digit number</p>
                                            {formData.phoneNumber.length > 0 && formData.phoneNumber.length < 10 && (
                                                <span className="text-xs text-orange-600 font-medium">
                                                    {10 - formData.phoneNumber.length} digits remaining
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-3 md:pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('overview')}
                                            className="px-4 md:px-6 py-2.5 md:py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-black text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold hover:bg-brand hover:text-black transition-all flex items-center gap-2 shadow-lg disabled:opacity-70 text-sm"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={16} />}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-sm border border-gray-200 p-6 md:p-8 animate-in fade-in duration-300">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 font-serif mb-4 md:mb-6">Change Password</h3>
                                <form onSubmit={handlePasswordChange} className="space-y-4 md:space-y-6">
                                    <div>
                                        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            required
                                            className="w-full p-3 md:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand form-input text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                required
                                                minLength={6}
                                                className="w-full p-3 md:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand form-input text-sm"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                required
                                                minLength={6}
                                                className="w-full p-3 md:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand form-input text-sm"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-3 md:p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
                                        <AlertCircle className="text-orange-600 shrink-0 mt-0.5" size={16} />
                                        <div className="text-[11px] md:text-sm text-orange-800">
                                            <span className="font-bold block mb-0.5 md:mb-1">Security Note</span>
                                            Changing your password will require you to log in again on other devices.
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-3 md:pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('overview')}
                                            className="px-4 md:px-6 py-2.5 md:py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-black text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold hover:bg-brand hover:text-black transition-all flex items-center gap-2 shadow-lg disabled:opacity-70 text-sm"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={16} />}
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
                {/* Floating Navbar (Consistency with Dashboard) */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <Navbar />
                </div>
            </div>
        </div>
    );
}
