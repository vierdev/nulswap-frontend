import { createSlice } from "@reduxjs/toolkit";
import {walletStatus} from "@src/constant/walletConnectState"
import { AppState } from "../store";

export interface WalletState {
    walletState: string,
    walletAddress: string,
    chainID: string;
}

const initialState: WalletState = {
    walletState: walletStatus.notConnected,
    walletAddress: "",
    chainID: ""
};

export const WalletConnect = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setWalletState(state, action) {
            state.walletState = action.payload;
        },
        setChainID(state, action) {
            state.chainID = action.payload;
        },
        setWalletAddress(state, action) {
            state.walletAddress = action.payload
        }
    }
});
export const { setWalletState, setChainID, setWalletAddress } = WalletConnect.actions;

export const getChainId = (state: AppState) => state.wallet.chainID;

export const getWalletState = (state: AppState) => state.wallet.walletState;

export const getWalletAddress = (state: AppState) => state.wallet.walletAddress;

export default WalletConnect.reducer;