import { defineStore } from "pinia";
import { CurrenciesEnum } from "src/utils/enums/wallet/CurrenciesEnum";

export const usePairStore = defineStore({
  id: "pair",
  state: () => ({
    pair: localStorage.getItem("pair") || process.env.VUE_APP_DEFAULT_PAIR_NAME as string,
    baseCurrencyFullName: "",
  }),
  getters: {
    getPair(): string {
      return this.pair;
    },
    getBaseCurrencyFullName(): string {
      return this.baseCurrencyFullName;
    },
    getPairInBinanceFormat(): string {
      return this.pair.replace("-", "");
    },
    getBaseCurrency(): CurrenciesEnum {
      return this.pair.split("-")[0] as CurrenciesEnum;
    },
    getQuotedCurrency(): CurrenciesEnum {
      return this.pair.split("-")[1] as CurrenciesEnum;
    },
  },
  actions: {
    setPair(pair?: string) {
      this.pair = pair || process.env.VUE_APP_DEFAULT_PAIR_NAME as string;
      localStorage.setItem("pair", this.pair);
    },
    setBaseCurrencyFullName(payload: string) {
      this.baseCurrencyFullName = payload;
    },
  },
});
