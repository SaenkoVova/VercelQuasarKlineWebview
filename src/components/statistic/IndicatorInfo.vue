<script setup lang="ts">

import { IChartIndicator } from "src/composable/statistic/useStatisticDefaultConfiguration";
import { IndicatorsEnum } from "src/utils/enums/statistic/IndicatorsEnum";
import { useNumberFormatter } from "src/composable/general/useNumberFormatter";
import { CurrenciesEnum } from "src/utils/enums/wallet/CurrenciesEnum";
//import { useOrderBook } from "src/composable/order-book/useOrderBook";

interface IProps {
  indicator: IChartIndicator;
  indicatorData: any | null;
  baseCurrency?: CurrenciesEnum;
  quotedCurrency?: CurrenciesEnum;
  change?: number;
}

const props = defineProps<IProps>();
const { formatNumberByDefault } = useNumberFormatter();
//const { getLastTradePriceUsdt } = useOrderBook();
</script>
<template>
  <p class="text-caption">
    <template
      v-if="props.indicator.shortName === IndicatorsEnum.MA|| props.indicator.shortName === IndicatorsEnum.EMA">
      <span v-for="item in props.indicator.subIndicators.filter(i => i.selected)" :key="item.label">
        {{ indicator.shortName }}({{formatNumberByDefault(+item.value)}}) <span :style="{ color: item.lineColor }">{{ formatNumberByDefault(indicatorData?.[item.label.toLowerCase()]) }}</span> &nbsp;
      </span>
    </template>
    <template v-if="props.indicator.shortName === IndicatorsEnum.BOLL">
      {{ props.indicator.shortName }}
      ({{ props.indicator.subIndicators.filter(i => i.value != undefined).map(i => i.value).join(", ") }})
      <span v-for="item in props.indicator.subIndicators.filter(i => i.selected && !i.notForCalc)" :key="item.label">
        {{ item.label }} <span :style="{ color: item.lineColor }">{{ formatNumberByDefault(indicatorData?.[item.label.toLowerCase()]) }}</span>&nbsp;
      </span>
    </template>
    <template v-if="props.indicator.shortName === IndicatorsEnum.VOL">
      {{ props.indicator.shortName }}
      ({{ props.baseCurrency }})
      <span :class="{ 'clr-positive': props.change > 0, 'clr-negative': props.change < 0 }">{{ formatNumberByDefault(indicatorData?.volume) }}</span>
      {{ props.indicator.shortName }}
      ({{ props.quotedCurrency }})
      <span :class="{ 'clr-positive': props.change > 0, 'clr-negative': props.change < 0 }">{{ formatNumberByDefault(indicatorData?.volume * 1 /*getLastTradePrice*/) }}</span> &nbsp;
      <span :style="{color: props.indicator.subIndicators.find(i => i.labelValue === 'ma1')?.lineColor}">{{ formatNumberByDefault(indicatorData?.ma1) }}</span> &nbsp;
      <span :style="{color: props.indicator.subIndicators.find(i => i.labelValue === 'ma2')?.lineColor}">{{ formatNumberByDefault(indicatorData?.ma2) }}</span>
    </template>
    <template v-if="props.indicator.shortName === IndicatorsEnum.MACD">
      {{ props.indicator.shortName }}
      ({{ props.indicator.subIndicators.filter(i => i.value != undefined).map(i => i.value).join(", ") }})
      <span v-for="item in props.indicator.subIndicators.filter(i => i.selected && !i.notForCalc)" :key="item.label">
        <span :style="{ color: item.lineColor }" :class="{ 'clr-positive': props.change > 0, 'clr-negative': props.change < 0 }">{{ formatNumberByDefault(indicatorData?.[item.label.toLowerCase()]) }}</span>&nbsp;
      </span>
    </template>
  </p>
</template>
