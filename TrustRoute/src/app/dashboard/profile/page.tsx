'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Settings, LogOut, ArrowLeft, Mail, Calendar } from 'lucide-react';

interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/session', { method: 'DELETE' });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        href="/dashboard" 
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    {user?.name || 'User'}
                                </h2>
                                <p className="text-gray-500 text-sm">{user?.email}</p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 rounded-xl px-4 py-3 mb-2 transition-all"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                                <Link
                                    href="/dashboard/bookings"
                                    className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 rounded-xl px-4 py-3 mb-2 transition-all"
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-medium">My Bookings</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 rounded-xl px-4 py-3 transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Account Information</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900">{user?.name || 'Not provided'}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900">{user?.email}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Member Since
                                    </label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900">
                                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Account Actions</h4>
                                <div className="space-y-3">
                                    <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-medium">
                                        Change Password
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium">
                                        Update Profile
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
