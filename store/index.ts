import { configureStore } from "@reduxjs/toolkit";
import { globalStoreReducer } from "./globalStore/slice";

const store = configureStore({
  reducer: {
    highScore: globalStoreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
