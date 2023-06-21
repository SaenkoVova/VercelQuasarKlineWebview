import { Message, Subscription } from "webstomp-client";
import { AppSocketService } from "src/services/AppSocketService";
import { IGetStatisticResponse } from "src/types/statistic/IGetStatisticResponse";
import { ChartFramesEnum } from "src/utils/enums/statistic/ChartFramesEnum";
import { ICandle } from "src/types/statistic/ICandle";

export class StatisticSocketService extends AppSocketService {
  private static _instance: StatisticSocketService | null;

  private constructor() {
    super({
      baseUrl: process.env.VUE_APP_CANDLES_SERVICE_API_URL,
      debug: false
    });
  }

  public static async getInstance(): Promise<[null, StatisticSocketService | null] | [unknown]> {
    if (this._instance) {
      if (this._instance.appSocket.connected) {
        return [null, this._instance];
      } else {
        return [null, null];
      }
    }
    this._instance = new this();
    const error = await this._instance.connect();
    return error ? [error] : [null, this._instance];
  }

  public subscribeToUpdateStatistic(payload: { pair: string; partnerId: string; }, cb: (val: IGetStatisticResponse) => void): Subscription | null {
    if (!this.appSocket.connected) return null;
    console.log("Connected to", `/user/${payload.pair}_${payload.partnerId}/statistic/receive`);
    return this.appSocket.subscribe(
      `/user/${payload.pair}_${payload.partnerId}/statistic/receive`,
      (tick: Message) => {
        cb(JSON.parse(tick.body));
      }
    );
  }

  public subscribeToUpdateCandles(payload: { frame: ChartFramesEnum, pair: string, partnerId: string }, cb: (val: ICandle) => void): Subscription | null {
    if (!this.appSocket.connected) return null;
    return this.appSocket.subscribe(
      `/user/${payload.frame}_${payload.pair}_${payload.partnerId}/candles/receive`,
      (tick: Message) => {
        cb(JSON.parse(tick.body));
      }
    );
  }

  public static disconnect() {
    StatisticSocketService._instance = null;
  }
}
