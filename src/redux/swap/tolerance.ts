import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
// ## CartState Interface
export interface ToleranceState {
  tolerance: number;
}

// ## Define the initial state of Cart State
const initialState: ToleranceState = {
  tolerance: 3,
};

export const tolerance = createSlice({
  name: "tolerance",
  initialState,
  reducers: {
    setTolerance(state, action) {
      state.tolerance = action.payload;
    },
  },
});
export const { setTolerance } = tolerance.actions;

export const getTolerance = (state: AppState) => state.tolerance.tolerance;

export default tolerance.reducer;
