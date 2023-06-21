<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useChartStore } from "stores/chart";
import {
  IChartIndicator,
  useStatisticDefaultConfiguration
} from "src/composable/statistic/useStatisticDefaultConfiguration";
import { IndicatorsEnum } from "src/utils/enums/statistic/IndicatorsEnum";
import { Chart } from "klinecharts";
import ArrowNext from "components/icons/ArrowNext.vue";

interface IProps {
  indicatorName?: IndicatorsEnum;
  chart: Chart | null;
}

const props = defineProps<IProps>();
const tab = ref<"sub" | "major">("major");
const chartStore = useChartStore();
const selectedIndicator = ref<IChartIndicator | null>(null);
const { barTypes } = useStatisticDefaultConfiguration();

const indicatorsList = computed(() => {
  switch (tab.value) {
    case "sub": return chartStore.getSubIndicators;
  }
  return chartStore.getMajorIndicators;
});

const toggleIndicator = (selected: boolean, shortName: IndicatorsEnum) => {
  selected ? chartStore.initIndicator(props.chart, shortName, false) : chartStore.removeIndicatorFromChart(props.chart, shortName, selectedIndicator.value?.isMajor || false);
}

watch(() => tab.value, (value) => {
  switch (value) {
    case "major": selectedIndicator.value = chartStore.getMajorIndicators[0];break;
    case "sub": selectedIndicator.value = chartStore.getSubIndicators[0];break;
  }
});

onMounted(() => {
  selectedIndicator.value = indicatorsList.value.find(i => i.shortName === props.indicatorName) || indicatorsList.value[0];
});
</script>
<template>
  <q-card class="transparent config-card" flat square>
    <div class="flex config-card__head justify-between q-mb-sm-lg q-pb-sm">
      <p class="config-card__title ft-bold">Indicator</p>

      <q-tabs v-model="tab" dense align="left" active-class="active">
        <q-tab class="secondary-btn" name="major" label="Major"  />
        <q-tab class="secondary-btn" name="sub" label="Sub" />
      </q-tabs>
    </div>

    <q-card-section class="q-pa-none">

      <div class="row">
        <div class="col-12 col-md-3">
          <q-list class="config-side">
            <q-item
              clickable
              v-for="item in indicatorsList"
              :key="item"
              class="config-side__item"
              @click="selectedIndicator = item;"
              :active="selectedIndicator?.name === item.name">
              <q-checkbox color="primary"
                          class="app-checkbox"
                          checked-icon="img:assets/checkbox.svg" v-model="item.selected" @update:model-value="toggleIndicator($event, item.shortName)">
               <div class="flex no-wrap items-center w-100">
                 <span @click.stop="selectedIndicator = item">{{ item.shortName }}</span>
                 <div class="app-checkbox__arrow q-ml-auto">
                   <arrow-next/>
                 </div>
               </div>
              </q-checkbox>
            </q-item>
          </q-list>
        </div>
        <div class="col-12 col-md-9">
          <q-card class="transparent config-card__content" flat square>
            <q-card-section class="config-card__wrap">
              <p class="ft-semibold config-card__text">{{ selectedIndicator?.shortName }} - {{ selectedIndicator?.name }}</p>
              <q-list>
                <div class="row q-gutter-md items-center q-my-sm" v-for="item in selectedIndicator?.subIndicators || []" :key="item.label">
                  <div class="col-4 col-sm-3">
                    <q-checkbox color="primary"
                                class="app-checkbox clr-secondary"
                                checked-icon="img:assets/checkbox.svg"
                                v-if="item.selected != undefined" :label="item.label" v-model="item.selected" @update:model-value="chartStore.initIndicator(chart, selectedIndicator?.shortName || null, true)" />
                    <p v-else>{{ item.label }}</p>
                  </div>
                  <div class="col-6 col-sm-3" v-if="item.value != undefined">
                    <q-input class="page-input" v-model="item.value" outlined
                             @update:model-value="chartStore.initIndicator(chart, selectedIndicator?.shortName || null, true)" />
                  </div>
<!--                  <div class="col-2" v-if="item.dimension">-->
<!--                    <q-select filled :options="dimensions" v-model="item.dimension" />-->
<!--                  </div>-->
                  <div class="col-6 col-sm-3" v-if="item.barType">
                    <q-select
                      class="app-select app-select--sm"
                      :options="barTypes"
                      v-model="item.barType"
                      transition-show="none"
                      transition-hide="none"
                      transition-duration="0" />
                  </div>
                  <div class="col-8 col-sm-3" v-if="item.lineWidth">
                    <q-select
                      transition-show="none"
                      transition-hide="none"
                      transition-duration="0"
                      class="app-select app-select--sm"
                      :options="[1, 2, 3, 4]"
                      dropdown-icon="img: assets/select-drop.svg"
                      popup-content-class="app-select-drop app-select-drop--sm"
                      v-model="item.lineWidth"
                      @update:model-value="chartStore.initIndicator(chart, selectedIndicator?.shortName || null, true)">
                      <template #selected-item>
                        <div :style="{ width: '40%', height: `${item.lineWidth}px`, background: '#fff'}"  />
                      </template>
                      <template #option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section>
                            <div :style="{height: `${scope.opt}px`, background: '#fff'}"  />
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-auto" v-if="item.lineColor || item.circleColor">
                    <q-btn :style="{background: item.lineColor || item.background || item.circleColor, width: '50px', height: '50px'}" push size="md">
                      <q-menu>
                        <q-color
                          v-if="item.lineColor"
                          v-model="item.lineColor"
                          @update:model-value="chartStore.initIndicator(chart, selectedIndicator?.shortName || null, true)"
                          no-header-tabs />
                        <q-color v-if="item.background" v-model="item.background" no-header-tabs />
                        <q-color
                          v-if="item.circleColor"
                          @update:model-value="chartStore.initIndicator(chart, selectedIndicator?.shortName || null, true)"
                          v-model="item.circleColor"
                          no-header-tabs />
                      </q-menu>
                    </q-btn>
                  </div>
                </div>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
