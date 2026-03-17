"use client";

import React from 'react';
import { X, Check } from 'lucide-react';
import { WeddingFunction } from '@/data/weddingFunctions';

interface ChecklistModalProps {
  weddingFunction: WeddingFunction;
  selectedItems: string[];
  onToggleItem: (item: string) => void;
  onClose: () => void;
}

const ChecklistModal = ({ weddingFunction, selectedItems, onToggleItem, onClose }: ChecklistModalProps) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-[#7B1E1E] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{weddingFunction.emoji}</span>
            <div>
              <h2 className="text-xl font-bold leading-tight">{weddingFunction.name}</h2>
              <p className="text-xs text-[#C9973A] font-medium uppercase tracking-wider">Select Services</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-[#FFF8F0]/30">
          <div className="grid grid-cols-1 gap-3">
            {weddingFunction.items.map((item) => {
              const isSelected = selectedItems.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => onToggleItem(item)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-[#7B1E1E] bg-[#7B1E1E]/5 shadow-sm' 
                      : 'border-white bg-white hover:border-[#C9973A]/30'
                  }`}
                >
                  <span className={`font-medium ${isSelected ? 'text-[#7B1E1E]' : 'text-[#2C1810]'}`}>
                    {item}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'bg-[#7B1E1E] border-[#7B1E1E]' 
                      : 'border-[#C9973A]/30'
                  }`}>
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="p-6 border-t border-[#FFF8F0] flex gap-3">
          <button 
            onClick={onClose}
            className="flex-grow btn-maroon py-3"
          >
            Done ({selectedItems.length} selected)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistModal;
