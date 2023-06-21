import { SocketStatesEnum, useSocketStore } from "stores/socket";
import { StatisticSocketService } from "src/services/candles-service/StatisticSocketService";
import { ref, watch } from "vue";
import { useEventBus } from "src/composable/general/useEventBus";
import { EventsEnum } from "src/utils/enums/general/EventsEnum";

export const useStatisticSocketConnection = () => {
  const socketStore = useSocketStore();
  const { bus } = useEventBus();
  const connecting = ref(false);
  const connectStatisticSocket = async (): Promise<null | StatisticSocketService> => {
    if (socketStore.getStatisticSocketState === SocketStatesEnum.CONNECTED) {
      const response = await StatisticSocketService.getInstance();
      return response[1] || null;
    }
    if (socketStore.getStatisticSocketState === SocketStatesEnum.CONNECTING) return null;
    socketStore.setStatisticSocketState(SocketStatesEnum.CONNECTING);
    const [error, response] = await StatisticSocketService.getInstance();
    if (error || !response) {
      socketStore.setStatisticSocketState(SocketStatesEnum.OFF);
      return null;
    }
    socketStore.setStatisticSocketState(SocketStatesEnum.CONNECTED);
    return response;
  }

  watch(() => bus.value.get(EventsEnum.NEED_SOCKETS_RECONNECT), async () => {
    if (connecting.value) return ;
    connecting.value = true;
    socketStore.setStatisticSocketState(SocketStatesEnum.OFF);
    StatisticSocketService.disconnect();
    await connectStatisticSocket();
    connecting.value = false;
  });

  return {
    connectStatisticSocket
  }
}
