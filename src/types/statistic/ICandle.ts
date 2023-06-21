import { ChartFramesEnum } from "src/utils/enums/statistic/ChartFramesEnum";

export interface ICandle {
  closePrice: number;
  created: number;
  frame: ChartFramesEnum;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  pairName: string;
  partnerId: string;
  volume: number;
}
