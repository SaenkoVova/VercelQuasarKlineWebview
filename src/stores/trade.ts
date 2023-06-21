import { defineStore } from "pinia";
import { ChartFramesEnum } from "src/utils/enums/statistic/ChartFramesEnum";

export const useTradeStore = defineStore({
  id: "trade",
  state: () => ({
    frame: ChartFramesEnum.MINUTE,
  }),
  getters: {
    getChartFrame(): ChartFramesEnum {
      return this.frame;
    },
  },
  actions: {
    setFrame(frame: ChartFramesEnum) {
      this.frame = frame;
    },
  },
});
