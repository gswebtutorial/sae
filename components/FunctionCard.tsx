"use client";

import React from 'react';
import { WeddingFunction } from '@/data/weddingFunctions';
import { CheckCircle2 } from 'lucide-react';

interface FunctionCardProps {
  weddingFunction: WeddingFunction;
  selectedCount: number;
  onSelect: (id: string) => void;
}

const FunctionCard = ({ weddingFunction, selectedCount, onSelect }: FunctionCardProps) => {
  return (
    <div className="card-wedding overflow-hidden flex flex-col h-full group">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="text-4xl" role="img" aria-label={weddingFunction.name}>
            {weddingFunction.emoji}
          </span>
          {selectedCount > 0 && (
            <div className="flex items-center gap-1 bg-[#7B1E1E] text-white text-xs px-2 py-1 rounded-full">
              <CheckCircle2 size={12} className="text-[#C9973A]" />
              {selectedCount} selected
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-[#7B1E1E] group-hover:text-[#C9973A] transition-colors">
          {weddingFunction.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {weddingFunction.description}
        </p>
      </div>
      
      <div className="p-4 border-t border-[#FFF8F0]">
        <button 
          onClick={() => onSelect(weddingFunction.id)}
          className="w-full btn-maroon text-sm"
        >
          {selectedCount > 0 ? 'Edit Selections' : 'Select Services'}
        </button>
      </div>
    </div>
  );
};

export default FunctionCard;
