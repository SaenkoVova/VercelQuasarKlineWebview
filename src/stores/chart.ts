import { defineStore } from "pinia"
import {
  IChartIndicator,
  useStatisticDefaultConfiguration
} from "src/composable/statistic/useStatisticDefaultConfiguration";
import { Chart, IndicatorPolygonStyle, LineType, PolygonType, SmoothLineStyle } from "klinecharts";
import { IndicatorsEnum } from "src/utils/enums/statistic/IndicatorsEnum";

const { defaultConfig } = useStatisticDefaultConfiguration();

export const useChartStore = defineStore({
  id: "chart",
  state: () => ({
    indicators: (!!localStorage.getItem("chartIndicators") ? JSON.parse(localStorage.getItem("chartIndicators") as string) : defaultConfig) as IChartIndicator[],
    indicatorsVisible: true,
    subIndicatorsLabelsPositions: [] as { position: number; visible: boolean }[],
  }),
  getters: {
    getSubIndicatorsLabelsPositions(): { position: number; visible: boolean }[] {
      return this.subIndicatorsLabelsPositions;
    },
    getIndicatorsVisible(): boolean {
      return this.indicatorsVisible;
    },
    getSelectedIndicators(): IChartIndicator[] {
      return this.indicators.filter(i => i.selected);
    },
    getMajorIndicators(): IChartIndicator[] {
      return this.indicators.filter(i => i.isMajor);
    },
    getMajorSelectedIndicators(): IChartIndicator[] {
      return this.getMajorIndicators.filter((i) => i.selected);
    },
    getSubIndicators(): IChartIndicator[] {
      return this.indicators.filter(i => !i.isMajor);
    },
    getSubSelectedIndicators(): IChartIndicator[] {
      return this.getSubIndicators.filter((i) => i.selected);
    }
  },
  actions: {
    calcPanesHeight(chart: Chart | null) {
      const tmp: { position: number; visible: boolean }[] = [];
      this.getSubSelectedIndicators.forEach((value) => {
        tmp.push({
          position: chart?.getSize(value.shortName)?.top || 0,
          visible: true,
        });
      });
      this.subIndicatorsLabelsPositions = [...tmp];
    },
    addAllSelectedIndicatorsToChart(chart: Chart | null) {
      this.getSelectedIndicators.forEach(i => {
        const calcParams: number[] = [];
        const lines: SmoothLineStyle[] = [];
        const circles: IndicatorPolygonStyle[] = [];
        i.subIndicators.forEach(i => {
          if (i.value && !i.notForCalc) calcParams.push(+i.value);
          if (i.lineColor != undefined && i.lineWidth != undefined) {
            lines.push({
              style: LineType.Solid,
              smooth: false,
              size: i.lineWidth,
              dashedValue: [2, 2],
              color: i.lineColor
            });
          }
          if (i.circleColor) {
            circles.push({
              style: PolygonType.StrokeFill,
              borderStyle: LineType.Dashed,
              borderSize: 1,
              borderDashedValue: [2, 2],
              upColor: i.circleColor,
              downColor: i.circleColor,
              noChangeColor: i.circleColor
            })
          }
        });
        chart?.createIndicator({
          visible: true,
          name: i.shortName,
          shortName: i.shortName,
          calcParams,
          styles: { lines, circles },
        }, true, { id: i.isMajor ? "candle_pane" : i.shortName });
      });
      setTimeout(() => {
        this.calcPanesHeight(chart);
      }, 0)
    },
    initIndicator(chart: Chart | null, shortName: IndicatorsEnum | null, isOverride: boolean) {
      const indicator = this.indicators.find(i => i.shortName === shortName);
      if (!indicator) return false;
      const calcParams: number[] = [];
      const lines: SmoothLineStyle[] = [];
      const circles: IndicatorPolygonStyle[] = [];
      indicator.subIndicators.forEach(i => {
        if (i.value && !i.notForCalc) calcParams.push(+i.value);
        if (i.lineColor != undefined && i.lineWidth != undefined) {
          lines.push({
            style: LineType.Solid,
            smooth: true,
            size: i.lineWidth,
            dashedValue: [2, 2],
            color: i.lineColor
          })
        }
        if (i.circleColor) {
          circles.push({
            style: PolygonType.StrokeFill,
            borderStyle: LineType.Dashed,
            borderSize: 1,
            borderDashedValue: [2, 2],
            upColor: i.circleColor,
            downColor: i.circleColor,
            noChangeColor: i.circleColor
          })
        }
      });
      if (!isOverride) {
        chart?.createIndicator({
          visible: true,
          name: indicator.shortName,
          shortName: indicator.shortName,
          calcParams,
          styles: { lines, circles }
        }, true,{ id: indicator.isMajor ? "candle_pane" : indicator.shortName });
      } else {
        chart?.overrideIndicator({
          visible: true,
          name: indicator.shortName,
          shortName: indicator.shortName,
          calcParams,
          styles: { lines, circles }
        },indicator.isMajor ? "candle_pane" : indicator.shortName);
      }
      localStorage.setItem("chartIndicators", JSON.stringify(this.indicators));
      return true;
    },
    removeIndicatorFromChart(chart: Chart | null, shortName: IndicatorsEnum, isMajor: boolean) {
      chart?.removeIndicator(isMajor ? "candle_pane" : shortName, shortName);
      localStorage.setItem("chartIndicators", JSON.stringify(this.indicators));
    }
  },
});
