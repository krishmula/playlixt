import React from 'react';
import Link from 'next/link';
import { Home, Settings, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Playlixt
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-1 hover:text-blue-600 transition">
            <Home size={20} />
            <span className="hidden md:inline">Home</span>
          </Link>
          
          <Link href="/settings" className="flex items-center space-x-1 hover:text-blue-600 transition">
            <Settings size={20} />
            <span className="hidden md:inline">Settings</span>
          </Link>
          
          {/* Account Avatar/Profile */}
          <Link href="/account" className="flex items-center space-x-1 hover:text-blue-600 transition">
            <User size={20} />
            <span className="hidden md:inline">Account</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
