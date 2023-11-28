import { createSlice } from "@reduxjs/toolkit";
import { Token, TokenBalance } from "@/src/types/token";
import { AppState } from "../store";
import tokenList from "@/src/tokens/tokenList";

export interface TokenState {
  fromToken: Token;
  toToken: Token;
  transactionUrl: string;
  currentToken: Token;
  tokenBalanceList: TokenBalance[];
  changeFrom: string;
  searchedToken: Token;
  isTransactionSuccessed: boolean;
  isRemovedLiquidity: boolean;
  isSwapSuccesed: boolean;
  isAddLiquiditySuccessed: boolean;
  isUnstakeSuccessed: boolean;
  removedPairAddress: string;
}

const initialState: TokenState = {
  fromToken: tokenList.from,
  toToken: tokenList.to,
  transactionUrl: "",
  currentToken: tokenList.from,
  tokenBalanceList: [{ name: "", balance: "" }],
  changeFrom: "",
  searchedToken: tokenList.initial,
  isTransactionSuccessed: false,
  isRemovedLiquidity: false,
  isSwapSuccesed: false,
  isAddLiquiditySuccessed: false,
  isUnstakeSuccessed: false,
  removedPairAddress: "",
};

export const TokenReducer = createSlice({
  name: "Token",
  initialState,
  reducers: {
    setFromToken(state, action) {
      state.fromToken = action.payload;
    },
    setToToken(state, action) {
      state.toToken = action.payload;
    },
    setTransactionUrl(state, action) {
      state.transactionUrl = action.payload;
    },
    setCurrentToken(state, action) {
      state.currentToken = action.payload;
    },
    setTokenBalanceList(state, action) {
      state.tokenBalanceList = action.payload;
    },
    setChangeFrom(state, action) {
      state.changeFrom = action.payload;
    },
    setSearchedToken(state, action) {
      state.searchedToken = action.payload;
    },
    setIsTransactionSuccessed(state, action) {
      state.isTransactionSuccessed = action.payload;
    },
    setIsRemovedLiquidity(state, action) {
      state.isRemovedLiquidity = action.payload;
    },
    setIsSwapSuccessed(state, action) {
      state.isSwapSuccesed = action.payload;
    },
    setIsAddLiquiditySuccessed(state, action) {
      state.isAddLiquiditySuccessed = action.payload;
    },
    setIsUnstakeSuccessed(state, action) {
      state.isUnstakeSuccessed = action.payload;
    },
    setRemovedPairAddress(state, action) {
      state.removedPairAddress = action.payload;
    },
  },
});
export const {
  setFromToken,
  setToToken,
  setCurrentToken,
  setTransactionUrl,
  setTokenBalanceList,
  setChangeFrom,
  setSearchedToken,
  setIsTransactionSuccessed,
  setIsRemovedLiquidity,
  setIsSwapSuccessed,
  setIsAddLiquiditySuccessed,
  setIsUnstakeSuccessed,
  setRemovedPairAddress,
} = TokenReducer.actions;

export const getFromToken = (state: AppState) => state.Token.fromToken;

export const getToToken = (state: AppState) => state.Token.toToken;

export const getTransactionUrl = (state: AppState) =>
  state.Token.transactionUrl;

export const getCurrentToken = (state: AppState) => state.Token.currentToken;

export const getTokenBalanceList = (state: AppState) =>
  state.Token.tokenBalanceList;

export const getSearchedToken = (state: AppState) => state.Token.searchedToken;

export const getChangeFrom = (state: AppState) => state.Token.changeFrom;

export const getIsTransactionSuccessed = (state: AppState) =>
  state.Token.isTransactionSuccessed;

export const getIsRemovedLiquidity = (state: AppState) =>
  state.Token.isRemovedLiquidity;

export const getIsSwapSuccessed = (state: AppState) =>
  state.Token.isSwapSuccesed;

export const getIsAddLiquiditySuccessed = (state: AppState) =>
  state.Token.isAddLiquiditySuccessed;

export const getIsUnstakeSuccessed = (state: AppState) =>
  state.Token.isUnstakeSuccessed;

export const getRemovedPairAddress = (state: AppState) =>
  state.Token.removedPairAddress;

export default TokenReducer.reducer;
