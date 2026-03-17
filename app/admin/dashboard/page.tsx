"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flower, LogOut, CheckCircle2, Clock, Search, Filter, ChevronDown, User, Phone, MapPin, Calendar, ExternalLink } from 'lucide-react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchBookings(token);
  }, []);

  const fetchBookings = async (token: string) => {
    try {
      const res = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin');
          return;
        }
        throw new Error(data.error || 'Failed to fetch bookings');
      }
      
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.client_name.toLowerCase().includes(search.toLowerCase()) || 
                         b.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    new: bookings.filter(b => b.status === 'new').length,
    reviewed: bookings.filter(b => b.status === 'reviewed').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
  };

  if (error) return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-200 max-w-md text-center">
        <div className="text-red-500 mb-4 text-4xl font-bold">⚠️</div>
        <h2 className="text-xl font-bold text-[#7B1E1E] mb-2 font-serif">Setup Required</h2>
        <p className="text-gray-600 mb-6 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-maroon w-full"
        >
          Check Again
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Flower className="animate-spin text-[#7B1E1E]" size={40} />
        <p className="text-[#7B1E1E] font-medium font-serif italic">Loading Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <header className="bg-white border-b border-[#C9973A]/20 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <Flower className="text-[#7B1E1E] w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold font-serif text-[#7B1E1E] leading-none mb-1 uppercase tracking-tight">Control Panel</h1>
                <p className="text-[#C9973A] text-[10px] font-bold uppercase tracking-[0.2em]">Shree Annapurna Events</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-[#7B1E1E] font-medium transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total, color: 'text-[#2C1810]', icon: <Calendar className="text-gray-400" /> },
            { label: 'New', value: stats.new, color: 'text-blue-600', icon: <Clock className="text-blue-400" /> },
            { label: 'Reviewed', value: stats.reviewed, color: 'text-amber-600', icon: <Search className="text-amber-400" /> },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600', icon: <CheckCircle2 className="text-green-400" /> },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#C9973A]/10 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                {stat.icon}
              </div>
              <p className={`text-3xl font-bold font-serif ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className="bg-white p-4 rounded-2xl border border-[#C9973A]/10 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by client name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0]/50 border border-[#C9973A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-[#FFF8F0]/50 border border-[#C9973A]/20 pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B1E1E]/20 font-medium text-sm"
              >
                <option value="all">All Status</option>
                <option value="new">New Requests</option>
                <option value="reviewed">Reviewed</option>
                <option value="confirmed">Confirmed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Bookings List/Table */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-[#C9973A]/30 text-center">
              <p className="text-gray-400 font-serif italic">No bookings found matching your filters.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div 
                key={booking.id}
                className="bg-white rounded-2xl border border-[#C9973A]/10 shadow-sm overflow-hidden transition-all duration-300"
              >
                <div 
                  className={`p-6 cursor-pointer hover:bg-[#FFF8F0]/30 flex flex-wrap gap-4 items-center justify-between ${expandedId === booking.id ? 'bg-[#FFF8F0]/50' : ''}`}
                  onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                >
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="bg-[#7B1E1E]/5 p-2 rounded-xl">
                      <User size={24} className="text-[#7B1E1E]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#7B1E1E] uppercase tracking-tight">{booking.client_name}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} /> {booking.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-sm">
                    <div className="hidden md:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Calendar size={10} /> Wedding Date</p>
                      <p className="font-semibold">{new Date(booking.wedding_date).toLocaleDateString()}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><MapPin size={10} /> Location</p>
                      <p className="font-semibold">{booking.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border ${
                      booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                      booking.status === 'reviewed' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-600' :
                        booking.status === 'reviewed' ? 'bg-amber-600' :
                        'bg-blue-600'
                      }`} />
                      {booking.status}
                    </div>
                    <ChevronDown className={`text-gray-400 transition-transform duration-300 ${expandedId === booking.id ? 'rotate-180' : ''}`} size={20} />
                  </div>
                </div>

                {expandedId === booking.id && (
                  <div className="p-8 border-t border-[#C9973A]/10 bg-white grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-top duration-300">
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-[#7B1E1E] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#C9973A]" /> Service Checklist
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries(booking.selected_functions as Record<string, string[]>).map(([func, items]) => (
                            <div key={func} className="bg-[#FFF8F0]/30 p-4 rounded-xl border border-[#C9973A]/10">
                              <p className="text-xs font-bold text-[#7B1E1E] uppercase mb-2 border-b border-[#C9973A]/20 pb-1">{func}</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {items.map((it, i) => <li key={i} className="flex items-center gap-2 text-[13px]">• {it}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {booking.notes && (
                        <div>
                          <h4 className="text-xs font-bold text-[#7B1E1E] uppercase tracking-widest mb-2">Special Notes</h4>
                          <div className="bg-gray-50 p-4 rounded-xl text-sm italic text-gray-600">
                            &ldquo;{booking.notes}&rdquo;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6 border-l border-[#FFF8F0] pl-0 lg:pl-8">
                      <div>
                        <h4 className="text-xs font-bold text-[#7B1E1E] uppercase tracking-widest mb-3">Booking Details</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-[#FFF8F0] pb-2">
                            <span className="text-gray-400">Guests</span>
                            <span className="font-semibold">{booking.guest_count || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#FFF8F0] pb-2">
                            <span className="text-gray-400">Venue</span>
                            <span className="font-semibold text-right">{booking.venue}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#FFF8F0] pb-2">
                            <span className="text-gray-400">Email</span>
                            <span className="font-semibold">{booking.email || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#FFF8F0] pb-2 text-[10px]">
                            <span className="text-gray-400">Submitted</span>
                            <span className="font-medium">{new Date(booking.submitted_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#7B1E1E] uppercase tracking-widest mb-3">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {['new', 'reviewed', 'confirmed'].map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(booking.id, s)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight transition-all border ${
                                booking.status === s 
                                ? 'bg-[#7B1E1E] text-white border-[#7B1E1E] shadow-md' 
                                : 'bg-white text-gray-400 border-gray-100 hover:border-[#C9973A]/50'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <a 
                        href={`https://wa.me/${booking.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                      >
                        Contact via WhatsApp <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
