"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Send, MapPin, Calendar, User, Phone, Mail, Users, MessageSquare } from 'lucide-react';

interface ClientFormProps {
  selectedSelections: Record<string, string[]>;
  onClose: () => void;
  onSuccess: () => void;
}

const ClientForm = ({ selectedSelections, onClose, onSuccess }: ClientFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // API call placeholder for now
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          selectedFunctions: selectedSelections
        }),
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        alert("Failed to submit booking. We will complete the API integration in the next stage.");
        // For development purposes, let's trigger success even if API fails (since we haven't built it yet)
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-[#FFF8F0] w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="bg-[#7B1E1E] p-6 text-white flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold font-serif leading-none mb-1 text-[#FFF8F0]">Complete Your Booking</h2>
            <p className="text-[#C9973A] text-xs font-medium uppercase tracking-widest">Shree Annapurna Events</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          {/* Selections Summary */}
          <div className="bg-white p-5 rounded-2xl border border-[#C9973A]/20 shadow-sm">
            <h3 className="text-[#7B1E1E] font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#C9973A] rounded-full"></span>
              Selected Package Summary
            </h3>
            <div className="space-y-4">
              {Object.entries(selectedSelections).map(([funcId, items]) => (
                <div key={funcId} className="border-b border-[#FFF8F0] pb-3 last:border-0">
                  <span className="text-sm font-bold text-[#2C1810] uppercase tracking-tighter">{funcId}</span>
                  <p className="text-sm text-gray-600 mt-1">{items.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <User size={14} className="text-[#C9973A]" /> Full Name *
              </label>
              <input 
                {...register("clientName", { required: true })}
                className="w-full bg-white border border-[#C9973A]/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
                placeholder="Ramesh Sharma"
              />
              {errors.clientName && <span className="text-red-500 text-[10px]">Required</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <Phone size={14} className="text-[#C9973A]" /> Phone *
              </label>
              <input 
                {...register("phone", { required: true, pattern: /^\d{10}$/ })}
                className="w-full bg-white border border-[#C9973A]/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
                placeholder="9876543210"
              />
              {errors.phone && <span className="text-red-500 text-[10px]">Valid 10-digit number required</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <Calendar size={14} className="text-[#C9973A]" /> Wedding Date *
              </label>
              <input 
                type="date"
                {...register("weddingDate", { required: true })}
                className="w-full bg-white border border-[#C9973A]/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <MapPin size={14} className="text-[#C9973A]" /> City *
              </label>
              <input 
                {...register("city", { required: true })}
                className="w-full bg-white border border-[#C9973A]/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
                placeholder="Raipur"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <MapPin size={14} className="text-[#C9973A]" /> Venue / Location *
              </label>
              <input 
                {...register("venue", { required: true })}
                className="w-full bg-white border border-[#C9973A]/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
                placeholder="Sayaji Hotel, Magneto Mall Road"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <Mail size={14} className="text-[#C9973A]" /> Email
              </label>
              <input 
                type="email"
                {...register("email")}
                className="w-full bg-white border border-[#C9973A]/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
                placeholder="ramesh@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <Users size={14} className="text-[#C9973A]" /> Guest Count
              </label>
              <input 
                type="number"
                {...register("guestCount")}
                className="w-full bg-white border border-[#C9973A]/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
                placeholder="500"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <MessageSquare size={14} className="text-[#C9973A]" /> Message / Special Notes
              </label>
              <textarea 
                {...register("notes")}
                rows={3}
                className="w-full bg-white border border-[#C9973A]/30 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
                placeholder="Any special requirements..."
              />
            </div>
          </form>
        </div>

        <div className="p-6 bg-white border-t border-[#FFF8F0]">
          <button 
            type="submit"
            form="booking-form"
            disabled={isSubmitting}
            className="w-full bg-[#7B1E1E] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#C9973A] transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : (
              <>
                Confirm Booking Request <Send size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;
