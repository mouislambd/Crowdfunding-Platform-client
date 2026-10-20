'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../lib/api';

interface Notification {
  _id: string;
  message: string;
  actionRoute: string;
  createdAt?: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/notifications`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.notifications || [];
        list.sort((a: Notification, b: Notification) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(list);
      })
      .catch(console.error);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2.5 rounded-xl hover:bg-gray-800 transition-colors relative bg-gray-900 border border-white/10">
        <Bell size={20} className="text-gray-300" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
            {notifications.length}
          </span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto backdrop-blur-xl"
          >
            <div className="p-4 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">Notifications</div>
            {notifications.length === 0 ? (
              <p className="p-6 text-sm text-gray-400 text-center">No new notifications</p>
            ) : (
              notifications.map(n => (
                <a key={n._id} href={n.actionRoute || '#'} onClick={() => setIsOpen(false)} className="block p-4 border-b border-white/5 hover:bg-gray-800/80 text-sm transition-colors">
                  {n.message}
                </a>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
