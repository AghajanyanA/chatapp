import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import chatSlice from "./slices/chatSlice";
import loginSlice from "./slices/loginSlice";

export const store = configureStore({
    reducer: {
        login: loginSlice,
        chat: chatSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector