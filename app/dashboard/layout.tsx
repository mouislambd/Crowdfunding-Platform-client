'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from '../../lib/auth-client';
import { Menu, X, Home, Compass, CreditCard, Clock, PlusCircle, LayoutDashboard, DollarSign, Users, FileText, ArrowLeft } from 'lucide-react';
import NotificationBell from '../../components/NotificationBell';
import { normalizeRole } from '../../lib/roles';
import Logo from '../../components/Logo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!isPending && !session && !redirectedRef.current) {
      redirectedRef.current = true;
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending || !session) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      <div className="flex flex-col items-center gap-2">
        <div className="h-4 w-32 bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-3 w-24 bg-gray-900 rounded-lg animate-pulse" />
      </div>
    </div>
  );

  const role = normalizeRole(session.user.role) || 'supporter';

  const navItems = {
    supporter: [
      { name: 'Home', href: '/dashboard/supporter-home', icon: Home },
      { name: 'Explore Campaigns', href: '/campaigns', icon: Compass },
      { name: 'My Contributions', href: '/dashboard/my-contributions', icon: Clock },
      { name: 'Purchase Credit', href: '/dashboard/purchase-credit', icon: CreditCard },
      { name: 'Payment History', href: '/dashboard/payment-history', icon: FileText },
    ],
    builder: [
      { name: 'Home', href: '/dashboard/builder-home', icon: Home },
      { name: 'Add Campaign', href: '/dashboard/add-campaign', icon: PlusCircle },
      { name: 'My Campaigns', href: '/dashboard/my-campaigns', icon: LayoutDashboard },
      { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: DollarSign },
      { name: 'Payment History', href: '/dashboard/payment-history', icon: FileText },
    ],
    admin: [
      { name: 'Home', href: '/dashboard/admin-home', icon: Home },
      { name: 'Manage Users', href: '/dashboard/manage-users', icon: Users },
      { name: 'Manage Campaigns', href: '/dashboard/manage-campaigns', icon: LayoutDashboard },
      { name: 'Withdrawal Requests', href: '/dashboard/withdrawal-requests', icon: DollarSign },
      { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    ],
  };

  const currentNav = navItems[role as keyof typeof navItems] || navItems.supporter;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex overflow-x-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900/90 backdrop-blur-xl z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 border-r border-white/10 rounded-r-3xl md:rounded-none shadow-2xl`}>
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}><X /></button>
        </div>
        <nav className="p-4 space-y-2">
          {currentNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`relative flex items-center gap-3 p-3.5 rounded-2xl transition-colors font-medium ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-white/10">
            <Link href="/" className="flex items-center gap-3 p-3.5 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Website</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        <header className="bg-gray-900/80 backdrop-blur-md p-4 px-6 border-b border-white/10 flex justify-between items-center sticky top-0 z-10 shadow-lg">
          <button className="md:hidden text-white p-2 rounded-xl bg-white/5 border border-white/10" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
          <div className="flex items-center gap-4 ml-auto">
            <NotificationBell />
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-semibold shadow-lg shadow-emerald-950/50">
              <span className="text-emerald-400 font-bold">$</span>
              <span>{(((session.user.credits || 0) / 20)).toFixed(2)} USD</span>
              <span className="text-xs text-gray-400 font-normal hidden sm:inline">({session.user.credits || 0} Cr)</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl">
              <img src={session.user.image || '/avatar-placeholder.jpg'} alt={session.user.name} className="w-8 h-8 rounded-full object-cover border border-white/20" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold leading-tight">{session.user.name}</p>
                <p className="text-xs text-gray-400 capitalize leading-tight">{role}</p>
              </div>
            </div>
          </div>
        </header>
        <motion.main 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 sm:p-8 flex-1"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
