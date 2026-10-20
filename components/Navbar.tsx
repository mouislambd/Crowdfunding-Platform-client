'use client';

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, authClient } from '../lib/auth-client';
import Logo from './Logo';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Hide Navbar if on a dashboard page
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleLogout = async () => {
    await authClient.signOut();
    setIsDropdownOpen(false);
    router.push('/');
  };

  const getDashboardHome = () => {
    if (!session?.user?.role) return '/dashboard/supporter-home';
    const role = session.user.role.toLowerCase().trim();
    if (role === 'admin') return '/dashboard/admin-home';
    if (role === 'builder') return '/dashboard/builder-home';
    return '/dashboard/supporter-home';
  };

  const dashboardHome = getDashboardHome();

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-black/80 backdrop-blur-md border-white/10 shadow-lg shadow-black/50' : 'bg-black/40 backdrop-blur-md border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/">
            <Logo size="md" />
          </Link>
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {!session?.user ? (
              <>
                <Link href="/campaigns" className="text-gray-300 hover:text-white transition-colors">Explore Campaigns</Link>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link href="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link>
              </>
            ) : (
              <>
                <Link href={dashboardHome} className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-semibold shadow-lg shadow-emerald-950/50">
                  <span className="text-emerald-400 font-bold">$</span>
                  <span>{(((session.user.credits || 0) / 20)).toFixed(2)} USD</span>
                  <span className="text-xs text-gray-400 font-normal hidden sm:inline">({session.user.credits || 0} Cr)</span>
                </div>
                
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 group">
                    <img src={session.user.image || '/avatar-placeholder.jpg'} alt={session.user.name} className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover:border-blue-500 transition-colors" />
                    <span className="text-gray-300 group-hover:text-white transition-colors">{session.user.name}</span>
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-2xl py-2 shadow-2xl backdrop-blur-md"
                      >
                        <Link href={dashboardHome} className="block px-4 py-2 hover:bg-gray-800 transition-colors" onClick={() => setIsDropdownOpen(false)}>Dashboard</Link>
                        <Link href="/profile" className="block px-4 py-2 hover:bg-gray-800 transition-colors" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors text-red-400">Logout</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
            <a href="https://github.com/mouislambd/Crowdfunding-Platform-client" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all">Join as Developer</a>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2 rounded-xl bg-white/5 border border-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 text-white"
          >
            {!session?.user ? (
              <>
                <Link href="/campaigns" className="py-2 hover:text-blue-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Explore Campaigns</Link>
                <Link href="/login" className="py-2 hover:text-blue-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link href="/register" className="py-2 hover:text-blue-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <>
                <Link href={dashboardHome} className="py-2 hover:text-blue-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold py-1">
                  <span>Balance: ${(((session.user.credits || 0) / 20)).toFixed(2)} USD</span>
                  <span className="text-xs text-gray-400">({session.user.credits || 0} Cr)</span>
                </div>
                <Link href="/profile" className="py-2 hover:text-blue-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                <button onClick={handleLogout} className="text-left py-2 text-red-400 hover:text-red-300 transition-colors">Logout</button>
              </>
            )}
            <a href="https://github.com/mouislambd/Crowdfunding-Platform-client" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-center text-white py-3 rounded-2xl font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all" onClick={() => setIsMobileMenuOpen(false)}>Join as Developer</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
