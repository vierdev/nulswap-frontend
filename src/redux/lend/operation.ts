import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";

export interface lendState {
  isNulsSupplySuccessed: boolean;
  isAinulsSupplySuccessed: boolean;
  isNulsWithdrawSuccessed: boolean;
  isAinulsWithdrawSuccessed: boolean;
  isRepaySuccessed: boolean;
  isBorrowSuccessed: boolean;
  supplyNulsTransaction: string;
  supplyAinulsTransaction: string;
  withdrawNulsTransaction: string;
  withdrawAinulstTansaction: string;
  repayTransaction: string;
  borrowTransaction: string;
  getRewardTransaction: string;
}

const initialState: lendState = {
  isNulsSupplySuccessed: false,
  isAinulsSupplySuccessed: false,
  isNulsWithdrawSuccessed: false,
  isAinulsWithdrawSuccessed: false,
  isRepaySuccessed: false,
  isBorrowSuccessed: false,
  supplyNulsTransaction: "",
  supplyAinulsTransaction: "",
  withdrawNulsTransaction: "",
  withdrawAinulstTansaction: "",
  repayTransaction: "",
  borrowTransaction: "",
  getRewardTransaction: "",
};

export const LendReducer = createSlice({
  name: "Lend",
  initialState,
  reducers: {
    setIsNulsSupplySuccessed(state, action) {
      state.isNulsSupplySuccessed = action.payload;
    },
    setIsAinulsSupplySuccessed(state, action) {
      state.isAinulsSupplySuccessed = action.payload;
    },
    setIsNulsWithdrawSuccessed(state, action) {
      state.isNulsWithdrawSuccessed = action.payload;
    },
    setIsAinulsWithdrawSuccessed(state, action) {
      state.isAinulsWithdrawSuccessed = action.payload;
    },
    setIsRepaySuccessed(state, action) {
      state.isRepaySuccessed = action.payload;
    },
    setIsBorrowSuccessed(state, action) {
      state.isBorrowSuccessed = action.payload;
    },
    setSupplyNulsTransaction(state, action) {
      state.supplyNulsTransaction = action.payload;
    },
    setSupplyAinulsTransaction(state, action) {
      state.supplyAinulsTransaction = action.payload;
    },
    setWithdrawNulsTransaction(state, action) {
      state.withdrawNulsTransaction = action.payload;
    },
    setWithdrawAinulsTransaction(state, action) {
      state.withdrawAinulstTansaction = action.payload;
    },
    setRepayTransaction(state, action) {
      state.repayTransaction = action.payload;
    },
    setBorrowTransaction(state, action) {
      state.borrowTransaction = action.payload;
    },
    setGetrewardTransaction(state, action) {
      state.getRewardTransaction = action.payload;
    },
  },
});
export const {
  setIsNulsSupplySuccessed,
  setIsAinulsSupplySuccessed,
  setIsNulsWithdrawSuccessed,
  setIsAinulsWithdrawSuccessed,
  setIsRepaySuccessed,
  setIsBorrowSuccessed,
  setSupplyNulsTransaction,
  setSupplyAinulsTransaction,
  setWithdrawNulsTransaction,
  setWithdrawAinulsTransaction,
  setRepayTransaction,
  setBorrowTransaction,
  setGetrewardTransaction,
} = LendReducer.actions;

export const getIsNulsSupplySuccessed = (state: AppState) =>
  state.Lend.isNulsSupplySuccessed;

export const getIsAinulsSupplySuccessed = (state: AppState) =>
  state.Lend.isAinulsSupplySuccessed;

export const getIsNulsWithdrawSuccessed = (state: AppState) =>
  state.Lend.isNulsWithdrawSuccessed;

export const getIsAinulsWithdrawSuccessed = (state: AppState) =>
  state.Lend.isAinulsWithdrawSuccessed;

export const getIsBorrowSuccessed = (state: AppState) =>
  state.Lend.isBorrowSuccessed;

export const getIsRepaySuccessed = (state: AppState) =>
  state.Lend.isRepaySuccessed;

export const getSupplyNulsTransaction = (state: AppState) =>
  state.Lend.supplyNulsTransaction;

export const getSupplyAinulsTransaction = (state: AppState) =>
  state.Lend.supplyAinulsTransaction;

export const getWithdrawNulsTransaction = (state: AppState) =>
  state.Lend.withdrawNulsTransaction;

export const getWithdrawAinulsTransaction = (state: AppState) =>
  state.Lend.withdrawAinulstTansaction;

export const getRepayTransaction = (state: AppState) =>
  state.Lend.repayTransaction;

export const getBorrowTransaction = (state: AppState) =>
  state.Lend.borrowTransaction;

export const getGetrewardTransaction = (state: AppState) =>
  state.Lend.getRewardTransaction;

export default LendReducer.reducer;
