import React, { useState } from 'react';
interface ChartViewProps {
  symbol: string;
}
export function ChartView({
  symbol
}: ChartViewProps) {
  const [timeframe, setTimeframe] = useState<'3m' | '1y'>('3m');
  // In a real application, you would use a chart library like TradingView, Chart.js, or Highcharts
  // For this example, we're using placeholder images
  const chartImages = {
    '3m': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1470&auto=format&fit=crop',
    '1y': 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=1470&auto=format&fit=crop'
  };
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button className={`py-4 px-6 border-b-2 font-medium text-sm ${timeframe === '3m' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setTimeframe('3m')}>
            3 Month Chart
          </button>
          <button className={`py-4 px-6 border-b-2 font-medium text-sm ${timeframe === '1y' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setTimeframe('1y')}>
            1 Year Chart
          </button>
        </nav>
      </div>
      <div className="p-4">
        <div className="aspect-w-16 aspect-h-9">
          <img src={chartImages[timeframe]} alt={`${symbol} ${timeframe} chart`} className="w-full h-[500px] object-cover rounded" />
        </div>
      </div>
    </div>;
}