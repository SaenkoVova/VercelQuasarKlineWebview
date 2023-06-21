import { ref } from "vue";
const bus = ref(new Map());

export const useEventBus = () => {
  const emit = <T>(event: string, ...args: T[]) => {
    bus.value.set(event, args);
  };

  return {
    emit,
    bus,
  };
};
