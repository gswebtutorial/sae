"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Send, MapPin, Calendar, User, Phone, Mail, Users, MessageSquare } from 'lucide-react';

interface ClientFormProps {
  selectedSelections: Record<string, string[]>;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const ClientForm = ({ selectedSelections, onClose, onSuccess, initialData }: ClientFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData ? {
      clientName: initialData.client_name,
      phone: initialData.phone,
      weddingDate: initialData.wedding_date,
      city: initialData.city,
      venue: initialData.venue,
      email: initialData.email,
      guestCount: initialData.guest_count,
      notes: initialData.notes,
    } : {}
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: initialData?.id, // Pass ID if updating
          selectedFunctions: selectedSelections
        }),
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const resData = await response.json();
        alert(resData.error || "Failed to submit booking.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-[#FFF8F0] w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
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
          <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <User size={14} className="text-[#C9973A]" /> Full Name *
              </label>
              <input 
                {...register("clientName", { required: true })}
                className="w-full bg-white border border-[#C9973A]/30 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
                placeholder="e.g. Ramesh Sharma"
              />
              {errors.clientName && <span className="text-red-500 text-[10px]">Required</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <Phone size={14} className="text-[#C9973A]" /> Phone Number *
              </label>
              <input 
                {...register("phone", { 
                  required: true, 
                  pattern: { value: /^[0-9+]{10,15}$/, message: "Valid phone required" } 
                })}
                className="w-full bg-white border border-[#C9973A]/30 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
                placeholder="e.g. 9876543210"
              />
              {errors.phone && <span className="text-red-500 text-[10px]">Required (10+ digits)</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B1E1E] uppercase flex items-center gap-1">
                <MapPin size={14} className="text-[#C9973A]" /> City *
              </label>
              <input 
                {...register("city", { required: true })}
                className="w-full bg-white border border-[#C9973A]/30 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
                placeholder="e.g. Your City"
              />
              {errors.city && <span className="text-red-500 text-[10px]">Required</span>}
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
