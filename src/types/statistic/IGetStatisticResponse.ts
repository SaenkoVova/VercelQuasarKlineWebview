export interface IGetStatisticResponse {
  open24Price: number;
  actualPrice?: number;
  lastPrice?: number;
  changePriceValue: number;
  changePricePercent: number;
  highPrice: number;
  lowPrice: number;
  basicVolume: number;
  quotedVolume: number;
}
