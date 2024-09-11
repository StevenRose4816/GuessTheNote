import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "../../screens/Home";

interface SetHighScorePayload {
  highScore: number;
}

interface SetStatisticsPayload {
  statistics: Record<Note, { correct: number; total: number }>;
}

export interface IGlobal {
  highScore?: number;
  statistics?: Record<Note, { correct: number; total: number }>;
}

const initialState: IGlobal = {
  highScore: undefined,
  statistics: {
    C: { correct: 0, total: 0 },
    C_sharp: { correct: 0, total: 0 },
    D: { correct: 0, total: 0 },
    Eb: { correct: 0, total: 0 },
    E: { correct: 0, total: 0 },
    F: { correct: 0, total: 0 },
    F_sharp: { correct: 0, total: 0 },
    G: { correct: 0, total: 0 },
    G_sharp: { correct: 0, total: 0 },
    A: { correct: 0, total: 0 },
    Bb: { correct: 0, total: 0 },
    B: { correct: 0, total: 0 },
  },
};

const userSlice = createSlice({
  name: "highScoreSlice",
  initialState,
  reducers: {
    setHighScore(state, action: PayloadAction<SetHighScorePayload>) {
      const { highScore } = action.payload;
      state.highScore = highScore;
    },
    setStatistics(state, action: PayloadAction<SetStatisticsPayload>) {
      const { statistics } = action.payload;
      state.statistics = statistics;
    },
  },
});

export const { setHighScore, setStatistics } = userSlice.actions;
export const globalStoreReducer = userSlice.reducer;
