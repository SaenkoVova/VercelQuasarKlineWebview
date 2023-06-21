export const useNumberFormatter = () => {
  const formatNumberByDefault = (val: number) => {
    if (!val) {
      return 0;
    }
    if (val >= 1 || val <= -1) {
      return `${Number(val.toFixed(2))}`;
    }
    const str: string = (Math.round(val * 1e8) / 1e8).toFixed(8);
    return str.replace(/\.?0+$/, "");
  };

  const numberToUsdFormat = (val: null | number) => {
    if (!val) {
      return 0;
    }
    return val.toFixed(2);
  };

  const numberToPercentFormat = (val: number | string) => {
    return (+val).toFixed(2);
  };

  const numberToCryptoFormat = (val: number | null): number => {
    if (!val) {
      return 0;
    }
    return Number(val.toFixed(8));
  };

  const preventExpInNumber = (val: number) => {
    return val.toLocaleString("fullwide", { useGrouping:false })
  }

  const numberToCommasAndDecimalFormat = (
    val: number | null,
    maximumFractionDigits = 8,
  ): string | number => {
    if (!val) return 0;
    if (val < 1) {
      return formatNumberByDefault(val);
    }
    return val.toLocaleString(undefined, { maximumFractionDigits: maximumFractionDigits });
  };

  return {
    formatNumberByDefault,
    numberToUsdFormat,
    numberToPercentFormat,
    numberToCryptoFormat,
    numberToCommasAndDecimalFormat,
    preventExpInNumber,
  };
};
