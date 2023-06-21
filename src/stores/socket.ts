import { defineStore } from "pinia";

export enum SocketStatesEnum {
  CONNECTED = "CONNECTED",
  CONNECTING = "CONNECTING",
  OFF = "OFF",
}

export const useSocketStore = defineStore({
  id: "socket",
  state: () => ({
    statisticSocketState: SocketStatesEnum.OFF,
    tradeSocketState: SocketStatesEnum.OFF,
    pairSocketState: SocketStatesEnum.OFF,
    walletSocketState: SocketStatesEnum.OFF,
    tradingWalletSocketState: SocketStatesEnum.OFF,
    tradeSocketReconnectionsAttempts: 0,
    pairSocketReconnectionsAttempts: 0,
    walletSocketReconnectionsAttempts: 0,
    tradingWalletSocketReconnectionsAttempts: 0,
    maxReconnectionsAttempts: 3,
  }),
  getters: {
    getStatisticSocketState(): SocketStatesEnum {
      return this.statisticSocketState;
    },

    getTradeSocketState(): SocketStatesEnum {
      return this.statisticSocketState;
    },
    getTradeSocketReconnectionsAttempts(): number {
      return this.tradeSocketReconnectionsAttempts;
    },

    getPairSocketState(): SocketStatesEnum {
      return this.statisticSocketState;
    },
    getPairSocketReconnectionsAttempts(): number {
      return this.pairSocketReconnectionsAttempts;
    },

    getWalletSocketState(): SocketStatesEnum {
      return this.walletSocketState;
    },
    getWalletSocketReconnectionsAttempts(): number {
      return this.walletSocketReconnectionsAttempts;
    },

    getTradingWalletSocketState(): SocketStatesEnum {
      return this.tradingWalletSocketState;
    },
    getTradingWalletSocketReconnectionsAttempts(): number {
      return this.tradingWalletSocketReconnectionsAttempts;
    },

    getMaxReconnectionsAttempts(): number {
      return this.maxReconnectionsAttempts;
    },
  },
  actions: {
    setStatisticSocketState(payload: SocketStatesEnum) {
      this.statisticSocketState = payload;
    },
    setTradeSocketState(payload: SocketStatesEnum) {
      this.tradeSocketState = payload;
    },
    setPairSocketState(payload: SocketStatesEnum) {
      this.pairSocketState = payload;
    },
    setWalletSocketState(payload: SocketStatesEnum) {
      this.walletSocketState = payload;
    },
    setTradingWalletSocketState(payload: SocketStatesEnum) {
      this.tradingWalletSocketState = payload;
    },
  }
});
