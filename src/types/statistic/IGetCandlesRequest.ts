import { ChartFramesEnum } from "src/utils/enums/statistic/ChartFramesEnum";

export interface IGetCandlesRequest {
  from: number;
  to: number;
  frame: ChartFramesEnum;
  pair: string;
}
