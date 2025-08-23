// Type definitions for the Analysis data structures

export interface ChartImage {
  path: string;
  title: string;
  mimetype: string;
  size: number;
  width: number;
  height: number;
  id: string;
  signedPath: string;
  thumbnails?: {
    tiny?: { signedPath: string };
    small?: { signedPath: string };
    card_cover?: { signedPath: string };
  };
}

export interface Decision {
  symbol: string;
  analysis_date: string;
  support: number;
  resistance: number;
  primary_action: string;
  new_trade?: any;
}

export interface ApiAnalysis {
  Id: number;
  "Analysis Id": string;
  "Date time": string;
  Ticker: string;
  Analysis: string;
  "Trade Type": string;
  Decision: Decision;
  Approve: boolean;
  Chart: ChartImage[];
  "Analysis Prompt": string;
  "3 Month Chart": ChartImage[];
  Date: string;
  Remarks?: string;
}

export interface ApiResponse {
  list: ApiAnalysis[];
  pageInfo: {
    totalRows: number;
    page: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

// Transformed data structure used by components
export interface Analysis {
  id: string;
  recordId: number; // The actual Id from the database record
  datetime: string;
  symbol: string;
  exchange: string;
  trade_type: string;
  analysis_content: string;
  analysis_prompt: string;
  decision: any;
  chart_3month?: string;
  chart_1year?: string;
  remarks?: string;
}
