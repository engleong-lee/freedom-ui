// API utility functions for fetching analysis data

import { ApiResponse, Analysis } from '../types/analysis';

const API_BASE_URL = import.meta.env.VITE_NOCODB_API_BASE_URL;
const TABLE_ID = import.meta.env.VITE_NOCODB_API_TABLE_ID;
const VIEW_ID = import.meta.env.VITE_NOCODB_API_VIEW_ID;
const API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN;

// Validate required environment variables
if (!API_BASE_URL) {
  throw new Error('VITE_NOCODB_API_BASE_URL environment variable is not set');
}
if (!TABLE_ID) {
  throw new Error('VITE_NOCODB_API_TABLE_ID environment variable is not set');
}
if (!VIEW_ID) {
  throw new Error('VITE_NOCODB_API_VIEW_ID environment variable is not set');
}
if (!API_TOKEN) {
  throw new Error('VITE_NOCODB_API_TOKEN environment variable is not set');
}

export async function fetchAnalysesByDate(date: string): Promise<Analysis[]> {
  const apiUrl = `${API_BASE_URL}/api/v2/tables/${TABLE_ID}/records?offset=0&where=(Date time,eq,exactDate,${date})&viewId=${VIEW_ID}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xc-token': API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    // Transform API data to Analysis format
    return data.list.map(item => {
      // Parse ticker to get symbol and exchange
      const [symbol, exchange] = item.Ticker.split(':');
      
      return {
        id: item["Analysis Id"],
        recordId: item.Id, // The actual database record Id
        datetime: item["Date time"],
        symbol: symbol,
        exchange: exchange || 'NASDAQ',
        trade_type: item["Trade Type"],
        analysis_content: item.Analysis,
        analysis_prompt: item["Analysis Prompt"],
        decision: item.Decision,
        chart_3month: item["3 Month Chart"]?.[0]?.path,
        chart_1year: item.Chart?.[0]?.path,
        remarks: item.Remarks || ''
      };
    });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    throw error;
  }
}

export function getImageUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  
  // If path is already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Otherwise, prepend the base URL
  return `${API_BASE_URL}/${path}`;
}

export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function updateRemarks(recordId: number, remarks: string): Promise<void> {
  const apiUrl = `${API_BASE_URL}/api/v2/tables/${TABLE_ID}/records`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'xc-token': API_TOKEN,
      },
      body: JSON.stringify([
        {
          "Id": recordId,
          "Remarks": remarks
        }
      ])
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to update remarks: ${response.status} ${response.statusText}`);
    }

    // Log success for debugging
    console.log('Remarks updated successfully for record Id:', recordId);
  } catch (error) {
    console.error('Error updating remarks:', error);
    throw error;
  }
}
