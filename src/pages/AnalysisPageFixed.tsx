import React, { useEffect, useState } from 'react';
import { DateSelector } from '../components/DateSelector';
import { SymbolDropdown } from '../components/SymbolDropdown';
import { AnalysisDetails } from '../components/AnalysisDetails';
import { AnalysisContent } from '../components/AnalysisContent';
import { ChartView } from '../components/ChartView';
import { Analysis } from '../types/analysis';
import { fetchAnalysesByDate, formatDateForAPI, getImageUrl } from '../utils/api';
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
      trade_type: 'LONG',
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
    },    {
      id: 'mock-2',
      recordId: 1002,
      datetime: `${baseDate}T10:15:00`,
      symbol: 'GOOGL',
      exchange: 'NASDAQ',
      trade_type: 'LONG',
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