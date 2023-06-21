import { ref } from "vue";
import { IProcess } from "src/types/utils/IProcess";

const defaultNotificationPriority = 8000; // min value because of header has 1999 zIndex
const processes = ref<IProcess[]>([]);

export const useProcessable = () => {
  const deleteProcessNotification = () => {
    const el = processes.value.shift();
    el?.closeCb?.();
    if (!processes.value.length) return;
    processes.value[0].priority = defaultNotificationPriority;
  }
  const completeProcess = (val: IProcess) => {
    processes.value.length ? val.priority = -1 : val.priority = defaultNotificationPriority;
    const isProcessAlreadyExists = processes.value.find(i => i.message === val.message);
    if (!isProcessAlreadyExists) processes.value.push(val);
  }

  return {
    defaultNotificationPriority,
    deleteProcessNotification,
    completeProcess,
    processes,
  }
}
