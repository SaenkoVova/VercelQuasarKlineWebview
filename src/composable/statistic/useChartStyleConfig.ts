import {
  CandleTooltipCustomCallbackData,
  CandleType, Chart,
  DeepPartial,
  LineType,
  PolygonType,
  Styles,
  TooltipShowRule,
  TooltipShowType,
  YAxisPosition,
  YAxisType
} from "klinecharts";
import { useTimeFormatter } from "src/composable/general/useTimeFormatter";
import { ref } from "vue";

export const useChartStyleConfig = () => {

  const { timestampToLocaleDateTimeEnZa } = useTimeFormatter();
  const isFullScreen = ref(false);

  const style: DeepPartial<Styles> = localStorage.getItem("chartStyles") ? JSON.parse(localStorage.getItem("chartStyles") as string) : {
    grid: {
      show: true,
      horizontal: {
        show: true,
        size: 0,
        color: "#1C1D21",
        style: LineType.Solid,
      },
      vertical: {
        show: true,
        size: 0,
        color: "#1C1D21",
        style: LineType.Solid,
      }
    },
    candle: {
      type: CandleType.CandleSolid,
      bar: {
        upColor: "#1FA675",
        downColor: "#F13B5C",
        noChangeColor: "#868688",
        upBorderColor: "#1FA675",
        downBorderColor: "#F13B5C",
        noChangeBorderColor: "#868688",
        upWickColor: "#1FA675",
        downWickColor: "#F13B5C",
        noChangeWickColor: "#868688"
      },
      area: {
        lineSize: 2,
        lineColor: "#2196F3",
        value: "close",
        backgroundColor: [{
          offset: 0,
          color: "rgba(33, 150, 243, 0.01)"
        }, {
          offset: 0,
          color: "rgba(33, 150, 243, 0.2)"
        }]
      },
      priceMark: {
        show: true,
        high: {
          show: true,
          color: "#1FA675",
          textSize: 12,
          textFamily: "Roboto",
          textWeight: "normal"
        },
        low: {
          show: true,
          color: "#F13B5C",
          textSize: 12,
          textFamily: "Roboto",
          textWeight: "normal",
        },
        last: {
          show: true,
          upColor: "#1FA675",
          downColor: "#F13B5C",
          noChangeColor: "#868688",
          line: {
            show: true,
            style: LineType.Dashed,
            size: 1
          },
          text: {
            show: true,
            style: PolygonType.Fill,
            size: 12,
            paddingLeft: 4,
            paddingTop: 4,
            paddingRight: 4,
            paddingBottom: 4,
            borderStyle: LineType.Solid,
            borderSize: 1,
            color: "#FFFFFF",
            family: "Roboto",
            weight: "normal",
            borderRadius: 2
          }
        }
      },
      tooltip: {
        showRule: TooltipShowRule.None,
        showType: TooltipShowType.Standard,
        custom: (data: CandleTooltipCustomCallbackData) => {
          const { prev, current } = data
          const prevClose = (prev?.close ?? current.open)
          const change = (current.close - prevClose) / prevClose * 100
          return [
            {
              title: "     ",
              value: {
                text: timestampToLocaleDateTimeEnZa(current.timestamp),
                color: "#888888"
              }
            },
            {
              title: "Open: ",
              value: {
                text: current.open.toFixed(2),
                color: change < 0 ? "#F13B5C" : "#1FA675"
              }
            },
            {
              title: "High: ",
              value: {
                text: current.high.toFixed(2),
                color: change < 0 ? "#F13B5C" : "#1FA675"
              }
            },
            {
              title: "Low: ",
              value: {
                text: current.low.toFixed(2),
                color: change < 0 ? "#F13B5C" : "#1FA675",
              }
            },
            {
              title: "Close: ",
              value: {
                text: `${current.close.toFixed(2)}%`,
                color: change < 0 ? "#F13B5C" : "#1FA675"
              }
            },
            {
              title: "Change: ",
              value: {
                text: `${change.toFixed(2)}%`,
                color: change < 0 ? "#F13B5C" : "#1FA675"
              }
            },
            {
              title: "Amplitude: ",
              value: {
                text: `${((current.high / current.low - 1) * 100).toFixed(2)}%`,
                color: change < 0 ? "#F13B5C" : "#1FA675"
              }
            }
          ]
        },
        defaultValue: "n/a",
        rect: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          position: "fixed",
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 6,
          offsetLeft: 10,
          offsetTop: 8,
          offsetRight: 10,
          offsetBottom: 8,
          borderRadius: 4,
          borderSize: 1,
          borderColor: "#f2f3f5",
          color: "#FEFEFE"
        },
        text: {
          size: 12,
          family: "Roboto",
          weight: "normal",
          color: "#D9D9D9",
          marginLeft: 0,
          marginTop: 5,
          marginRight: 5,
          marginBottom: 0
        },
      },
    },
    indicator: {
      ohlc: {
        upColor: "rgba(31, 166, 117, 1)",
        downColor: "rgba(241, 59, 92, 1)",
        noChangeColor: "#888888"
      },
      bars: [{
        style: PolygonType.Fill,
        borderStyle: LineType.Solid,
        borderSize: 1,
        borderDashedValue: [2, 2],
        upColor: "rgba(31, 166, 117, 1)",
        downColor: "rgba(241, 59, 92, 1)",
        noChangeColor: "#888888"
      }],
      // lines: [
      //   {
      //     style: LineType.Solid,
      //     smooth: false,
      //     size: 1,
      //     dashedValue: [2, 2],
      //     color: "#FF9600"
      //   },
      //   {
      //     style: LineType.Solid,
      //     smooth: false,
      //     size: 1,
      //     dashedValue: [2, 2],
      //     color: "#935EBD"
      //   }, {
      //     style: LineType.Solid,
      //     smooth: false,
      //     size: 1,
      //     dashedValue: [2, 2],
      //     color: "#2196F3"
      //   }, {
      //     style: LineType.Solid,
      //     smooth: false,
      //     size: 1,
      //     dashedValue: [2, 2],
      //     color: "#E11D74"
      //   }, {
      //     style: LineType.Solid,
      //     smooth: false,
      //     size: 1,
      //     dashedValue: [2, 2],
      //     color: "#01C5C4"
      //   }
      // ],
      // circles: [{
      //   style: PolygonType.Fill,
      //   borderStyle: LineType.Solid,
      //   borderSize: 1,
      //   borderDashedValue: [2, 2],
      //   upColor: "rgba(31, 166, 117, 1)",
      //   downColor: "rgba(241, 59, 92, 1)",
      //   noChangeColor: "#888888"
      // }],
      lastValueMark: {
        show: false,
        text: {
          show: false,
          style: PolygonType.Fill,
          color: "#FFFFFF",
          size: 12,
          family: "Roboto",
          weight: "normal",
          borderStyle: LineType.Solid,
          borderSize: 1,
          borderDashedValue: [2, 2],
          paddingLeft: 4,
          paddingTop: 4,
          paddingRight: 4,
          paddingBottom: 4,
          borderRadius: 2
        }
      },
      tooltip: {
        showRule: TooltipShowRule.None,
        showType: TooltipShowType.Standard,
        showName: false,
        showParams: false,
        defaultValue: "n/a",
        text: {
          size: 12,
          family: "Roboto",
          weight: "normal",
          color: "#D9D9D9",
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 15
        },
        icons: [],
      }
    },
    xAxis: {
      show: true,
      size: "auto",
      axisLine: {
        show: true,
        color: "#1C1D21",
        size: 1
      },
      tickText: {
        show: true,
        color: "#868688",
        family: "Roboto",
        weight: "normal",
        size: 12,
        marginStart: 4,
        marginEnd: 4
      },
      tickLine: {
        show: true,
        size: 2,
        length: 4,
        color: "#868688"
      }
    },
    yAxis: {
      show: true,
      size: "auto",
      position: YAxisPosition.Right,
      type: YAxisType.Log,
      inside: false,
      reverse: false,
      axisLine: {
        show: true,
        color: "#1C1D21",
        size: 1
      },
      tickText: {
        show: true,
        color: "#868688",
        family: "Roboto",
        weight: "normal",
        size: 12,
        marginStart: 4,
        marginEnd: 4
      },
      tickLine: {
        show: true,
        size: 1,
        length: 3,
        color: "#888888"
      }
    },
    separator: {
      size: 1,
      color: "#33353D",
      fill: true,
      activeBackgroundColor: "rgba(230, 230, 230, .15)"
    },
    crosshair: {
      show: true,
      horizontal: {
        show: true,
        line: {
          show: true,
          style: LineType.Dashed,
          dashedValue: [4, 2],
          size: 1,
          color: "#868688"
        },
        text: {
          show: true,
          style: PolygonType.Fill,
          color: "#FFFFFF",
          size: 12,
          family: "Roboto",
          weight: "normal",
          borderStyle: LineType.Solid,
          borderDashedValue: [2, 2],
          borderSize: 1,
          borderColor: "#686D76",
          borderRadius: 2,
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
          backgroundColor: "#686D76"
        }
      },
      vertical: {
        show: true,
        line: {
          show: true,
          style: LineType.Dashed,
          dashedValue: [4, 2],
          size: 1,
          color: "#888888"
        },
        text: {
          show: true,
          style: PolygonType.Fill,
          color: "#FFFFFF",
          size: 12,
          family: "Roboto",
          weight: "normal",
          borderStyle: LineType.Solid,
          borderDashedValue: [2, 2],
          borderSize: 1,
          borderColor: "#686D76",
          borderRadius: 2,
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
          backgroundColor: "#686D76"
        }
      }
    },
    overlay: {
      point: {
        color: "#1677FF",
        borderColor: "rgba(22, 119, 255, 0.35)",
        borderSize: 1,
        radius: 5,
        activeColor: "#1677FF",
        activeBorderColor: "rgba(22, 119, 255, 0.35)",
        activeBorderSize: 3,
        activeRadius: 5
      },
      line: {
        style: LineType.Solid,
        smooth: false,
        color: "#1677FF",
        size: 1,
        dashedValue: [2, 2]
      },
      rect: {
        style: PolygonType.Fill,
        color: "rgba(22, 119, 255, 0.25)",
        borderColor: "#1677FF",
        borderSize: 1,
        borderRadius: 0,
        borderStyle: LineType.Solid,
        borderDashedValue: [2, 2]
      },
      polygon: {
        style: PolygonType.Fill,
        color: "#1677FF",
        borderColor: "#1677FF",
        borderSize: 1,
        borderStyle: LineType.Solid,
        borderDashedValue: [2, 2]
      },
      circle: {
        style: PolygonType.Fill,
        color: "rgba(22, 119, 255, 0.25)",
        borderColor: "#1677FF",
        borderSize: 1,
        borderStyle: LineType.Solid,
        borderDashedValue: [2, 2]
      },
      arc: {
        style: LineType.Solid,
        color: "#1677FF",
        size: 1,
        dashedValue: [2, 2]
      },
      text: {
        color: "#1677FF",
        size: 12,
        family: "Roboto",
        weight: "normal"
      },
      rectText: {
        style: PolygonType.Fill,
        color: "#FFFFFF",
        size: 12,
        family: "Roboto",
        weight: "normal",
        borderStyle: LineType.Solid,
        borderDashedValue: [2, 2],
        borderSize: 1,
        borderRadius: 2,
        borderColor: "#1677FF",
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: "#1677FF"
      }
    }
  }

  const priceMarkVisible = ref(style?.candle?.priceMark?.show || false);

  const setPriceMarkVisible = (chart: Chart | null) => {
    priceMarkVisible.value = !priceMarkVisible.value;
    chart?.setStyles({
      candle: {
        priceMark: {
          show: priceMarkVisible.value,
        }
      }
    });
    if (style.candle?.priceMark?.show != undefined) {
      style.candle.priceMark.show = priceMarkVisible.value;
    }
    localStorage.setItem("chartStyles", JSON.stringify(style));
  }

  return {
    style,
    priceMarkVisible,
    setPriceMarkVisible,
    isFullScreen,
  }
}
