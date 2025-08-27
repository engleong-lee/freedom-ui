import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
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
    
    // Optional: Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchPositions, 30000);
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
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
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
    if (sortField !== field) return <ArrowUpDown size={14} />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const headerClasses = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100';
  const cellClasses = 'px-6 py-4 whitespace-nowrap text-sm';

  // Clean up side value for display
  const formatSide = (side: string) => {
    return side.replace('PositionSide.', '').toLowerCase();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Positions</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading positions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Positions</h2>
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Positions</h2>
        <span className="text-sm text-gray-500">
          {positions.length} position{positions.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className={headerClasses} onClick={() => handleSort('Symbol')}>
                  <div className="flex items-center space-x-1">
                    <span>Symbol</span>
                    <SortIcon field="Symbol" />
                  </div>
                </th>
                <th scope="col" className={headerClasses} onClick={() => handleSort('Quantity')}>
                  <div className="flex items-center space-x-1">
                    <span>Quantity</span>
                    <SortIcon field="Quantity" />
                  </div>
                </th>
                <th scope="col" className={headerClasses} onClick={() => handleSort('Market Value')}>
                  <div className="flex items-center space-x-1">
                    <span>Market Value</span>
                    <SortIcon field="Market Value" />
                  </div>
                </th>
                <th scope="col" className={headerClasses} onClick={() => handleSort('Current Price')}>
                  <div className="flex items-center space-x-1">
                    <span>Current Price</span>
                    <SortIcon field="Current Price" />
                  </div>
                </th>
                <th scope="col" className={headerClasses} onClick={() => handleSort('Avg Entry Price')}>
                  <div className="flex items-center space-x-1">
                    <span>Avg Entry Price</span>
                    <SortIcon field="Avg Entry Price" />
                  </div>
                </th>
                <th scope="col" className={headerClasses} onClick={() => handleSort('Side')}>
                  <div className="flex items-center space-x-1">
                    <span>Side</span>
                    <SortIcon field="Side" />
                  </div>
                </th>
                <th scope="col" className={headerClasses} onClick={() => handleSort('Unrealized Pl')}>
                  <div className="flex items-center space-x-1">
                    <span>Unrealized P&L</span>
                    <SortIcon field="Unrealized Pl" />
                  </div>
                </th>
                <th scope="col" className={headerClasses} onClick={() => handleSort('Unrealized Pl Pc')}>
                  <div className="flex items-center space-x-1">
                    <span>Unrealized P&L %</span>
                    <SortIcon field="Unrealized Pl Pc" />
                  </div>
                </th>
                <th scope="col" className={headerClasses} onClick={() => handleSort('Change Today')}>
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
                    <td className={`${cellClasses} font-medium text-gray-900`}>
                      {position.Symbol}
                    </td>
                    <td className={cellClasses}>
                      {formatNumber(position.Quantity, 6)}
                    </td>
                    <td className={cellClasses}>
                      {formatCurrency(position['Market Value'])}
                    </td>
                    <td className={cellClasses}>
                      {formatCurrency(position['Current Price'])}
                    </td>
                    <td className={cellClasses}>
                      {formatCurrency(position['Avg Entry Price'])}
                    </td>
                    <td className={cellClasses}>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        side === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {side.toUpperCase()}
                      </span>
                    </td>
                    <td className={`${cellClasses} font-medium ${
                      unrealizedPl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(unrealizedPl)}
                    </td>
                    <td className={`${cellClasses} font-medium ${
                      unrealizedPlPc >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(unrealizedPlPc)}
                    </td>
                    <td className={`${cellClasses} font-medium ${
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