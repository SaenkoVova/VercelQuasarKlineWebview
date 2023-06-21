import { api } from "boot/axios";
import { AxiosRequestConfig } from "axios";
import { useProcessable } from "src/composable/general/useProcessable";
import { OperationResultsEnum } from "src/utils/enums/general/OperationResultsEnum";
import { ExceptionsEnum } from "src/utils/enums/general/ExceptionsEnum";


interface IConstructor {
  baseUrl?: string;
}

export class AppApiService {
  private readonly baseUrl: string;

  public constructor(payload?: IConstructor) {
    this.baseUrl = payload?.baseUrl || api.defaults.baseURL || process.env.VUE_APP_USER_SERVICE_API_URL || "";
    if (!this.baseUrl) {
      const { completeProcess } = useProcessable();
      completeProcess({
        result: OperationResultsEnum.FAILED,
        message: ExceptionsEnum.BASE_URL_FOR_REQUEST_NOT_INSTALLED,
      });
    }
  }

  protected async axiosCall<T>(
    config: AxiosRequestConfig
  ): Promise<[null, T] | [unknown]> {
    try {
      config.baseURL = this.baseUrl;
      const { data } = await api.request<T>(config);
      return [null, data];
    } catch (e) {
      return [e];
    }
  }
}
