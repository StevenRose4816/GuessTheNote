import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IHighScore {
  highScore?: number;
}

const initialState: IHighScore = {
  highScore: undefined,
};

const userSlice = createSlice({
  name: "highScoreSlice",
  initialState,
  reducers: {
    setHighScore(state, action: PayloadAction<IHighScore>) {
      const { highScore } = action.payload;
      state.highScore = highScore;
    },
  },
});

export const { setHighScore } = userSlice.actions;
export const globalStoreReducer = userSlice.reducer;
