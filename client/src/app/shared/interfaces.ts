export interface IUser {
  email: string;
  password: string;
}

export interface ICategory {
  name: string;
  imageSrc?: string;
  user?: string;
  _id?: string;
}

export interface IPosition {
  name: string;
  cost: number;
  category: string;
  user?: string;
  _id?: string;
  quantity?: number; // for use on Frontend only
}

export interface IOrder {
  list: IOrderPosition[];
  order?: number;
  date?: Date;
  user?: string;
  _id?: string;
}

export interface IOrderPosition {
  name: string;
  cost: number;
  quantity?: number;
  _id?: string; // for use on Frontend only (don't send to backend)
}

export interface IResponseMessage {
  message: string;
}

export interface IHistoryFilter {
  start?: Date;
  end?: Date;
  order?: number;
}

export interface IOverviewPage {
  gain: IOverviewPageItem;
  orders: IOverviewPageItem;
}

export interface IOverviewPageItem {
  percent: number;
  compare: number;
  yesterday: number;
  isHigher: boolean;
}

export interface IAnalyticsPage {
  average: number;
  chart: IAnalyticsChartItem[];
}

export interface IAnalyticsChartItem {
  label: string;
  order: number;
  gain: number;
}
