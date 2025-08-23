# Mock Data Mode for Analysis Page

## Overview
The Analysis Page now supports a **Mock Data Mode** that allows you to display sample analysis data without connecting to a real backend API. This is useful for:
- Development and testing
- Demonstrations
- UI/UX prototyping
- Offline development

## How to Enable Mock Data Mode

### Method 1: Toggle in App.tsx
Edit the `USE_MOCK_DATA` constant in `src/App.tsx`:

```typescript
// src/App.tsx
const USE_MOCK_DATA = true; // Set to true to enable mock data
```

### Method 2: Pass as Prop
You can also pass the `mockDataMode` prop directly when using the `AnalysisPage` component:

```typescript
<AnalysisPage mockDataMode={true} />
```

## Mock Data Contents

When mock data mode is enabled, the following sample analyses are provided:

1. **AAPL (Apple)** - LONG position with bullish technical analysis
2. **GOOGL (Google)** - HOLD position with consolidation pattern analysis
3. **MSFT (Microsoft)** - SHORT position with bearish reversal signals
4. **TSLA (Tesla)** - LONG position with high volatility analysis
5. **META (Meta Platforms)** - LONG position with trend continuation setup

Each mock analysis includes:
- Complete technical analysis text
- Support and resistance levels
- Trading decisions (BUY/SELL/HOLD)
- Sample chart placeholders
- Risk management recommendations
- Remarks and observations

## Features in Mock Data Mode

### Visual Indicator
When mock data mode is active, a yellow banner appears at the top of the page:
```
⚠️ Mock Data Mode Active - Displaying sample data for demonstration purposes
```

### Realistic Behavior
- Simulated loading delay (500ms) for realistic UX
- Date selection works (mock data adjusts to selected date)
- All UI interactions function normally
- Symbol dropdown populated with mock symbols

## Customizing Mock Data

To customize the mock data, edit the `generateMockData` function in `src/pages/AnalysisPage.tsx`:

```typescript
const generateMockData = (date: Date): Analysis[] => {
  // Add or modify mock analyses here
  return [
    {
      id: 'custom-1',
      symbol: 'YOUR_SYMBOL',
      // ... other fields
    }
  ];
};
```

## Environment-based Configuration

For a more robust setup, you can use environment variables:

1. Create a `.env` file:
```env
VITE_USE_MOCK_DATA=true
```

2. Update App.tsx:
```typescript
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
```

## Notes

- Mock data mode completely bypasses API calls to the backend
- Chart images use placeholder URLs (via.placeholder.com)
- All CRUD operations (like updating remarks) work locally but don't persist
- Perfect for frontend development without backend dependencies
