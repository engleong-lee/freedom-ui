export interface AccountData {
  portfolioGainedValue: number;
  id: string;
  accountNumber: string;
  status: string;
  cryptoStatus: string;
  currency: string;
  buyingPower: number;
  regtBuyingPower: number;
  daytradingBuyingPower: number;
  nonMarginableBuyingPower: number;
  cash: number;
  accruedFees: string | null;
  pendingTransferOut: string | null;
  pendingTransferIn: string | null;
  portfolioValue: number;
  patternDayTrader: boolean;
  tradingBlocked: boolean;
  transfersBlocked: boolean;
  accountBlocked: boolean;
  createdAt: string;
}
export const mockAccountData: AccountData = {
  portfolioGainedValue: 142.78,
  id: 'aбccb75d-dc0c-4be2-9089-805f0545132b',
  accountNumber: 'PA30FODRX3W1',
  status: 'ACTIVE',
  cryptoStatus: 'ACTIVE',
  currency: 'USD',
  buyingPower: 400571.12,
  regtBuyingPower: 200285.56,
  daytradingBuyingPower: 400571.12,
  nonMarginableBuyingPower: 100142.78,
  cash: 100142.78,
  accruedFees: null,
  pendingTransferOut: null,
  pendingTransferIn: null,
  portfolioValue: 100142.78,
  patternDayTrader: true,
  tradingBlocked: false,
  transfersBlocked: false,
  accountBlocked: false,
  createdAt: '2025-07-01T12:31:12.533961Z'
};