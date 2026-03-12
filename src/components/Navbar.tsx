import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, MessageSquare, User } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Feed', path: '/' },
    { icon: LayoutDashboard, label: 'Admin', path: '/admin' },
    { icon: MessageSquare, label: 'Contact', path: '/feedback' },
    { icon: User, label: 'Profile', path: '/login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-3 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-accent" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
