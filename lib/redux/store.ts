import { configureStore } from "@reduxjs/toolkit"
import walletReducer from "./features/wallet/walletSlice"
import polytixReducer from "./features/contract/contractSlice"

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    polytix: polytixReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

