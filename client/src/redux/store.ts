import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import loginSlice from "./slices/loginSlice";

export const store = configureStore({
    reducer: {
        login: loginSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch