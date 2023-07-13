<script setup lang="ts">
import { candlesService } from "src/services/candles-service/CandlesService";
import { usePairStore } from "stores/pair";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ChartFramesEnum } from "src/utils/enums/statistic/ChartFramesEnum";
import { useTradeStore } from "stores/trade";
import { ActionType, Chart, init, KLineData } from "klinecharts";
import { useChartStyleConfig } from "src/composable/statistic/useChartStyleConfig";
import { useI18n } from "vue-i18n";
import { ICandle } from "src/types/statistic/ICandle";
import { useStatisticSocketConnection } from "src/composable/statistic/useStatisticSocketConnection";
import { useStatisticSocketSubscription } from "src/composable/statistic/useStatisticSocketSubscription";
import { Subscription } from "webstomp-client";
import { SocketStatesEnum, useSocketStore } from "stores/socket";
import StatisticConfig from "components/statistic/StatisticConfig.vue";
import { useChartMainIndicator } from "src/composable/statistic/useChartMainIndicator";
import { useTimeFormatter } from "src/composable/general/useTimeFormatter";
import { useNumberFormatter } from "src/composable/general/useNumberFormatter";
import { useChartStore } from "stores/chart";
import { useCrosshairChange } from "src/composable/statistic/useCrosshairChange";
import AnalyticsSvg from "components/icons/AnalyticsSvg.vue";
import IndicatorInfo from "components/statistic/IndicatorInfo.vue";
import FullscreenSvg from "components/icons/FullscreenSvg.vue";
import SettingsSvg from "components/icons/SettingsSvg.vue";

const { style, priceMarkVisible, setPriceMarkVisible, isFullScreen } = useChartStyleConfig();
const {
  mainIndicator,
  showMainIndicator,
  calcChange,
  change
} = useChartMainIndicator();
const { t } = useI18n();
const { connectStatisticSocket } = useStatisticSocketConnection();
const { timestampToLocaleDateTimeRoRo } = useTimeFormatter();
const { formatNumberByDefault, numberToPercentFormat } = useNumberFormatter();
const { unsubscribeFromStatisticSocketTopic } = useStatisticSocketSubscription();
const { hoveredBarData } = useCrosshairChange();

const pairStore = usePairStore();
const chartStore = useChartStore();
const tradeStore = useTradeStore();
const socketStore = useSocketStore();
let chart: Chart | null = null;
let lastTimestamp = 0;
let statisticSocketSubscription: Subscription | null = null;
const statisticConfigDialogVisible = ref(false);

const chartFrames = [
  {
    text: "1m",
    value: ChartFramesEnum.MINUTE,
  },
  {
    text: "5m",
    value: ChartFramesEnum.FIVE_MINUTE,
  },
  {
    text: "15m",
    value: ChartFramesEnum.FIFTEEN_MINUTE,
  },
  {
    text: "1h",
    value: ChartFramesEnum.HOUR,
  },
  {
    text: "4h",
    value: ChartFramesEnum.FOUR_HOUR,
  },
  {
    text: "1d",
    value: ChartFramesEnum.DAY,
  },
  {
    text: "1w",
    value: ChartFramesEnum.WEEK,
  },
];

const calcLoadingInterval = (from: number) => {
  if (!from) from = Date.now();
  const date = new Date(from);
  switch (tradeStore.getChartFrame) {
    case ChartFramesEnum.MINUTE:
      date.setHours(date.getHours() - 5);
      break;
    case ChartFramesEnum.FIVE_MINUTE:
      date.setHours(date.getHours() - 20);
      break;
    case ChartFramesEnum.FIFTEEN_MINUTE:
      date.setHours(date.getHours() - 50);
      break;
    case ChartFramesEnum.HOUR:
      date.setHours(date.getHours() - 120);
      break;
    case ChartFramesEnum.FOUR_HOUR:
      date.setHours(date.getHours() - 600);
      break;
    case ChartFramesEnum.DAY:
      date.setDate(date.getDate() - 100);
      break;
    case ChartFramesEnum.WEEK:
      date.setDate(date.getDate() - 600);
      break;
  }
  return date.getTime();
};
const loadData = async (from: number, to: number) => {
  const response = await candlesService.getCandles({
    pair: pairStore.getPairInBinanceFormat,
    frame: tradeStore.getChartFrame,
    from,
    to,
  });
  return [
    ...(response[1] || [])
      .map((candle) => {
        return {
          timestamp: candle.created,
          open: candle.openPrice,
          close: candle.closePrice,
          high: candle.highPrice,
          low: candle.lowPrice,
          volume: candle.volume,
        };
      })
      .reverse(),
  ] as KLineData[];
};
const buildChart = async () => {
  const data = await loadData(0, calcLoadingInterval(0));
  const lastCandle = data[data.length - 1];
  calcChange(lastCandle, data[data.length - 2]);
  mainIndicator.value = lastCandle;
  chart?.applyNewData(data);
  chart?.scrollToTimestamp(data[data.length - 1]?.timestamp);
  chart?.loadMore(async (timestamp) => {
    if (!timestamp || timestamp === lastTimestamp) return;
    lastTimestamp = timestamp;
    const data = await loadData(timestamp, calcLoadingInterval(timestamp));
    chart?.applyMoreData(data);
  });
  subscribeToUpdateCandles().then();
}

const subscribeToUpdateCandles = async () => {
  const instance = await connectStatisticSocket();
  if (!instance) return;
  statisticSocketSubscription = instance.subscribeToUpdateCandles({
    pair: pairStore.getPairInBinanceFormat,
    frame: tradeStore.getChartFrame,
    partnerId: process.env.VUE_APP_PARTNER_ID as string,
  }, (val: ICandle) => {
    if (val.pairName !== pairStore.getPairInBinanceFormat) return ;
    chart?.updateData({
      timestamp: val.created,
      open: val.openPrice,
      close: val.closePrice,
      high: val.highPrice,
      low: val.lowPrice,
      volume: val.volume,
    });
  });
};

watch(() => isFullScreen.value,() => {
  setTimeout(() => {
    chart?.resize();
    chartStore.calcPanesHeight(chart);
  }, 100)
});

watch(
  () => socketStore.getStatisticSocketState, (value) => {
    if (value === SocketStatesEnum.CONNECTED) subscribeToUpdateCandles();
  }
);

watch(
  () => tradeStore.getChartFrame,
  () => {
    buildChart();
    subscribeToUpdateCandles();
  }
);

watch(
  () => pairStore.getPair,
  async () => {
    await unsubscribeFromStatisticSocketTopic(statisticSocketSubscription);
    setPricePrecision();
    await buildChart();
  }
);

const setPricePrecision = () => {
  const pairPrice = 2;
  chart?.setPriceVolumePrecision(pairPrice > 1 ? 2 : 8, pairPrice > 1 ? 2 : 8);
}

onMounted(async () => {
  chart = init("chart");
  chartStore.addAllSelectedIndicatorsToChart(chart);
  chart?.setStyles(style);
  await buildChart();
  chart?.subscribeAction(ActionType.OnCrosshairChange, (val) => {
    calcChange(val.kLineData, chart?.getDataList()[val.dataIndex - 1] || null);
    mainIndicator.value = val.kLineData;
    hoveredBarData.value = val;
  });
  chart?.subscribeAction(ActionType.OnPaneDrag, () => {
    chartStore.calcPanesHeight(chart);
  });
  window.addEventListener("message", (data) => {

    if (typeof data.data === "string") {
      pairStore.setPair(data.data);
    }
  })
});

onBeforeUnmount(async () => {
  await unsubscribeFromStatisticSocketTopic(statisticSocketSubscription);
});
</script>
<template>
  <q-card class="chart" flat square :class="{'fullscreen': isFullScreen}">
    <div class="flex no-wrap chart__head">
      <p class="text-xs clr-secondary">{{ t("trade-phrase-25") }}</p>
      <q-btn-group class="chart__btns q-ml-xs-none  q-ml-sm-xs " flat>
        <q-btn
          :label="t(item.text)"
          v-for="item in chartFrames"
          :key="item.value"
          :class="{ active: item.value === tradeStore.getChartFrame }"
          @click="tradeStore.setFrame(item.value)"
          flat
          class="chart-btn clr-secondary"
        />
        <q-btn flat class="chart-btn chart-btn--icon q-ml-xs-auto q-ml-sm-md" @click="statisticConfigDialogVisible = true">
          <analytics-svg/>
        </q-btn>

        <!--        <q-btn flat class="chart-btn chart-btn&#45;&#45;icon" >-->
        <!--          <bookmark-svg/>-->
        <!--        </q-btn>-->

        <q-btn flat class="chart-btn chart-btn--icon" >
          <settings-svg />
          <q-tooltip class="secondary-tooltip" anchor="top middle" self="top middle" :offset="[0, 25]">
            More Settings
          </q-tooltip>
          <q-menu class="chart-btn-drop">
            <q-list style="min-width: 160px">
              <q-item class="chart-btn-drop__item" active-class="active" :active="priceMarkVisible" @click="setPriceMarkVisible(chart)"
                      clickable v-close-popup>
                <q-item-section>Market price line</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-btn-group>

      <q-btn-group class="chart__btns q-ml-auto" flat>
        <q-btn class="chart-btn clr-secondary" no-caps :class="{active: true}" flat>
          Original
        </q-btn>
        <!--        <q-btn class="chart-btn clr-secondary" no-caps flat>-->
        <!--          Trading View-->
        <!--        </q-btn>-->
        <!--        <q-btn class="chart-btn clr-secondary" no-caps flat>-->
        <!--          Depth-->
        <!--        </q-btn>-->

        <q-btn flat class="chart-btn chart-btn--icon q-ml-xs q-ml-sm-md" @click="isFullScreen = !isFullScreen">
          <fullscreen-svg />
        </q-btn>

        <!--        <q-btn flat class="chart-btn chart-btn&#45;&#45;icon" >-->
        <!--          <function-svg/>-->
        <!--        </q-btn>-->

      </q-btn-group>
    </div>


    <div class="relative-position chart-wrap" id="chart" :style="{ height: isFullScreen ? '100%' : '480px' }">
      <div class="absolute-center">
        <h1 class="ft-extrabold" style="color: #1C1D21">Flexy</h1>
      </div>
      <div class="absolute-top-left chart__options clr-secondary ">

        <div class="flex items-center">
          <q-btn
            style="z-index: 3"
            flat
            size="sm"
            class="block text-caption relative-position"
            :icon="!showMainIndicator ? 'arrow_right' : 'arrow_drop_down'"
            @click="showMainIndicator = !showMainIndicator"
          />
          <p class="text-caption" v-if="showMainIndicator">
            {{
              tradeStore.getChartFrame === ChartFramesEnum.MINUTE ||
              tradeStore.getChartFrame === ChartFramesEnum.FIVE_MINUTE ||
              tradeStore.getChartFrame === ChartFramesEnum.FIFTEEN_MINUTE
                ? timestampToLocaleDateTimeRoRo(mainIndicator?.timestamp, { hour: "2-digit", minute: "2-digit", year: "numeric", month: "2-digit", day: "2-digit", })
                : tradeStore.getChartFrame === ChartFramesEnum.HOUR ||
                tradeStore.getChartFrame === ChartFramesEnum.FOUR_HOUR
                  ? timestampToLocaleDateTimeRoRo(mainIndicator?.timestamp, { hour: "2-digit", year: "numeric", month: "2-digit", day: "2-digit", minute: "2-digit" })
                  : tradeStore.getChartFrame === ChartFramesEnum.DAY ||
                  tradeStore.getChartFrame === ChartFramesEnum.WEEK
                    ? timestampToLocaleDateTimeRoRo(mainIndicator?.timestamp, { year: "numeric", month: "2-digit", day: "2-digit", })
                    : timestampToLocaleDateTimeRoRo(mainIndicator?.timestamp)
            }}
            Open: <span :class="{'clr-negative': change < 0, 'clr-positive': change > 0}">{{ formatNumberByDefault(mainIndicator?.open) }}</span>
            Max: <span :class="{'clr-negative': change < 0, 'clr-positive': change > 0}">{{ formatNumberByDefault(mainIndicator?.high) }}</span>
            Min: <span :class="{'clr-negative': change < 0, 'clr-positive': change > 0}">{{ formatNumberByDefault(mainIndicator?.low) }}</span>
            Close: <span :class="{'clr-negative': change < 0, 'clr-positive': change > 0}">{{ formatNumberByDefault(mainIndicator?.close) }}</span>
            Change: <span :class="{'clr-negative': change < 0, 'clr-positive': change > 0}">{{ numberToPercentFormat(change) }} %</span>
            Amp: <span :class="{'clr-negative': change < 0, 'clr-positive': change > 0}">{{ numberToPercentFormat((mainIndicator?.high / mainIndicator?.low - 1) * 100) }} %</span>
          </p>
        </div>
        <div class="flex items-center">
          <q-btn
            style="z-index: 10"
            flat
            size="sm"
            :icon="!chartStore.indicatorsVisible ? 'arrow_right' : 'arrow_drop_down'"
            @click="chartStore.indicatorsVisible = !chartStore.indicatorsVisible"
          />
          <div v-if="chartStore.indicatorsVisible">
            <indicator-info
              v-for="item in chartStore.getMajorSelectedIndicators"
              :indicator="item"
              :indicator-data="hoveredBarData?.indicatorData.candle_pane[item.shortName] || null"
              :key="item.shortName" />
          </div>
        </div>
      </div>
      <div class="absolute flex items-center clr-secondary" v-for="(item, index) in chartStore.getSubSelectedIndicators" :key="index" :style="{'z-index': 10, top: `${chartStore.getSubIndicatorsLabelsPositions[index]?.position}px`}">
        <q-btn
          style="z-index: 10"
          flat
          size="sm"
          :icon="chartStore.getSubIndicatorsLabelsPositions[index]?.visible ? 'arrow_right' : 'arrow_drop_down'"
          @click="chartStore.getSubIndicatorsLabelsPositions[index] && (chartStore.getSubIndicatorsLabelsPositions[index].visible = !chartStore.getSubIndicatorsLabelsPositions[index]?.visible)"
        />
        <div>
          <indicator-info
            v-if="chartStore.getSubIndicatorsLabelsPositions[index]?.visible"
            :base-currency="pairStore.getBaseCurrency"
            :quoted-currency="pairStore.getQuotedCurrency"
            :indicator="item"
            :indicator-data="hoveredBarData?.indicatorData[item.shortName][item.shortName] || null"
            :change="change"
            :key="item.shortName" />
        </div>
      </div>
    </div>
    <q-dialog class="app-dialog chart-dialog" persistent v-model="statisticConfigDialogVisible">
      <q-card class="app-dialog__content">
        <q-btn flat v-close-popup class="app-dialog__close" />
        <statistic-config :chart="chart" />
      </q-card>

    </q-dialog>
  </q-card>
</template>

<style scoped lang="scss">
@import "~src/css/components/statistic/candles-chart";
</style>
