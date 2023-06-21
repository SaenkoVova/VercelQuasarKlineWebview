import { ref } from "vue";

export const useCrosshairChange = () => {
  const hoveredBarData = ref();

  return {
    hoveredBarData
  }
}
