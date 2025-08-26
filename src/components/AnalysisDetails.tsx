import React from 'react';
import { Analysis } from '../types/analysis';
import { Clock, Tag, Briefcase } from 'lucide-react';

interface AnalysisDetailsProps {
  analysis: Analysis;
  className?: string;
}

export function AnalysisDetails({ analysis, className }: AnalysisDetailsProps) {
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
