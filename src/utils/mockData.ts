export interface Analysis {
  id: string;
  datetime: string;
  symbol: string;
  exchange: string;
  trade_type: 'TREND' | 'SWING' | 'No Trade' | 'Position Mgmt';
  analysis_content: string;
  analysis_prompt: string;
  decision: any;
}
export const mockAnalyses: Analysis[] = [{
  id: 'A-001',
  datetime: '2023-07-23T14:30:00Z',
  symbol: 'AAPL',
  exchange: 'NASDAQ',
  trade_type: 'SWING',
  analysis_content: `# AAPL Analysis
## Technical Analysis
- **Price Action**: AAPL is currently trading at $182.63, showing a bullish trend with higher highs and higher lows over the past 3 weeks.
- **Support/Resistance**: Strong support at $175 with resistance at $185.
- **Moving Averages**: Price above 50-day and 200-day MAs, indicating bullish momentum.
- **Volume**: Increasing volume on up days, confirming strength of the move.
## Fundamental Factors
- Recent earnings beat expectations with 8% YoY revenue growth
- New product launches expected in September
- Services segment showing 12% growth
## Risk Assessment
- Market volatility index (VIX) is relatively low at 16
- Tech sector showing strength
- Key risk: upcoming Fed meeting may impact market sentiment
## Conclusion
The technical setup shows a potential breakout above $185, with strong fundamentals supporting continued growth.`,
  analysis_prompt: `Analyze AAPL stock for potential swing trade opportunities. Consider technical patterns, support/resistance levels, and recent fundamental developments. Include volume analysis and risk assessment.`,
  decision: {
    symbol: 'AAPL',
    analysis_date: '2023-07-23',
    decision: 'Enter swing trade - Bullish breakout pattern with 2.5 R/R ratio. Wait for confirmation above $185 before entry.',
    swing_trade_orders: {
      initial_position: {
        order_type: 'buy',
        symbol: 'AAPL',
        qty: 50,
        side: 'buy',
        type: 'limit',
        time_in_force: 'gtc',
        limit_price: 185.5,
        order_class: 'bracket',
        stop_loss: {
          stop_price: 179.75,
          limit_price: 179.5
        },
        take_profit: {
          limit_price: 197.0
        }
      }
    }
  }
}, {
  id: 'A-002',
  datetime: '2023-07-24T10:15:00Z',
  symbol: 'AMZN',
  exchange: 'NASDAQ',
  trade_type: 'TREND',
  analysis_content: `# AMZN Analysis
## Technical Analysis
- **Price Action**: AMZN is forming a cup and handle pattern on the daily chart, currently at $206.12.
- **Support/Resistance**: Strong support at $200 with resistance at $210.
- **Moving Averages**: Price consolidating above the 50-day MA, 200-day MA showing upward slope.
- **Volume**: Decreasing volume during consolidation phase, typical for this pattern.
## Fundamental Factors
- AWS growth accelerating at 33% YoY
- E-commerce segment recovering after post-pandemic slowdown
- Advertising revenue showing promising growth
## Risk Assessment
- Overall market showing some signs of exhaustion
- Competition in cloud services intensifying
- Regulatory concerns remain but have decreased in recent months
## Conclusion
AMZN shows a strong technical setup with fundamental tailwinds. The cup and handle pattern suggests potential for upside move if $210 resistance is broken.`,
  analysis_prompt: `Provide comprehensive analysis for AMZN stock focusing on potential trend trading opportunity. Include pattern identification, key support/resistance levels, fundamental catalysts, and volume analysis. Assess overall market conditions and sector performance.`,
  decision: {
    symbol: 'AMZN',
    analysis_date: '2023-07-24',
    decision: 'Enter trend trade - Cup and handle pattern forming with 2.68 R/R ratio. Wait for breakout above $210 with increased volume.',
    trend_trade_orders: {
      initial_position: {
        order_type: 'buy',
        symbol: 'AMZN',
        qty: 20,
        side: 'buy',
        type: 'limit',
        time_in_force: 'gtc',
        limit_price: 211.5,
        order_class: 'bracket',
        stop_loss: {
          stop_price: 201.19,
          limit_price: 201.0
        },
        take_profit: {
          limit_price: 230.0
        }
      }
    }
  }
}];
export const getAnalysesByDate = (date: string) => {
  // In a real app, this would filter by the actual date
  // For mock purposes, we're just returning all analyses
  return mockAnalyses;
};
export const getAnalysisBySymbol = (symbol: string) => {
  return mockAnalyses.find(analysis => analysis.symbol === symbol);
};