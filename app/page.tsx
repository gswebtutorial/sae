"use client";

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import FunctionCard from '@/components/FunctionCard';
import ChecklistModal from '@/components/ChecklistModal';
import { weddingFunctions } from '@/data/weddingFunctions';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import ClientForm from '@/components/ClientForm';
import SubmitSuccess from '@/components/SubmitSuccess';
import ClientLogin from '@/components/ClientLogin';
import { UserCheck, RefreshCw } from 'lucide-react';

type SelectedSelections = Record<string, string[]>;

export default function Home() {
  const [selectedSelections, setSelectedSelections] = useState<SelectedSelections>({});
  const [activeFunctionId, setActiveFunctionId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loggedInClient, setLoggedInClient] = useState<any>(null);

  const activeFunction = useMemo(() => 
    weddingFunctions.find(f => f.id === activeFunctionId), 
    [activeFunctionId]
  );

  const totalSelectedCount = useMemo(() => 
    Object.values(selectedSelections).reduce((acc, items) => acc + items.length, 0),
    [selectedSelections]
  );

  const handleLoginSuccess = (booking: any) => {
    setLoggedInClient(booking);
    // Pre-populate selections from memory
    if (booking.selected_functions) {
      setSelectedSelections(booking.selected_functions);
    }
  };

  const handleLogout = () => {
    setLoggedInClient(null);
    setSelectedSelections({});
  };

  const toggleItem = (functionId: string, item: string) => {
    setSelectedSelections(prev => {
      const currentItems = prev[functionId] || [];
      const newItems = currentItems.includes(item)
        ? currentItems.filter(i => i !== item)
        : [...currentItems, item];
      
      const next = { ...prev };
      if (newItems.length === 0) {
        delete next[functionId];
      } else {
        next[functionId] = newItems;
      }
      return next;
    });
  };

  if (isSuccess) {
    return <SubmitSuccess onReset={() => {
      setIsSuccess(false);
      setSelectedSelections({});
      setLoggedInClient(null);
    }} />;
  }

  return (
    <main className="min-h-screen pb-32">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-[#7B1E1E] text-white py-6 px-4 shadow-inner overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/hero-bg.png")' }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white tracking-tight">
            Plan Your Dream Wedding
          </h1>
          <p className="text-lg md:text-xl text-white font-light max-w-2xl mx-auto font-serif italic mb-4 opacity-90">
            Trusted wedding planners
          </p>

          {!loggedInClient ? (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="group relative inline-flex items-center gap-2 bg-transparent hover:bg-white text-white hover:text-[#7B1E1E] px-6 py-2.5 rounded-full font-semibold border-2 border-white transition-all duration-300 shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 -z-10" />
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" /> 
              <span>Sync Previous Booking</span>
            </button>
          ) : (
            <div className="inline-flex flex-col items-center gap-2">
              <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
                <UserCheck className="text-white" />
                <span className="text-lg font-medium text-white">Welcome back, {loggedInClient.client_name}!</span>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-white/70 hover:text-white underline ml-4 transition-colors"
                >
                  Logout
                </button>
              </div>
              <p className="text-white text-sm animate-pulse">You are now in Update Mode</p>
            </div>
          )}
        </div>
      </section>

      {/* Functions Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {weddingFunctions.map((wf) => (
            <FunctionCard 
              key={wf.id}
              weddingFunction={wf}
              selectedCount={selectedSelections[wf.id]?.length || 0}
              onSelect={setActiveFunctionId}
            />
          ))}
        </div>
      </section>

      {/* Checklist Modal */}
      {activeFunction && (
        <ChecklistModal 
          weddingFunction={activeFunction}
          selectedItems={selectedSelections[activeFunction.id] || []}
          onToggleItem={(item) => toggleItem(activeFunction.id, item)}
          onClose={() => setActiveFunctionId(null)}
        />
      )}

      {/* Sticky Bottom Bar */}
      {totalSelectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-40">
          <div className="bg-[#2C1810] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-[#C9973A]/30">
            <div className="flex items-center gap-3">
              <div className="bg-[#7B1E1E] p-2 rounded-lg">
                <ShoppingBag size={20} className="text-[#C9973A]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">
                  {loggedInClient ? 'Updating Package' : 'Your Package'}
                </p>
                <p className="font-bold text-[#FFF8F0]">{totalSelectedCount} Services Selected</p>
              </div>
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-[#C9973A] hover:bg-[#B38531] text-[#2C1810] px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              {loggedInClient ? 'Sync Changes' : 'Proceed'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Client Form Modal */}
      {isFormOpen && (
        <ClientForm 
          selectedSelections={selectedSelections}
          onClose={() => setIsFormOpen(false)}
          initialData={loggedInClient}
          onSuccess={() => {
            setIsFormOpen(false);
            setIsSuccess(true);
          }}
        />
      )}

      {/* Client Login Modal */}
      <ClientLogin 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </main>
  );
}
