import { KLineData } from "klinecharts";
import { ref } from "vue";

export const useChartMainIndicator = () => {

  const mainIndicator = ref<KLineData | null>(null)
  const showMainIndicator = ref(true);
  const change = ref(0);

  const calcChange = (currentCandle: KLineData, prevCandle: KLineData | null) => {
    const prevClose = (prevCandle?.close ?? currentCandle?.open);
    change.value = (currentCandle?.close - prevClose) / prevClose * 100;
  }

  return {
    mainIndicator,
    showMainIndicator,
    calcChange,
    change,
  }
}
