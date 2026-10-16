'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
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
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-800 relative">
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase">Notifications</div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">No new notifications</p>
          ) : (
            notifications.map(n => (
              <a key={n._id} href={n.actionRoute || '#'} onClick={() => setIsOpen(false)} className="block p-3 border-b border-gray-800 hover:bg-gray-800 text-sm transition-colors">
                {n.message}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
