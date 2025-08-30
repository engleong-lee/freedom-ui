import React, { useState, useEffect } from 'react';
import { 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Loader2, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  Zap,
  ShoppingCart,
  StopCircle,
  CheckCircle,
  Trophy,
  Package,
  Clock,
  DollarSign,
  ChartBar,
  RefreshCw,
  Info,
  X
} from 'lucide-react';

// Type definitions based on the new active-trades endpoint
interface OrderDetails {
  id: string;
  side: string;
  qty: string;
  order_type: string;
  order_class: string;
  status: string;
  stop_price: string | null;
  limit_price: string | null;
  created_at: string;
  submitted_at: string;
  filled_at: string | null;
  filled_qty: string;
  filled_avg_price: string | null;
}

interface Order {
  order_details: OrderDetails;
  order_type: 'buy' | 'stop_loss' | 'take_profit' | 'buy_filled';
}

interface Position {
  qty: string;
  avg_entry_price: string;
  market_value: string;
  unrealized_pl: string;
  current_price: string;
  side: string;
  change_today: string;
}

interface ActiveTrade {
  symbol: string;
  trade_type: 'SWING' | 'TREND' | 'POSITION_ONLY';
  position: Position | null;
  orders: Order[];
  order_count: number;
  has_position: boolean;
  tracking_data: any | null;
}

interface Summary {
  total_symbols: number;
  positions_count: number;
  pending_entries: number;
  swing_trades: number;
  trend_trades: number;
  total_active_orders: number;
}

interface ApiResponse {
  summary: Summary;
  active_trades: ActiveTrade[];
  timestamp: string;
}

// Icon mapping for trade types
const getTradeTypeIcon = (type: string) => {
  switch (type) {
    case 'SWING':
      return <Zap className="w-4 h-4" />;
    case 'TREND':
      return <TrendingUp className="w-4 h-4" />;
    case 'POSITION_ONLY':
      return <Package className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};
// Icon mapping for order types
const getOrderTypeIcon = (type: string) => {
  switch (type) {
    case 'buy':
      return <ShoppingCart className="w-4 h-4" />;
    case 'stop_loss':
      return <StopCircle className="w-4 h-4" />;
    case 'take_profit':
      return <Trophy className="w-4 h-4" />;
    case 'buy_filled':
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

// Color scheme for trade types
const getTradeTypeStyle = (type: string) => {
  switch (type) {
    case 'SWING':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'TREND':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'POSITION_ONLY':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
// Color scheme for order types
const getOrderTypeStyle = (type: string, status?: string) => {
  const isPending = status === 'OrderStatus.NEW' || status === 'OrderStatus.HELD';
  const opacity = isPending ? 'opacity-100' : 'opacity-60';
  
  switch (type) {
    case 'buy':
      return `bg-green-50 text-green-700 border-green-200 ${opacity}`;
    case 'stop_loss':
      return `bg-red-50 text-red-700 border-red-200 ${opacity}`;
    case 'take_profit':
      return `bg-blue-50 text-blue-700 border-blue-200 ${opacity}`;
    case 'buy_filled':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export function PositionsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTrades, setExpandedTrades] = useState<Set<string>>(new Set());
  const [selectedTab, setSelectedTab] = useState<'all' | 'positions' | 'pending'>('all');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  // Mock data for demonstration
  const mockData: ApiResponse = {
    summary: {
      total_symbols: 4,
      positions_count: 2,
      pending_entries: 2, // Fixed: AMD and MA have pending entries
      swing_trades: 1,
      trend_trades: 2,
      total_active_orders: 7
    },
    active_trades: [
      {
        symbol: "AMD",
        trade_type: "SWING",
        position: null,
        orders: [
          {
            order_details: {
              id: "45642988-81bf-45e5-809e-c244716c1300",
              side: "OrderSide.BUY",
              qty: "14",
              order_type: "OrderType.LIMIT",
              order_class: "OrderClass.BRACKET",
              status: "OrderStatus.NEW",
              stop_price: null,
              limit_price: "158.38",
              created_at: "2025-08-29T13:49:52.751014+00:00",
              submitted_at: "2025-08-29T13:49:52.759734+00:00",
              filled_at: null,
              filled_qty: "0",
              filled_avg_price: null
            },
            order_type: "buy"
          },
          {
            order_details: {
              id: "9eacbc37-2772-482d-aad0-97cbf01c9488",
              side: "OrderSide.SELL",
              qty: "14",
              order_type: "OrderType.STOP",
              order_class: "OrderClass.BRACKET",
              status: "OrderStatus.HELD",
              stop_price: "151.56",
              limit_price: null,
              created_at: "2025-08-29T13:49:52.751014+00:00",
              submitted_at: "2025-08-29T13:49:52.751014+00:00",
              filled_at: null,
              filled_qty: "0",
              filled_avg_price: null
            },
            order_type: "stop_loss"
          },
          {
            order_details: {
              id: "3d8e1f53-f043-44ec-90ad-9f8a5e40f57a",
              side: "OrderSide.SELL",
              qty: "14",
              order_type: "OrderType.LIMIT",
              order_class: "OrderClass.BRACKET",
              status: "OrderStatus.HELD",
              stop_price: null,
              limit_price: "179.46",
              created_at: "2025-08-29T13:49:52.751014+00:00",
              submitted_at: "2025-08-29T13:49:52.751014+00:00",
              filled_at: null,
              filled_qty: "0",
              filled_avg_price: null
            },
            order_type: "take_profit"
          }
        ],
        order_count: 3,
        has_position: false,
        tracking_data: null
      },
      {
        symbol: "AMZN",
        trade_type: "TREND",
        position: {
          qty: "106",
          avg_entry_price: "228.18",
          market_value: "24274",
          unrealized_pl: "86.92",
          current_price: "229",
          side: "PositionSide.LONG",
          change_today: "0"
        },
        orders: [
          {
            order_details: {
              id: "6dfcf078-f28e-48e3-b41f-5c3fc5ecf1c0",
              side: "OrderSide.SELL",
              qty: "106",
              order_type: "OrderType.STOP",
              order_class: "OrderClass.OTO",
              status: "OrderStatus.NEW",
              stop_price: "218.79",
              limit_price: null,
              created_at: "2025-08-29T13:49:49.736827+00:00",
              submitted_at: "2025-08-29T17:18:30.267752+00:00",
              filled_at: null,
              filled_qty: "0",
              filled_avg_price: null
            },
            order_type: "stop_loss"
          },
          {
            order_details: {
              id: "d2f18b7d-66d4-4063-9852-8c140b515ce1",
              side: "OrderSide.BUY",
              qty: "106",
              order_type: "OrderType.LIMIT",
              order_class: "OrderClass.OTO",
              status: "OrderStatus.FILLED",
              stop_price: null,
              limit_price: "228.18",
              created_at: "2025-08-29T13:49:49.736827+00:00",
              submitted_at: "2025-08-29T13:49:49.743680+00:00",
              filled_at: "2025-08-29T17:18:30.252454+00:00",
              filled_qty: "106",
              filled_avg_price: "228.18"
            },
            order_type: "buy_filled"
          }
        ],
        order_count: 2,
        has_position: true,
        tracking_data: null
      },
      {
        symbol: "BTCUSD",
        trade_type: "POSITION_ONLY",
        position: {
          qty: "0.000084856",
          avg_entry_price: "115240.264",
          market_value: "9.192984",
          unrealized_pl: "-0.585844",
          current_price: "108336.293",
          side: "PositionSide.LONG",
          change_today: "0.0069719541666734"
        },
        orders: [],
        order_count: 0,
        has_position: true,
        tracking_data: null
      },
      {
        symbol: "MA",
        trade_type: "TREND",
        position: null,
        orders: [
          {
            order_details: {
              id: "615dfbd3-c98a-403f-b0d7-ed2b703e36da",
              side: "OrderSide.BUY",
              qty: "10",
              order_type: "OrderType.LIMIT",
              order_class: "OrderClass.OTO",
              status: "OrderStatus.NEW",
              stop_price: null,
              limit_price: "584.75",
              created_at: "2025-08-29T13:49:51.251436+00:00",
              submitted_at: "2025-08-29T13:49:51.256957+00:00",
              filled_at: null,
              filled_qty: "0",
              filled_avg_price: null
            },
            order_type: "buy"
          },
          {
            order_details: {
              id: "b1ac7a14-1362-458d-bf55-6bbfa34dc563",
              side: "OrderSide.SELL",
              qty: "10",
              order_type: "OrderType.STOP",
              order_class: "OrderClass.OTO",
              status: "OrderStatus.HELD",
              stop_price: "575.07",
              limit_price: null,
              created_at: "2025-08-29T13:49:51.251436+00:00",
              submitted_at: "2025-08-29T13:49:51.251436+00:00",
              filled_at: null,
              filled_qty: "0",
              filled_avg_price: null
            },
            order_type: "stop_loss"
          }
        ],
        order_count: 2,
        has_position: false,
        tracking_data: null
      }
    ],
    timestamp: "2025-08-30T15:40:05.857736"
  };

  // Fetch active trades data from API
  const fetchActiveTrades = async () => {
    try {
      setError(null);
      // Use mock data for demonstration
      setData(mockData);
      setLastUpdate(new Date());
      setLoading(false);
      
      // Uncomment below for real API call
      // const response = await fetch('/active-trades');
      // if (!response.ok) {
      //   throw new Error(`Failed to fetch active trades: ${response.statusText}`);
      // }
      // const data: ApiResponse = await response.json();
      // setData(data);
      // setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching active trades');
      console.error('Error fetching active trades:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchActiveTrades();
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchActiveTrades, 30000);
    
    // Cleanup function
    return () => clearInterval(interval);
  }, []);
  // Utility functions
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };

  const formatNumber = (value: string | number, decimals: number = 2) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(numValue);
  };

  const formatPercentage = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `${numValue >= 0 ? '+' : ''}${(numValue * 100).toFixed(2)}%`;
  };

  const formatSide = (side: string) => {
    return side.replace('PositionSide.', '').toLowerCase();
  };

  const formatStatus = (status: string) => {
    return status.replace('OrderStatus.', '').toLowerCase();
  };
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleTradeExpansion = (symbol: string) => {
    const newExpanded = new Set(expandedTrades);
    if (newExpanded.has(symbol)) {
      newExpanded.delete(symbol);
    } else {
      newExpanded.add(symbol);
    }
    setExpandedTrades(newExpanded);
  };

  // Filter trades based on selected tab
  const getFilteredTrades = () => {
    if (!data) return [];
    
    switch (selectedTab) {
      case 'positions':
        return data.active_trades.filter(trade => trade.has_position);
      case 'pending':
        return data.active_trades.filter(trade => !trade.has_position && trade.orders.length > 0);
      default:
        return data.active_trades;
    }
  };
  // Summary Card Component
  const SummaryCard = () => {
    if (!data) return null;
    const { summary } = data;
    
    return (
      <div className="hidden md:block bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white mb-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold">Portfolio Summary</h3>
          <button
            onClick={fetchActiveTrades}
            className="p-0.5 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold">{summary.total_symbols}</div>
            <div className="text-xs opacity-90">Symbols</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{summary.positions_count}</div>
            <div className="text-xs opacity-90">Positions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{summary.pending_entries}</div>
            <div className="text-xs opacity-90">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{summary.swing_trades}</div>
            <div className="text-xs opacity-90">Swing</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{summary.trend_trades}</div>
            <div className="text-xs opacity-90">Trend</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{summary.total_active_orders}</div>
            <div className="text-xs opacity-90">Active Orders</div>
          </div>
        </div>
      </div>
    );
  };
  // Order Badge Component
  const OrderBadge = ({ order }: { order: Order }) => {
    const { order_details, order_type } = order;
    const status = formatStatus(order_details.status);
    const style = getOrderTypeStyle(order_type, order_details.status);
    
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${style}`}>
        {getOrderTypeIcon(order_type)}
        <span className="capitalize">{order_type.replace('_', ' ')}</span>
        {order_details.limit_price && (
          <span className="font-mono">@{formatNumber(order_details.limit_price, 2)}</span>
        )}
        {order_details.stop_price && (
          <span className="font-mono">@{formatNumber(order_details.stop_price, 2)}</span>
        )}
        <span className="text-xs opacity-75">({status})</span>
      </div>
    );
  };
  // Mobile Trade Card Component
  const MobileTradeCard = ({ trade }: { trade: ActiveTrade }) => {
    const isExpanded = expandedTrades.has(trade.symbol);
    const position = trade.position;
    const unrealizedPl = position ? parseFloat(position.unrealized_pl) : 0;
    const changeToday = position ? parseFloat(position.change_today) : 0;
    
    // Get pending buy order details if no position
    const pendingBuyOrder = trade.orders.find(order => order.order_type === 'buy');
    const pendingQuantity = pendingBuyOrder ? pendingBuyOrder.order_details.qty : null;
    const pendingBuyPrice = pendingBuyOrder ? pendingBuyOrder.order_details.limit_price : null;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg mb-3 shadow-sm hover:shadow-md transition-all">
        {/* Header */}
        <div 
          className="p-4 cursor-pointer"
          onClick={() => toggleTradeExpansion(trade.symbol)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${getTradeTypeStyle(trade.trade_type)}`}>
                {getTradeTypeIcon(trade.trade_type)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{trade.symbol}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getTradeTypeStyle(trade.trade_type)}`}>
                  {trade.trade_type}
                </span>
              </div>
            </div>
            {position && (
              <div className="text-right">
                <div className="text-lg font-bold">{formatCurrency(position.market_value)}</div>
                <div className={`text-sm font-medium ${unrealizedPl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(unrealizedPl)}
                </div>
              </div>
            )}
            {!position && trade.orders.length > 0 && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500">Pending Entry</div>
                <div className="text-xs text-gray-400">
                  {pendingBuyPrice && <span className="font-medium text-gray-600">@{formatNumber(pendingBuyPrice, 2)} • </span>}
                  {trade.order_count} orders
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            {/* Position Details */}
            {position && (
              <div className="mt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Quantity</div>
                    <div className="text-sm font-medium">{formatNumber(position.qty, 6)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Avg Entry</div>
                    <div className="text-sm font-medium">{formatCurrency(position.avg_entry_price)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Current Price</div>
                    <div className="text-sm font-medium">{formatCurrency(position.current_price)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Change Today</div>
                    <div className={`text-sm font-medium ${changeToday >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(changeToday)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pending Entry Details */}
            {!position && pendingBuyOrder && (
              <div className="mt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Quantity</div>
                    <div className="text-sm font-medium">{pendingQuantity}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Buy Price</div>
                    <div className="text-sm font-medium">{formatCurrency(pendingBuyPrice || '0')}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Orders */}
            {trade.orders.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">Active Orders</div>
                <div className="flex flex-wrap gap-2">
                  {trade.orders.map((order) => (
                    <OrderBadge key={order.order_details.id} order={order} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  // Desktop Trade Row Component
  const DesktopTradeRow = ({ trade }: { trade: ActiveTrade }) => {
    const isExpanded = expandedTrades.has(trade.symbol);
    const position = trade.position;
    const unrealizedPl = position ? parseFloat(position.unrealized_pl) : 0;
    const changeToday = position ? parseFloat(position.change_today) : 0;
    
    return (
      <>
        <tr 
          className="hover:bg-gray-50 cursor-pointer border-b"
          onClick={() => toggleTradeExpansion(trade.symbol)}
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${getTradeTypeStyle(trade.trade_type)}`}>
                {getTradeTypeIcon(trade.trade_type)}
              </div>
              <span className="font-medium text-gray-900">{trade.symbol}</span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTradeTypeStyle(trade.trade_type)}`}>
              {trade.trade_type}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            {position ? (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                formatSide(position.side) === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {formatSide(position.side).toUpperCase()}
              </span>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            {position ? formatNumber(position.qty, 6) : '—'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            {position ? formatCurrency(position.avg_entry_price) : '—'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            {position ? formatCurrency(position.current_price) : '—'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            {position ? formatCurrency(position.market_value) : '—'}
          </td>
          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
            unrealizedPl >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {position ? formatCurrency(unrealizedPl) : '—'}
          </td>
          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
            changeToday >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {position ? formatPercentage(changeToday) : '—'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {trade.order_count} orders
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          </td>
        </tr>
        {/* Expanded Row */}
        {isExpanded && (
          <tr className="bg-gray-50">
            <td colSpan={11} className="px-6 py-4">
              <div className="space-y-3">
                {/* Orders Section */}
                {trade.orders.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Active Orders</h4>
                    <div className="flex flex-wrap gap-2">
                      {trade.orders.map((order) => (
                        <OrderBadge key={order.order_details.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Order Details Table */}
                {trade.orders.length > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 uppercase">
                          <th className="text-left pr-4">Type</th>
                          <th className="text-left px-4">Side</th>
                          <th className="text-left px-4">Qty</th>
                          <th className="text-left px-4">Price</th>
                          <th className="text-left px-4">Status</th>
                          <th className="text-left px-4">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {trade.orders.map((order) => (
                          <tr key={order.order_details.id}>
                            <td className="py-2 pr-4 capitalize">
                              {order.order_type.replace('_', ' ')}
                            </td>
                            <td className="py-2 px-4">
                              {order.order_details.side.replace('OrderSide.', '')}
                            </td>
                            <td className="py-2 px-4">{order.order_details.qty}</td>
                            <td className="py-2 px-4">
                              {order.order_details.limit_price || order.order_details.stop_price || '—'}
                            </td>
                            <td className="py-2 px-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.order_details.status.includes('FILLED') 
                                  ? 'bg-green-100 text-green-800'
                                  : order.order_details.status.includes('NEW')
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {formatStatus(order.order_details.status)}
                              </span>
                            </td>
                            <td className="py-2 px-4 text-xs text-gray-500">
                              {formatDateTime(order.order_details.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };
  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">&nbsp;Trades</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading trades...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">&nbsp;Trades</h2>
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  const filteredTrades = getFilteredTrades();
  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <SummaryCard />
      
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="ml-12 md:ml-0">
              <h2 className="text-xl md:text-2xl font-bold">&nbsp;Trades</h2>
              {lastUpdate && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>
            
            {/* Tab Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({data?.active_trades.length || 0})
              </button>
              <button
                onClick={() => setSelectedTab('positions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === 'positions'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Positions ({data?.summary.positions_count || 0})
              </button>
              <button
                onClick={() => setSelectedTab('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === 'pending'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({data?.summary.pending_entries || 0})
              </button>
            </div>
          </div>
        </div>
        {/* Mobile View */}
        <div className="block lg:hidden p-4">
          {filteredTrades.length > 0 ? (
            <div className="space-y-3">
              {filteredTrades.map((trade) => (
                <MobileTradeCard key={trade.symbol} trade={trade} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No trades found in this category.
            </div>
          )}
        </div>
        
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          {filteredTrades.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Side
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Entry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unrealized P&L
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change Today
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrades.map((trade) => (
                  <DesktopTradeRow key={trade.symbol} trade={trade} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No trades found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}