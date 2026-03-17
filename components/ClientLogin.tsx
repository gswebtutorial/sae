'use client';

import React, { useState, useEffect } from 'react';
import { LogIn, X, Loader2, UserCheck, Phone } from 'lucide-react';

interface ClientLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (booking: any) => void;
}

const ClientLogin: React.FC<ClientLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [foundBooking, setFoundBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (phoneNumber.length >= 10) {
      const delayDebounceFn = setTimeout(() => {
        handleLookup(phoneNumber);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setFoundBooking(null);
      setError(null);
    }
  }, [phoneNumber]);

  const handleLookup = async (phone: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const result = await res.json();

      if (res.ok) {
        setFoundBooking(result.booking);
      } else {
        setFoundBooking(null);
        if (phone.length >= 10) setError('No booking found for this number');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const confirmLogin = () => {
    if (foundBooking) {
      onLoginSuccess(foundBooking);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-[#7B1E1E] p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-[#C9973A] rounded-2xl mb-4 shadow-lg">
              <LogIn size={32} className="text-[#7B1E1E]" />
            </div>
            <h2 className="text-3xl font-bold font-serif text-[#FFF8F0]">Find Your Booking</h2>
            <p className="text-[#C9973A] text-sm mt-1 font-light tracking-wide">
              Just type your phone number to continue
            </p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="relative">
            <label className="block text-xs font-bold text-[#7B1E1E] uppercase tracking-widest mb-2 px-1">
              Registered Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9973A]">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#C9973A] focus:ring-0 outline-none transition-all text-lg font-medium tracking-tighter"
                autoFocus
              />
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 size={20} className="animate-spin text-[#C9973A]" />
                </div>
              )}
            </div>
          </div>

          {error && !foundBooking && phoneNumber.length >= 10 && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm border border-red-100 text-center animate-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          {foundBooking && (
            <div className="bg-[#FFF8F0] p-6 rounded-2xl border-2 border-[#C9973A]/30 space-y-4 animate-in zoom-in-95 duration-300 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <UserCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-[#C9973A] font-bold uppercase tracking-widest">Booking Found!</p>
                  <p className="text-lg font-bold text-[#7B1E1E] leading-none">{foundBooking.client_name}</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-[#C9973A]/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">City</p>
                  <p className="text-sm font-semibold text-[#2C1810]">{foundBooking.city}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Package Size</p>
                  <p className="text-sm font-semibold text-[#2C1810]">
                    {Object.keys(foundBooking.selected_functions || {}).length} Functions
                  </p>
                </div>
              </div>

              <button
                onClick={confirmLogin}
                className="btn-maroon w-full py-4 rounded-xl text-lg font-bold shadow-xl shadow-[#7B1E1E]/20 mt-2"
              >
                Yes, This is Me!
              </button>
            </div>
          )}

          {!foundBooking && !loading && phoneNumber.length < 10 && (
            <p className="text-center text-gray-400 text-xs italic px-6">
              Enter the 10-digit mobile number you used during your first booking.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
