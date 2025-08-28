import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, AlertCircle, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

// Define the Position type based on API response
interface Position {
  Symbol: string;
  Quantity: string;
  'Market Value': string;
  'Asset Id': string;
  'Avg Entry Price': string;
  Side: string;
  'Unrealized Pl': string;
  'Unrealized Pl Pc': string;
  'Unrealized Intraday Pl': string;
  'Unrealized Intraday Pl Pc': string;
  'Current Price': string;
  'Last Day Price': string;
  'Change Today': string;
}

interface ApiResponse {
  positions: Position[];
}

export function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch positions data from API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/allpositions');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch positions: ${response.statusText}`);
        }
        
        const data: ApiResponse = await response.json();
        setPositions(data.positions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching positions');
        console.error('Error fetching positions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
    
    // Optional: Set up polling to refresh data every 30 seconds    const interval = setInterval(fetchPositions, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
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
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,      maximumFractionDigits: 4
    }).format(numValue);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPositions = [...positions].sort((a, b) => {
    if (!sortField) return 0;
    
    const fieldA = a[sortField as keyof Position];
    const fieldB = b[sortField as keyof Position];
    
    // Convert string numbers to actual numbers for proper sorting
    const numFieldA = parseFloat(fieldA);
    const numFieldB = parseFloat(fieldB);
    
    if (!isNaN(numFieldA) && !isNaN(numFieldB)) {
      return sortDirection === 'asc' ? numFieldA - numFieldB : numFieldB - numFieldA;
    }
        // String comparison for non-numeric fields
    return sortDirection === 'asc' 
      ? fieldA.localeCompare(fieldB) 
      : fieldB.localeCompare(fieldA);
  });

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="opacity-50" />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Clean up side value for display
  const formatSide = (side: string) => {
    return side.replace('PositionSide.', '').toLowerCase();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Positions</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading positions...</span>
        </div>
      </div>
    );  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Positions</h2>
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  // Mobile Card Component for each position
  const PositionCard = ({ position }: { position: Position }) => {
    const unrealizedPl = parseFloat(position['Unrealized Pl']);
    const unrealizedPlPc = parseFloat(position['Unrealized Pl Pc']);
    const changeToday = parseFloat(position['Change Today']);
    const side = formatSide(position.Side);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Header with Symbol and Side */}
        <div className="flex justify-between items-start mb-3">          <div>
            <h3 className="text-lg font-semibold text-gray-900">{position.Symbol}</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
              side === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {side.toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(position['Market Value'])}
            </div>
            <div className="text-xs text-gray-500">Market Value</div>
          </div>
        </div>

        {/* Quantity and Prices */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-gray-500">Quantity</div>
            <div className="text-sm font-medium">{formatNumber(position.Quantity, 6)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Current Price</div>
            <div className="text-sm font-medium">{formatCurrency(position['Current Price'])}</div>          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-gray-500">Avg Entry Price</div>
            <div className="text-sm font-medium">{formatCurrency(position['Avg Entry Price'])}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Change Today</div>
            <div className={`text-sm font-medium flex items-center ${
              changeToday >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeToday >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
              {formatPercentage(changeToday)}
            </div>
          </div>
        </div>

        {/* P&L Section */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">Unrealized P&L</div>
            <div className="flex items-center gap-3">              <span className={`font-semibold ${
                unrealizedPl >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(unrealizedPl)}
              </span>
              <span className={`text-sm px-2 py-1 rounded ${
                unrealizedPlPc >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {formatPercentage(unrealizedPlPc)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Positions</h2>
        <span className="text-xs md:text-sm text-gray-500">
          {positions.length} position{positions.length !== 1 ? 's' : ''}
        </span>
      </div>      
      {/* Mobile Card View - Only visible on small screens */}
      <div className="block md:hidden">
        {sortedPositions.map((position) => (
          <PositionCard key={position['Asset Id']} position={position} />
        ))}
      </div>

      {/* Desktop Table View - Only visible on medium screens and up */}
      <div className="hidden md:block shadow overflow-hidden border-b border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('Symbol')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Symbol</span>
                    <SortIcon field="Symbol" />
                  </div>
                </th>
                <th                   scope="col" 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('Quantity')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Quantity</span>
                    <SortIcon field="Quantity" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('Market Value')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Market Value</span>
                    <SortIcon field="Market Value" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('Current Price')}
                >                  <div className="flex items-center space-x-1">
                    <span>Current Price</span>
                    <SortIcon field="Current Price" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('Avg Entry Price')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Avg Entry</span>
                    <SortIcon field="Avg Entry Price" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('Side')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Side</span>
                    <SortIcon field="Side" />
                  </div>                </th>
                <th 
                  scope="col" 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('Unrealized Pl')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Unrealized P&L</span>
                    <SortIcon field="Unrealized Pl" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleSort('Unrealized Pl Pc')}
                >
                  <div className="flex items-center space-x-1">
                    <span>P&L %</span>
                    <SortIcon field="Unrealized Pl Pc" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"                   onClick={() => handleSort('Change Today')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Change Today</span>
                    <SortIcon field="Change Today" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPositions.map((position) => {
                const unrealizedPl = parseFloat(position['Unrealized Pl']);
                const unrealizedPlPc = parseFloat(position['Unrealized Pl Pc']);
                const changeToday = parseFloat(position['Change Today']);
                const side = formatSide(position.Side);
                
                return (
                  <tr key={position['Asset Id']} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {position.Symbol}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatNumber(position.Quantity, 6)}
                    </td>                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(position['Market Value'])}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(position['Current Price'])}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(position['Avg Entry Price'])}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        side === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {side.toUpperCase()}
                      </span>
                    </td>
                    <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      unrealizedPl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(unrealizedPl)}
                    </td>
                    <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      unrealizedPlPc >= 0 ? 'text-green-600' : 'text-red-600'                    }`}>
                      {formatPercentage(unrealizedPlPc)}
                    </td>
                    <td className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      changeToday >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(changeToday)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {sortedPositions.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500">No positions found.</p>
        </div>
      )}
    </div>
  );
}