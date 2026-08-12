export interface DataPoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface Query {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface ActiveMetrics {
  clicks: boolean;
  impressions: boolean;
  ctr: boolean;
  position: boolean;
}
