import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Tag, Shield, Activity, AlertCircle } from 'lucide-react';
import { AccountInfo, AccountResponse } from '../types/account';

export function AccountPage() {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioGain, setPortfolioGain] = useState(0);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/accountinfo');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch account data: ${response.status}`);
      }
      
      const data: AccountResponse = await response.json();
      setAccount(data.getAccount);
      
      // Calculate portfolio gain (mock calculation for demonstration)
      // You may need to adjust this based on your actual business logic
      const portfolioValue = parseFloat(data.getAccount.portfolio_value);
      const equity = parseFloat(data.getAccount.equity);
      const gain = portfolioValue - equity;
      setPortfolioGain(gain > 0 ? gain : 0);
    } catch (err) {
      console.error('Error fetching account data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading account data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No account data available</div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Account</h2>
      
      {/* Summary Card */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Portfolio Summary
            </h3>
            <p className="text-sm text-gray-500">
              Account #{account.account_number}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-2xl font-bold text-blue-700">
              {formatCurrency(account.portfolio_value)}
            </div>
            {portfolioGain > 0 && (
              <div className="text-sm text-green-600 flex items-center">
                <span className="font-medium">
                  +{formatCurrency(portfolioGain)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Account Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Account Information */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <Tag className="mr-2 text-blue-600" size={20} />
            <h3 className="text-lg font-semibold">Account Information</h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">ID</div>
              <div className="text-sm font-medium text-ellipsis overflow-hidden">{account.id}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Account Number</div>
              <div className="text-sm font-medium">{account.account_number}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Status</div>
              <div className="text-sm font-medium">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {account.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Crypto Status</div>
              <div className="text-sm font-medium">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {account.crypto_status}
                </span>
              </div>
            </div>            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Currency</div>
              <div className="text-sm font-medium">{account.currency}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Created At</div>
              <div className="text-sm font-medium">
                {formatDate(account.created_at)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Multiplier</div>
              <div className="text-sm font-medium">{account.multiplier}x</div>
            </div>
          </div>
        </div>

        {/* Buying Power */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <DollarSign className="mr-2 text-green-600" size={20} />
            <h3 className="text-lg font-semibold">Buying Power</h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Buying Power</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.buying_power)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Regt Buying Power</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.regt_buying_power)}
              </div>
            </div>            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Daytrading Power</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.daytrading_buying_power)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Non-Marginable</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.non_marginable_buying_power)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Cash</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.cash)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Options Power</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.options_buying_power)}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Metrics */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <Activity className="mr-2 text-purple-600" size={20} />
            <h3 className="text-lg font-semibold">Portfolio Metrics</h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Equity</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.equity)}
              </div>
            </div>            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Last Equity</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.last_equity)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Long Market Value</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.long_market_value)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Short Market Value</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.short_market_value)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Initial Margin</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.initial_margin)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Maintenance Margin</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.maintenance_margin)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">SMA</div>
              <div className="text-sm font-medium">
                {formatCurrency(account.sma)}
              </div>
            </div>
          </div>
        </div>
        {/* Account Status & Settings */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <Shield className="mr-2 text-amber-600" size={20} />
            <h3 className="text-lg font-semibold">Account Status & Settings</h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Pattern Day Trader</div>
              <div className="text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  account.pattern_day_trader 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {account.pattern_day_trader ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Shorting Enabled</div>
              <div className="text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  account.shorting_enabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {account.shorting_enabled ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Trading Blocked</div>
              <div className="text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  account.trading_blocked 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {account.trading_blocked ? 'Yes' : 'No'}
                </span>
              </div>
            </div>            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Transfers Blocked</div>
              <div className="text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  account.transfers_blocked 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {account.transfers_blocked ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Account Blocked</div>
              <div className="text-sm font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  account.account_blocked 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {account.account_blocked ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Options Level</div>
              <div className="text-sm font-medium">
                Level {account.options_trading_level} (Approved: {account.options_approved_level})
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Day Trade Count</div>
              <div className="text-sm font-medium">{account.daytrade_count}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}