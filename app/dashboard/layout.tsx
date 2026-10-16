'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '../../lib/auth-client';
import { Menu, X, Home, Compass, CreditCard, Clock, PlusCircle, LayoutDashboard, DollarSign, Users, FileText, ArrowLeft } from 'lucide-react';
import NotificationBell from '../../components/NotificationBell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending || !session) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;

  const role = (session.user.role || 'supporter').toLowerCase().trim();
  console.log("User role:", role);

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
      { name: 'Add New Campaign', href: '/dashboard/add-campaign', icon: PlusCircle },
      { name: 'My Campaigns', href: '/dashboard/my-campaigns', icon: LayoutDashboard },
      { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: DollarSign },
      { name: 'Payment History', href: '/dashboard/payment-history', icon: FileText },
    ],
    admin: [
      { name: 'Home', href: '/dashboard', icon: Home },
      { name: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
      { name: 'Manage Campaigns', href: '/dashboard/campaign-approvals', icon: LayoutDashboard },
      { name: 'Withdrawal Requests', href: '/dashboard/admin/withdrawals', icon: DollarSign },
      { name: 'Reports', href: '/dashboard/admin/reports', icon: FileText },
    ],
  };

  const currentNav = navItems[role as keyof typeof navItems] || navItems.supporter;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform border-r border-gray-800`}>
        <div className="p-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold cursor-pointer hover:text-gray-300 transition-colors">FundRise</Link>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}><X /></button>
        </div>
        <nav className="p-4 space-y-2">
          {currentNav.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
          <Link href="/" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
            Back to Website
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
          <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
          <div className="flex items-center gap-4 ml-auto">
            <NotificationBell />
            <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">{session.user.credits || 0} Credits</span>
            <div className="flex items-center gap-2">
              <img src={session.user.image || '/avatar-placeholder.jpg'} alt={session.user.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-semibold">{session.user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
