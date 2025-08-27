import React, { useEffect, useState } from 'react';
import { DateSelector } from '../components/DateSelector';
import { SymbolDropdown } from '../components/SymbolDropdown';
import { AnalysisDetails } from '../components/AnalysisDetails';
import { AnalysisContent } from '../components/AnalysisContent';
import { ChartView } from '../components/ChartView';
import { Analysis } from '../types/analysis';
import { fetchAnalysesByDate, formatDateForAPI, getImageUrl } from '../utils/api';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import '../styles/analysis.css';

interface AnalysisPageProps {
  mockDataMode?: boolean;
}

// Mock data generator
const generateMockData = (date: Date): Analysis[] => {
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const baseDate = formatDate(date);
  
  return [
    {
      id: 'mock-1',
      recordId: 1001,
      datetime: `${baseDate}T09:30:00`,
      symbol: 'AAPL',
      exchange: 'NASDAQ',
      trade_type: 'NO_ACTION',
      analysis_content: `**Technical Analysis Summary for AAPL:**

The stock has shown strong bullish momentum over the past week, breaking above the key resistance level at $195. The RSI is currently at 65, indicating healthy momentum without being overbought.

**Key Levels:**
- Support: $192.50
- Resistance: $198.00

**Volume Analysis:**
Trading volume has increased by 25% compared to the 20-day average, confirming the upward move.

**Moving Averages:**
- 50-day MA: $188.75 (bullish)
- 200-day MA: $175.50 (bullish)

The golden cross pattern formed last month continues to provide strong support.`,
      analysis_prompt: 'Analyze AAPL technical indicators and provide trading recommendation',
      decision: {
        symbol: 'AAPL',
        analysis_date: baseDate,
        support: 192.50,
        resistance: 198.00,
        primary_action: 'BUY',
        new_trade: {
          entry: 194.25,
          stop_loss: 192.00,
          target: 198.50
        }
      },
      chart_3month: 'https://r2.chart-img.com/20250910/tradingview/advanced-chart/3c544e15-3663-4590-ac3d-38b646409098.png',
      chart_1year: 'https://r2.chart-img.com/20250910/tradingview/advanced-chart/3c544e15-3663-4590-ac3d-38b646409098.png',
      remarks: 'Strong technical setup with confirmed breakout'
    },
    {
      id: 'mock-2',
      recordId: 1002,
      datetime: `${baseDate}T10:15:00`,
      symbol: 'GOOGL',
      exchange: 'NASDAQ',
      trade_type: 'NO_ACTION',
      analysis_content: `**Technical Analysis Summary for GOOGL:**

Google has been consolidating in a tight range between $140-$145 for the past two weeks. This consolidation appears to be a bull flag pattern.

**Key Observations:**
- MACD showing bullish divergence
- Volume declining during consolidation (typical for flag patterns)
- ADX at 18 suggests trend strength building

**Price Targets:**
- Initial target: $148
- Secondary target: $152

**Risk Management:**
Stop loss recommended below $139 to maintain favorable risk/reward ratio.

**Additional Technical Analysis:**

The stock has been forming a clear uptrend channel since the beginning of the month. The 50-day moving average is currently at $141.50 and acting as strong support. The 200-day moving average sits at $135, providing a solid floor for any potential pullbacks.

**Fibonacci Retracement Levels:**
- 23.6%: $143.20
- 38.2%: $141.80
- 50.0%: $140.50
- 61.8%: $139.20

**Market Sentiment Analysis:**

Recent analyst upgrades from major investment banks have been positive, with average price targets ranging from $150 to $155. Institutional buying has increased over the past week, with notable accumulation phases during market dips.

**Options Flow Analysis:**

Unusual options activity detected with significant call buying at the $150 strike for next month's expiration. Put/Call ratio is currently at 0.45, indicating bullish sentiment among options traders.

**Relative Strength Analysis:**

GOOGL is showing relative strength compared to the broader tech sector (XLK). The stock has outperformed the NASDAQ by 3.2% over the past month and continues to show leadership characteristics.

**Volume Profile Analysis:**

The volume point of control (VPOC) sits at $142.50, which aligns with our current consolidation zone. Above-average volume nodes are visible at $145 and $148, suggesting these as key resistance levels to watch.`,
      analysis_prompt: 'Evaluate GOOGL consolidation pattern and momentum indicators',
      decision: {
        symbol: 'GOOGL',
        analysis_date: baseDate,
        support: 140.00,
        resistance: 145.00,
        primary_action: 'HOLD',
        new_trade: null
      },      
      chart_3month: 'https://r2.chart-img.com/20250910/tradingview/advanced-chart/3c544e15-3663-4590-ac3d-38b646409098.png',
      chart_1year: 'https://r2.chart-img.com/20250910/tradingview/advanced-chart/3c544e15-3663-4590-ac3d-38b646409098.png',
      remarks: 'Waiting for breakout confirmation'
    },
    {
      id: 'mock-3',
      recordId: 1003,
      datetime: `${baseDate}T11:00:00`,
      symbol: 'MSFT',
      exchange: 'NASDAQ',
      trade_type: 'TREND',
      analysis_content: `**Technical Analysis Summary for MSFT:**

Microsoft showing signs of exhaustion after reaching all-time highs. Several bearish signals emerging:

**Bearish Indicators:**
- Bearish divergence on RSI (price making higher highs, RSI making lower highs)
- Volume decreasing on recent upward moves
- Failed to break above $425 resistance after three attempts

**Support Levels to Watch:**
- First support: $415
- Major support: $408

**Trading Strategy:**
Consider short position or protective puts if price breaks below $415 with volume.`,
      analysis_prompt: 'Analyze MSFT for potential reversal signals',
      decision: {
        symbol: 'MSFT',
        analysis_date: baseDate,        support: 415.00,
        resistance: 425.00,
        primary_action: 'SELL',
        new_trade: {
          entry: 418.50,
          stop_loss: 425.50,
          target: 408.00
        }
      },
      chart_3month: 'https://r2.chart-img.com/20250910/tradingview/advanced-chart/3c544e15-3663-4590-ac3d-38b646409098.png',
      chart_1year: 'https://r2.chart-img.com/20250910/tradingview/advanced-chart/3c544e15-3663-4590-ac3d-38b646409098.png',
      remarks: 'Potential short-term reversal setup'
    },
    {
      id: 'mock-4',
      recordId: 1004,
      datetime: `${baseDate}T13:30:00`,
      symbol: 'TSLA',
      exchange: 'NASDAQ',
      trade_type: 'NO_ACTION',
      analysis_content: `**Technical Analysis Summary for TSLA:**

Tesla exhibiting volatile but bullish behavior typical of the stock. Key points:

**Bullish Signals:**
- Bounce from 50-day moving average at $235
- Accumulation/Distribution line trending up
- Options flow showing heavy call buying

**Volatility Metrics:**
- ATR at 12.5 (high volatility environment)- Bollinger Bands expanding

**Trading Approach:**
Use wider stops due to volatility. Consider scaling into positions.`,
      analysis_prompt: 'Assess TSLA volatility patterns and trend direction',
      decision: {
        symbol: 'TSLA',
        analysis_date: baseDate,
        support: 235.00,
        resistance: 255.00,
        primary_action: 'BUY',
        new_trade: {
          entry: 242.00,
          stop_loss: 233.00,
          target: 258.00
        }
      },
      chart_3month: 'https://r2.chart-img.com/20250910/tradingview/advanced-chart/3c544e15-3663-4590-ac3d-38b646409098.png',
      chart_1year: 'https://r2.chart-img.com/20250910/tradingview/advanced-chart/3c544e15-3663-4590-ac3d-38b646409098.png',
      remarks: 'High volatility play - size positions accordingly'
    },
    {
      id: 'mock-5',
      recordId: 1005,
      datetime: `${baseDate}T14:45:00`,
      symbol: 'META',
      exchange: 'NASDAQ',
      trade_type: 'SWING',
      analysis_content: `**Technical Analysis Summary for META:**

Meta Platforms showing impressive strength with consistent higher lows pattern.
**Trend Analysis:**
- Clear uptrend channel intact since October
- Testing upper channel boundary at $520
- Fibonacci retracement levels holding as support

**Momentum Indicators:**
- RSI at 72 (approaching overbought but can remain elevated in strong trends)
- Money Flow Index positive

**Risk/Reward:**
Current setup offers 2:1 risk/reward ratio for continuation play.`,
      analysis_prompt: 'Review META trend strength and continuation probability',
      decision: {
        symbol: 'META',
        analysis_date: baseDate,
        support: 505.00,
        resistance: 525.00,
        primary_action: 'BUY',
        new_trade: {
          entry: 515.00,
          stop_loss: 504.00,
          target: 535.00
        }
      },
      chart_3month: 'https://r2.chart-img.com/20250910/tradingview/advanced-chart/3c544e15-3663-4590-ac3d-38b646409098.png',
      chart_1year: 'https://r2.chart-img.com/20250910/tradingview/advanced-chart/3c544e15-3663-4590-ac3d-38b646409098.png',
      remarks: 'Strong trend continuation candidate'
    }
  ];
};
export function AnalysisPage({ mockDataMode = false }: AnalysisPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<'3month' | '1year'>('3month');
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setSelectedSymbol(null);
    setCurrentAnalysis(null);
    setError(null);
    
    setLoading(true);
    
    try {
      // Use mock data if mockDataMode is enabled
      if (mockDataMode) {
        // Simulate network delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockAnalyses = generateMockData(date);
        setAnalyses(mockAnalyses);
      } else {
        const formattedDate = formatDateForAPI(date);
        const fetchedAnalyses = await fetchAnalysesByDate(formattedDate);
        setAnalyses(fetchedAnalyses);
      }
    } catch (err) {      console.error('Error fetching analyses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analyses');
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    const analysis = analyses.find(a => a.symbol === symbol);
    if (analysis) {
      setCurrentAnalysis(analysis);
    }
  };

  // Update remarks in the local state after successful save
  const handleRemarksUpdate = (recordId: number, newRemarks: string) => {
    // Update the analyses array
    setAnalyses(prevAnalyses => 
      prevAnalyses.map(a => 
        a.recordId === recordId 
          ? { ...a, remarks: newRemarks }
          : a
      )
    );
    
    // Update current analysis if it's the one being updated
    if (currentAnalysis && currentAnalysis.recordId === recordId) {
      setCurrentAnalysis({
        ...currentAnalysis,        remarks: newRemarks
      });
    }
  };

  // Initialize with today's date
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      handleDateSelect(today);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Mock Data Mode Indicator */}
      {mockDataMode && (
        <div className="mb-3 sm:mb-4 bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-3 flex items-center gap-2 flex-shrink-0">
          <svg className="h-5 w-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs sm:text-sm text-amber-800 font-medium">
            Mock Data Mode Active - Displaying sample data for demonstration purposes
          </span>
        </div>
      )}
      
      {/* Header with mobile-optimized collapsible controls */}
      <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 bg-white shadow-sm border-b analysis-main-content flex-shrink-0">
        {/* Title and toggle button for mobile */}
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <h2 className="text-lg sm:text-2xl font-bold">Analysis & Decision</h2>
          <button 
            onClick={() => setFiltersCollapsed(!filtersCollapsed)}
            className="sm:hidden p-1.5 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1 text-sm text-gray-600"
            aria-label={filtersCollapsed ? "Show filters" : "Hide filters"}
          >
            <Filter size={16} />
            {filtersCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
        
        {/* Collapsible selectors section */}
        <div className={`${filtersCollapsed ? 'hidden' : 'flex'} sm:flex flex-row gap-2 sm:gap-4 analysis-selectors w-full transition-all duration-200`}>
          <div className="flex-1 min-w-0">
            <DateSelector onDateSelect={handleDateSelect} inline />
          </div>
          <div className="flex-1 min-w-0">
            <SymbolDropdown 
              analyses={analyses} 
              selectedSymbol={selectedSymbol} 
              onSymbolSelect={handleSymbolSelect}
              inline 
            />
          </div>
        </div>
        
        {/* Compact info bar when collapsed (mobile only) */}
        {filtersCollapsed && selectedSymbol && selectedDate && (
          <div className="sm:hidden text-xs text-gray-600 flex items-center gap-2">
            <span className="font-medium">{selectedDate.toISOString().split('T')[0]}</span>
            <span>•</span>
            <span className="font-medium">{selectedSymbol}</span>
          </div>
        )}
      </div>

      {/* Main content area with responsive grid */}
      <div className="flex-1 min-h-0 overflow-hidden p-3 sm:p-4 lg:p-6">
        {loading && (
          <div className="flex items-center justify-center p-8 h-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading analyses...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentAnalysis && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Analysis Details - passes className for mobile styling */}
            <AnalysisDetails analysis={currentAnalysis} className="mb-3 sm:mb-4 flex-shrink-0" />
            
            {/* Desktop layout: 2 columns */}
            <div className="hidden lg:grid grid-cols-2 gap-6 flex-1 min-h-0 analysis-grid">
              {/* Left column - Analysis content */}
              <div className="flex flex-col min-h-0">
                <AnalysisContent 
                  analysis={currentAnalysis} 
                  onRemarksUpdate={handleRemarksUpdate}
                  className="flex-1"
                />
              </div>
              {/* Right column - Chart (desktop only) */}
              <div className="flex flex-col min-h-0">
                <div className="bg-white rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
                  <div className="border-b border-gray-200 flex-shrink-0 overflow-x-auto chart-tabs">
                    <nav className="flex -mb-px min-w-max">
                      <button 
                        className={`py-3 px-4 sm:py-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                          activeChartTab === '3month' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`} 
                        onClick={() => setActiveChartTab('3month')}
                      >
                        3 Month Chart
                      </button>
                      <button 
                        className={`py-3 px-4 sm:py-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                          activeChartTab === '1year' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`} 
                        onClick={() => setActiveChartTab('1year')}
                      >
                        1 Year Chart
                      </button>
                    </nav>
                  </div>
                  
                  <div className="p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                      {activeChartTab === '3month' && (
                        <div>
                          {currentAnalysis.chart_3month ? (
                            <>
                              <img 
                                src={getImageUrl(currentAnalysis.chart_3month)}
                                alt="3 Month Chart"
                                className="w-full h-auto rounded-lg chart-image"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling;
                                  if (fallback) {
                                    (fallback as HTMLElement).style.display = 'block';
                                  }
                                }}
                              />
                              <div className="hidden bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2">3 Month Chart unavailable</p>
                              </div>
                            </>
                          ) : (
                            <ChartView symbol={currentAnalysis.symbol} />
                          )}
                        </div>
                      )}
                      
                      {activeChartTab === '1year' && (
                        <div>
                          {currentAnalysis.chart_1year ? (
                            <>
                              <img 
                                src={getImageUrl(currentAnalysis.chart_1year)}
                                alt="1 Year Chart"
                                className="w-full h-auto rounded-lg chart-image"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling;
                                  if (fallback) {
                                    (fallback as HTMLElement).style.display = 'block';
                                  }
                                }}
                              />
                              <div className="hidden bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2">1 Year Chart unavailable</p>
                              </div>
                            </>
                          ) : (
                            <ChartView symbol={currentAnalysis.symbol} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile/Tablet layout: Tabs and content in single scrollable column */}
            <div className="lg:hidden flex-1 min-h-0 overflow-y-auto">
              <div className="pb-4">
                <AnalysisContent 
                  analysis={currentAnalysis} 
                  onRemarksUpdate={handleRemarksUpdate}
                  className="min-h-[300px]"
                />
              </div>
              
              {/* Chart section - within the same scroll container */}
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4">
                <div className="border-b border-gray-200 mb-3 sm:mb-4">
                  <nav className="flex -mb-px">
                    <button 
                      className={`py-2 px-3 sm:py-3 sm:px-4 border-b-2 font-medium text-sm transition-colors ${
                        activeChartTab === '3month' 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`} 
                      onClick={() => setActiveChartTab('3month')}
                    >
                      3 Month
                    </button>
                    <button 
                      className={`py-2 px-3 sm:py-3 sm:px-4 border-b-2 font-medium text-sm transition-colors ${
                        activeChartTab === '1year' 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`} 
                      onClick={() => setActiveChartTab('1year')}
                    >
                      1 Year
                    </button>
                  </nav>
                </div>
                
                <div className="h-[300px] overflow-hidden">
                  {activeChartTab === '3month' && currentAnalysis.chart_3month && (
                    <img 
                      src={getImageUrl(currentAnalysis.chart_3month)}
                      alt="3 Month Chart"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  )}
                  {activeChartTab === '1year' && currentAnalysis.chart_1year && (
                    <img 
                      src={getImageUrl(currentAnalysis.chart_1year)}
                      alt="1 Year Chart"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  )}
                  {!currentAnalysis.chart_3month && !currentAnalysis.chart_1year && (
                    <ChartView symbol={currentAnalysis.symbol} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !currentAnalysis && analyses.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-blue-700">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>              </div>
              <div className="ml-3">
                <p className="text-sm">Please select a symbol from the dropdown to view analysis details.</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !currentAnalysis && analyses.length === 0 && selectedDate && !error && (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No analyses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No analyses available for {selectedDate.toLocaleDateString()}.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try selecting a different date.
            </p>
          </div>
        )}

        {!loading && !selectedDate && (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Select a date</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please select a date to view analyses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}