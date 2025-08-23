export interface Position {
  symbol: string;
  quantity: number;
  marketValue: number;
  assetId: string;
  avgEntryPrice: number;
  side: 'long' | 'short';
  unrealizedPL: number;
  unrealizedPLPC: number;
}
export const mockPositions: Position[] = [{
  symbol: 'AAPL',
  quantity: 50,
  marketValue: 9131.5,
  assetId: 'b0b6dd9d-8b9b-48a9-ba46-b9d54906e415',
  avgEntryPrice: 175.85,
  side: 'long',
  unrealizedPL: 742.5,
  unrealizedPLPC: 8.43
}, {
  symbol: 'MSFT',
  quantity: 25,
  marketValue: 10212.75,
  assetId: 'a0d3e31c-c098-4a19-8e8a-5c32e1a292a4',
  avgEntryPrice: 380.25,
  side: 'long',
  unrealizedPL: 706.5,
  unrealizedPLPC: 6.92
}, {
  symbol: 'TSLA',
  quantity: 30,
  marketValue: 5724.6,
  assetId: 'c7f8d2b1-e3a7-4c2d-9e8f-1a5b6c3d4e2f',
  avgEntryPrice: 207.25,
  side: 'long',
  unrealizedPL: -496.5,
  unrealizedPLPC: -7.98
}, {
  symbol: 'AMZN',
  quantity: 15,
  marketValue: 3091.8,
  assetId: 'd2e4f6a8-b0c2-4e6f-8a0d-2c4e6f8a0b2c',
  avgEntryPrice: 211.5,
  side: 'long',
  unrealizedPL: 219.3,
  unrealizedPLPC: 7.63
}, {
  symbol: 'META',
  quantity: 20,
  marketValue: 9127.6,
  assetId: 'e1d3c5b7-a9f1-4e3d-b5c7-9f1e3d5b7a9f',
  avgEntryPrice: 432.5,
  side: 'long',
  unrealizedPL: 477.4,
  unrealizedPLPC: 5.52
}];