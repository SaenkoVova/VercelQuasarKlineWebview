import { AppApiService } from "src/services/AppApiService";
import { ICandle } from "src/types/statistic/ICandle";
import { IGetCandlesRequest } from "src/types/statistic/IGetCandlesRequest";
import { IGetStatisticRequest } from "src/types/statistic/IGetStatisticRequest";
import { IGetStatisticResponse } from "src/types/statistic/IGetStatisticResponse";

class CandlesService extends AppApiService {
  public constructor() {
    super({
      baseUrl: `${process.env.VUE_APP_CANDLES_SERVICE_API_URL}/candle`
    });
  }

  async getCandles(
    payload: IGetCandlesRequest
  ): Promise<[null, ICandle[]] | [unknown]> {
    return this.axiosCall<ICandle[]>({
      method: "get",
      url: "",
      params: payload,
    });
  }

  async getStatistic(
    payload: IGetStatisticRequest
  ): Promise<[null, IGetStatisticResponse] | [unknown]> {
    return this.axiosCall<IGetStatisticResponse>({
      method: "get",
      url: "/statistic",
      params: payload,
    });
  }
}

export const candlesService = new CandlesService();
