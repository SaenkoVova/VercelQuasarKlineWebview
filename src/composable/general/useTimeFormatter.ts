export const useTimeFormatter = () => {
  const timestampToLocaleDateTimeRoRo = (time: string | number, options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }) => {
    // output format 03.09.2021, 17:56:58
    const date = new Date(time);
    return `${date.toLocaleString("ro-RO", options)}`;
  };

  const timestampToLocaleDateTimeEnZa = (time: string | number) => {
    // output format 2021/09/03, 17:56:58
    const date = new Date(time);
    return `${date.toLocaleString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })}`;
  };

  const timestampToDateRoRo = (time: string | number) => {
    // output format 2021/09/03
    const date = new Date(time);
    return `${date.toLocaleDateString("ro-RO")}`;
  };

  const timestampToTimeRoRo = (time: string | number) => {
    // output format 17:56:58
    const date = new Date(time);
    return `${date.toLocaleTimeString("ro-RO")}`;
  };

  return {
    timestampToLocaleDateTimeRoRo,
    timestampToTimeRoRo,
    timestampToLocaleDateTimeEnZa,
    timestampToDateRoRo,
  };
};
