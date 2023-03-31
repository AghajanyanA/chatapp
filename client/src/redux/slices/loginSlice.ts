import { createSlice } from "@reduxjs/toolkit";
export type loginStateType = {
    isLogged: boolean,
    username: string,
    socketID: string
}
const initialState: loginStateType = {
    isLogged: false,
    username: '',
    socketID: ''
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLogged: (state, action) => {
            state.isLogged = action.payload.status
            state.username = action.payload.username
            state.socketID = action.payload.socketID
        }
    } 
})

export const { setLogged } = loginSlice.actions

export default loginSlice.reducer