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
            state.isLogged = action.payload.logged
            state.username = action.payload.username
            state.socketID = action.payload.socketID
        },
        setLogOut: state => {
            state.isLogged = false
            state.username = ''
            state.socketID = ''
        }
    } 
})

export const { setLogged, setLogOut } = loginSlice.actions

export default loginSlice.reducer