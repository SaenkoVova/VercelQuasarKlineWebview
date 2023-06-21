import { SocketStatesEnum, useSocketStore } from "stores/socket";
import { Subscription } from "webstomp-client";
import { StatisticSocketService } from "src/services/candles-service/StatisticSocketService";
import { ref } from "vue";

const isDisconnecting = ref(false);

export const useStatisticSocketSubscription = () => {
  const socketStore = useSocketStore();
  const unsubscribeFromStatisticSocketTopic = async (subscription: Subscription | null) => {
    isDisconnecting.value = true;
    if (socketStore.getStatisticSocketState !== SocketStatesEnum.CONNECTED) {
      isDisconnecting.value = false;
      return;
    }
    const response = await StatisticSocketService.getInstance();
    if (subscription) response[1]?.unsubscribeFromDestination(subscription.id);
    isDisconnecting.value = false;
  }

  return {
    unsubscribeFromStatisticSocketTopic,
    isDisconnecting,
  }
}
