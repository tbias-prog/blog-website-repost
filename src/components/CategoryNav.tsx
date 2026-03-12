import React from 'react';
import { CATEGORIES } from '../constants';
import { cn } from '../lib/utils';
import { Globe } from 'lucide-react';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const categoriesWithAll = [{ label: 'All', icon: Globe }, ...CATEGORIES];
  
  return (
    <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar px-4 -mx-4">
      {categoriesWithAll.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.label;
        
        return (
          <button
            key={cat.label}
            onClick={() => onCategoryChange(cat.label)}
            className="flex flex-col items-center gap-2 min-w-fit group"
          >
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                isActive 
                  ? "bg-accent text-white shadow-lg shadow-accent/20 scale-110" 
                  : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
              )}
            >
              <Icon size={24} />
            </div>
            <span className={cn(
              "text-xs font-medium transition-colors",
              isActive ? "text-slate-900" : "text-slate-500"
            )}>
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
