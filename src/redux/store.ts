import { configureStore } from "@reduxjs/toolkit";
import { tolerance } from "./swap/tolerance";
import { TokenReducer } from "./swap/Token";
import { WalletConnect } from "./swap/walletConnect";
import { LendReducer } from "./lend/operation";
import { LuDna } from "react-icons/lu";

export const store = configureStore({
  reducer: {
    [tolerance.name]: tolerance.reducer,
    [TokenReducer.name]: TokenReducer.reducer,
    [WalletConnect.name]: WalletConnect.reducer,
    [LendReducer.name]: LendReducer.reducer,
  },
  devTools: true,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
