"use client";

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import FunctionCard from '@/components/FunctionCard';
import ChecklistModal from '@/components/ChecklistModal';
import { weddingFunctions } from '@/data/weddingFunctions';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import ClientForm from '@/components/ClientForm';
import SubmitSuccess from '@/components/SubmitSuccess';

type SelectedSelections = Record<string, string[]>;

export default function Home() {
  const [selectedSelections, setSelectedSelections] = useState<SelectedSelections>({});
  const [activeFunctionId, setActiveFunctionId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const activeFunction = useMemo(() => 
    weddingFunctions.find(f => f.id === activeFunctionId), 
    [activeFunctionId]
  );

  const totalSelectedCount = useMemo(() => 
    Object.values(selectedSelections).reduce((acc, items) => acc + items.length, 0),
    [selectedSelections]
  );

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
    }} />;
  }

  return (
    <main className="min-h-screen pb-32">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-[#7B1E1E] text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Subtle floral pattern simulation */}
          <div className="absolute top-0 left-0 w-64 h-64 border-4 border-[#C9973A] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-[#C9973A] rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#FFF8F0]">
            Plan Your Dream Wedding
          </h1>
          <p className="text-lg md:text-xl text-[#C9973A] font-light max-w-2xl mx-auto">
            Select the services you need for your special celebrations. We&apos;ll handle the rest with perfection.
          </p>
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
                <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">Your Package</p>
                <p className="font-bold text-[#FFF8F0]">{totalSelectedCount} Services Selected</p>
              </div>
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-[#C9973A] hover:bg-[#B38531] text-[#2C1810] px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              Proceed <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Client Form Modal */}
      {isFormOpen && (
        <ClientForm 
          selectedSelections={selectedSelections}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            setIsSuccess(true);
          }}
        />
      )}
    </main>
  );
}
