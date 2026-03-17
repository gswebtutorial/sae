"use client";

import React from 'react';
import { Check, Calendar, ArrowRight, Heart } from 'lucide-react';

interface SubmitSuccessProps {
  onReset: () => void;
}

const SubmitSuccess = ({ onReset }: SubmitSuccessProps) => {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 bg-[#7B1E1E] rounded-full mx-auto flex items-center justify-center shadow-2xl">
            <Check size={48} className="text-[#C9973A]" />
          </div>
          <div className="absolute top-0 right-1/4 animate-bounce">
            <Heart size={24} className="text-[#C9973A] fill-[#C9973A]" />
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold font-serif text-[#7B1E1E] mb-4">Request Sent!</h1>
          <p className="text-lg text-[#2C1810]">
            Thank you for choosing <span className="font-bold">Shree Annapurna Events</span>. 
            Our wedding planners will contact you shortly on WhatsApp to discuss your requirements.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#C9973A]/30 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-[#FFF8F0] rounded-xl flex items-center justify-center">
              <Calendar size={20} className="text-[#7B1E1E]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Next Steps</p>
              <p className="text-sm font-semibold">Admin review & Proposal generation</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onReset}
          className="btn-maroon w-full py-4 flex items-center justify-center gap-2"
        >
          Back to Home <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SubmitSuccess;
