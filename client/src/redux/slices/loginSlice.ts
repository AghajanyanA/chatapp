import { createSlice } from "@reduxjs/toolkit";
export type loginStateType = {
    isLogged: boolean,
    username: string
}
const initialState: loginStateType = {
    isLogged: false,
    username: ''
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLogged: (state, action) => {
            state.isLogged = action.payload.status
            state.username = action.payload.username
        }
    } 
})

export const { setLogged } = loginSlice.actions

export default loginSlice.reducer