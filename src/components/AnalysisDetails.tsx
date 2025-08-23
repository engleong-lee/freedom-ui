import React from 'react';
import { Analysis } from '../types/analysis';
import { Clock, Tag, Briefcase } from 'lucide-react';

interface AnalysisDetailsProps {
  analysis: Analysis;
}

export function AnalysisDetails({ analysis }: AnalysisDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center">
          <div className="mr-3 bg-blue-100 p-2 rounded-full">
            <Tag size={16} className="text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Analysis ID</div>
            <div className="font-medium">{analysis.id}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-3 bg-green-100 p-2 rounded-full">
            <Clock size={16} className="text-green-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Date Time</div>
            <div className="font-medium">
              {new Date(analysis.datetime).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-3 bg-purple-100 p-2 rounded-full">
            <Tag size={16} className="text-purple-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Ticker</div>
            <div className="font-medium">
              {analysis.symbol}:{analysis.exchange}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-3 bg-amber-100 p-2 rounded-full">
            <Briefcase size={16} className="text-amber-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Trade Type</div>
            <div className="font-medium">{analysis.trade_type}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
