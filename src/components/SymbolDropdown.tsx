import React from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { Analysis } from '../types/analysis';

interface SymbolDropdownProps {
  analyses: Analysis[];
  selectedSymbol: string | null;
  onSymbolSelect: (symbol: string) => void;
  inline?: boolean;
}

export function SymbolDropdown({
  analyses,
  selectedSymbol,
  onSymbolSelect,
  inline = false
}: SymbolDropdownProps) {
  
  if (inline) {
    return (
      <div className="flex items-center w-full">
        <label className="hidden sm:inline text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
          Select Symbol:
        </label>
        <div className="relative w-full">
          <select 
            value={selectedSymbol || ''} 
            onChange={e => onSymbolSelect(e.target.value)} 
            className="w-full pl-2 pr-7 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none truncate" 
            disabled={analyses.length === 0}
          >
            <option value="" disabled>
              {analyses.length === 0 ? 'No data' : 'Symbol'}
            </option>
            {analyses.map(analysis => (
              <option key={analysis.symbol} value={analysis.symbol}>
                {analysis.symbol}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none">
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Symbol
      </label>
      <div className="relative">
        <select 
          value={selectedSymbol || ''} 
          onChange={e => onSymbolSelect(e.target.value)} 
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none" 
          disabled={analyses.length === 0}
        >
          <option value="" disabled>
            {analyses.length === 0 ? 'Select a date first' : 'Select a symbol'}
          </option>
          {analyses.map(analysis => (
            <option key={analysis.symbol} value={analysis.symbol}>
              {analysis.symbol}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
