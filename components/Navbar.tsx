"use client";

import React from 'react';
import Link from 'next/link';
import { Flower } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-[#7B1E1E] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Flower className="text-[#C9973A] w-8 h-8" />
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight leading-none text-[#FFF8F0] font-serif">
                SHREE ANNAPURNA
              </span>
              <span className="text-[10px] tracking-[0.2em] font-light text-[#C9973A] uppercase">
                Events & Weddings
              </span>
            </div>
          </Link>
          
          <div className="hidden md:block">
            <Link 
              href="/admin" 
              className="text-[#FFF8F0] hover:text-[#C9973A] px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
