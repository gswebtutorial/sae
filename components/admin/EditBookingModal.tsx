'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, User, Phone, MapPin } from 'lucide-react';

interface EditBookingModalProps {
  booking: any;
  onClose: () => void;
  onSave: (updatedBooking: any) => void;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({ booking, onClose, onSave }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      clientName: booking.client_name,
      phone: booking.phone,
      city: booking.city,
      status: booking.status,
    }
  });

  const onSubmit = async (data: any) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...data,
          selectedFunctions: booking.selected_functions, // Keep functions as they are for now
          weddingDate: booking.wedding_date || '2024-01-01',
          venue: booking.venue || 'Not Specified',
        }),
      });

      if (res.ok) {
        const result = await res.json();
        onSave(result.booking);
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="bg-[#7B1E1E] p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold font-serif">Edit Booking</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          <div>
            <label className="text-[10px] font-bold text-[#7B1E1E] uppercase tracking-widest block mb-1">Client Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...register('clientName')} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#7B1E1E] uppercase tracking-widest block mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...register('phone')} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#7B1E1E] uppercase tracking-widest block mb-1">City</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...register('city')} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#7B1E1E] uppercase tracking-widest block mb-1">Status</label>
            <select {...register('status')} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20">
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-maroon w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold"
          >
            {isSubmitting ? 'Saving...' : <><Save size={18} /> Update Details</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;
