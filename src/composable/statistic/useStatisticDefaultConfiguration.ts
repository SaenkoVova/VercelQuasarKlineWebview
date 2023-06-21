import { IndicatorsEnum } from "src/utils/enums/statistic/IndicatorsEnum";

export interface IChartIndicator {
  shortName: IndicatorsEnum;
  selected: boolean;
  isMajor: boolean;
  name: string;
  description?: string;
  subIndicators: {
    label: string,
    labelValue?: string;
    selected?: boolean,
    value?: number | string,
    dimension?: "Open" | "Close" | "High" | "Low",
    lineWidth?: number,
    lineColor?: string,
    background?: string;
    circleColor?: string;
    barType?: "solid" | "hollow",
    notForCalc?: boolean,
  }[],
}

export const useStatisticDefaultConfiguration = () => {

  const dimensions = [
    {
      label: "Open",
      value: "Open",
    },
    {
      label: "Close",
      value: "Close",
    },
    {
      label: "High",
      value: "High",
    },
    {
      label: "Low",
      value: "Low",
    }
  ];

  const barTypes = [
    {
      label: "Bold",
      value: "bold",
    },
    {
      label: "Hollow",
      value: "hollow",
    },
  ];

  const defaultConfig: IChartIndicator[] = [
    {
      isMajor: true,
      shortName: IndicatorsEnum.MA,
      name: "Moving average",
      selected: true,
      subIndicators: [
        {
          label: "MA1",
          selected: true,
          value: 7,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#A96E27",
        },
        {
          label: "MA2",
          selected: true,
          value: 25,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#A42BAD",
        },
        {
          label: "MA3",
          selected: true,
          value: 99,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#51B1B2",
        },
        {
          label: "MA4",
          selected: false,
          value: 0,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#621EAD",
        },
        {
          label: "MA5",
          selected: false,
          value: 0,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#0016AC",
        },
        {
          label: "MA6",
          selected: false,
          value: 0,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#A42419",
        }
      ]
    },
    {
      isMajor: true,
      shortName: IndicatorsEnum.EMA,
      name: "Exp moving average",
      selected: false,
      subIndicators: [
        {
          label: "EMA1",
          selected: true,
          value: 7,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#A96E27",
        },
        {
          label: "EMA2",
          selected: true,
          value: 25,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#A42BAD",
        },
        {
          label: "EMA3",
          selected: true,
          value: 99,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#51B1B2",
        },
        {
          label: "EMA4",
          selected: false,
          value: 0,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#621EAD",
        },{
          label: "EMA5",
          selected: false,
          value: 0,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#0016AC",
        },
        {
          label: "EMA6",
          selected: false,
          value: 0,
          dimension: "Close",
          lineWidth: 1,
          lineColor: "#A42419",
        }
      ]
    },
    {
      isMajor: true,
      shortName: IndicatorsEnum.BOLL,
      selected: false,
      name: "Bollinger lines",
      subIndicators: [
        {
          label: "Length",
          value: 7,
        },
        {
          label: "Multiplier",
          value: 2,
        },
        {
          label: "Background",
          background: "#0C1A1A",
          notForCalc: true,
          selected: true,
        },
        {
          label: "DN",
          selected: true,
          lineWidth: 1,
          lineColor: "#51B1B2",
        },
        {
          label: "MID",
          selected: true,
          lineWidth: 1,
          lineColor: "#A42BAD",
        },
        {
          label: "UP",
          selected: true,
          lineWidth: 1,
          lineColor: "#51B1B2",
        },
      ]
    },
    // {
    //   isMajor: true,
    //   shortName: IndicatorsEnum.TRIX,
    //   selected: false,
    //   name: "Three times smoothed exponential mean",
    //   subIndicators: [
    //     {
    //       label: "Length",
    //       value: 9,
    //       lineWidth: 1,
    //       lineColor: "#A96E27",
    //     },
    //   ]
    // },
    {
      isMajor: true,
      shortName: IndicatorsEnum.SAR,
      selected: false,
      name: "Stop and reversal",
      subIndicators: [
        {
          label: "Step",
          value: 0.02,
        },
        {
          label: "Max step",
          value: 0.2,
        },
        {
          label: "Delay",
          value: 3,
        },
        {
          label: "SAR",
          circleColor: "#A96E27",
        },
      ]
    },
    {
      isMajor: false,
      shortName: IndicatorsEnum.VOL,
      description: "",
      selected: true,
      name: "Volume",
      subIndicators: [
        {
          label: "MAVOL1",
          labelValue: "ma1",
          value: 7,
          lineWidth: 1,
          lineColor: "#FFFE55",
        },
        {
          label: "MAVOL2",
          labelValue: "ma2",
          value: 14,
          lineWidth: 1,
          lineColor: "#8B2BF6",
        },
      ]
    },
    {
      isMajor: false,
      shortName: IndicatorsEnum.MACD,
      description: "",
      selected: false,
      name: "",
      subIndicators: [
        {
          label: "Fast",
          value: 12,
        },
        {
          label: "Slow",
          value: 26
        },
        {
          label: "Signal",
          value: 9
        },
        {
          label: "DEA",
          selected: true,
          lineWidth: 1,
          lineColor: "#A42BAD",
        },
        {
          label: "DIF",
          selected: true,
          lineWidth: 1,
          lineColor: "#51B1B2",
        },
        {
          label: "MACD",
          selected: true,
        },
      ]
    }
  ]

  return {
    defaultConfig,
    dimensions,
    barTypes,
  }
}
