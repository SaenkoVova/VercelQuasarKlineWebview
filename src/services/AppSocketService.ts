// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import SockJs from "sockjs-client";
import Stomp, { Client, ConnectionHeaders, Frame } from "webstomp-client";
import { useEventBus } from "src/composable/general/useEventBus";
import { EventsEnum } from "src/utils/enums/general/EventsEnum";

interface IConstructor {
  baseUrl?: string;
  debug?: boolean;
  headers?: ConnectionHeaders;
}

export interface IConnectParams {
  headers?: ConnectionHeaders;
}

export class AppSocketService {
  appSocket: Client;

  protected constructor(payload?: IConstructor) {
    const connection = process.env.NODE_ENV === "development" ? "ws" : "wss";
    const socket = new SockJs(
      `${payload?.baseUrl || process.env.VUE_APP_API_URL}/${connection}`,
      undefined,
      {
        transportOptions: {
          headers: payload?.headers
        }
      }
    );
    this.appSocket = Stomp.over(socket, {
      debug: payload?.debug,
    });
  }

  protected async connect(payload?: IConnectParams): Promise<null | unknown> {
    return new Promise((resolve) => {
      this.appSocket.connect(
        payload?.headers || {},
        () => {
          resolve(null);
        },
        (error: Frame | CloseEvent) => {
          const { emit } = useEventBus();
          emit(EventsEnum.NEED_SOCKETS_RECONNECT)
          resolve(error);
        }
      );
    });
  }

  public unsubscribeFromDestination(payload: string) {
    if (this.appSocket?.connected) {
      this.appSocket.unsubscribe(payload);
    }
  }

  disconnect() {
    if (this.appSocket?.connected) {
      this.appSocket.disconnect();
    }
  }
}
