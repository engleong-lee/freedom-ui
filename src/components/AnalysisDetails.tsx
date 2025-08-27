import React, { useState, useEffect } from 'react';
import { Analysis } from '../types/analysis';
import { Clock, Tag, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';

interface AnalysisDetailsProps {
  analysis: Analysis;
  className?: string;
}

export function AnalysisDetails({ analysis, className }: AnalysisDetailsProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Check localStorage for saved preference, default to collapsed on mobile
    const saved = localStorage.getItem('analysisDetailsCollapsed');
    return saved !== null ? saved === 'true' : true;
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Save preference to localStorage when on mobile
    if (isMobile) {
      localStorage.setItem('analysisDetailsCollapsed', isCollapsed.toString());
    }
  }, [isCollapsed, isMobile]);

  // Mobile view with collapsible functionality
  if (isMobile) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-2 pb-0 flex-shrink-0 ${className || ''}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between text-left active:bg-gray-50 transition-colors rounded-lg p-1"
          aria-expanded={!isCollapsed}
          aria-label="Toggle analysis details"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-700">
              {analysis.symbol}
            </span>
            <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
              analysis.trade_type === 'LONG' 
                ? 'bg-green-100 text-green-700' 
                : analysis.trade_type === 'SHORT'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {analysis.trade_type}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(analysis.datetime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">
              {isCollapsed ? 'Show' : 'Hide'}
            </span>
            {isCollapsed ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronUp className="w-3 h-3 text-gray-500" />
            )}
          </div>
        </button>
        
        <div 
          className={`grid grid-cols-1 gap-2 mt-2 transition-all duration-300 overflow-hidden ${
            isCollapsed 
              ? 'max-h-0 opacity-0' 
              : 'max-h-96 opacity-100'
          }`}
        >
          <div className="flex items-center">
            <div className="mr-2 bg-blue-100 p-1 rounded-full flex-shrink-0">
              <Tag size={12} className="text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Analysis ID</div>
              <div className="font-medium text-xs truncate">{analysis.id}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-2 bg-green-100 p-1 rounded-full flex-shrink-0">
              <Clock size={12} className="text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Date Time</div>
              <div className="font-medium text-xs truncate">
                {new Date(analysis.datetime).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-2 bg-purple-100 p-1 rounded-full flex-shrink-0">
              <Tag size={12} className="text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Ticker</div>
              <div className="font-medium text-xs truncate">
                {analysis.symbol}:{analysis.exchange}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-2 bg-amber-100 p-1 rounded-full flex-shrink-0">
              <Briefcase size={12} className="text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Trade Type</div>
              <div className="font-medium text-xs">{analysis.trade_type}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop and tablet view (unchanged)
  return (
    <div className={`bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 flex-shrink-0 ${className || ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 analysis-details-grid">
        <div className="flex items-center">
          <div className="mr-2 sm:mr-3 bg-blue-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
            <Tag size={14} className="text-blue-600 sm:w-4 sm:h-4" />
          </div>
          <div className="detail-item-mobile">
            <div className="text-xs text-gray-500">Analysis ID</div>
            <div className="font-medium text-sm sm:text-base truncate">{analysis.id}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-2 sm:mr-3 bg-green-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
            <Clock size={14} className="text-green-600 sm:w-4 sm:h-4" />
          </div>
          <div className="detail-item-mobile">
            <div className="text-xs text-gray-500">Date Time</div>
            <div className="font-medium text-sm sm:text-base truncate">
              {new Date(analysis.datetime).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-2 sm:mr-3 bg-purple-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
            <Tag size={14} className="text-purple-600 sm:w-4 sm:h-4" />
          </div>
          <div className="detail-item-mobile">
            <div className="text-xs text-gray-500">Ticker</div>
            <div className="font-medium text-sm sm:text-base truncate">
              {analysis.symbol}:{analysis.exchange}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-2 sm:mr-3 bg-amber-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
            <Briefcase size={14} className="text-amber-600 sm:w-4 sm:h-4" />
          </div>
          <div className="detail-item-mobile">
            <div className="text-xs text-gray-500">Trade Type</div>
            <div className="font-medium text-sm sm:text-base">{analysis.trade_type}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
