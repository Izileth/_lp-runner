import React from 'react';
import type { Route } from '../../types';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  route?: Route;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (route: Route) => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-[11px] font-semibold tracking-widest uppercase text-gray-sec ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center">
            {isLast || !item.route ? (
              <span className="text-black-main border-b border-black-main/20 pb-0.5" aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(item.route as Route)}
                className="hover:text-black-main hover:border-black-main/20 border-b border-transparent pb-0.5 transition-colors focus:outline-none cursor-pointer"
              >
                {item.label}
              </button>
            )}
            
            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-border-main" />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
