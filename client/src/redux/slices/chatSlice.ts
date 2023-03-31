import { createSlice } from '@reduxjs/toolkit';
import { chatType } from '../../Components/Pages/Chat/Chat';
type StateType = {
    chat: chatType[]
}
const initialState: StateType = {
    chat: []
}

const chatSlice = createSlice({
    name: 'chatSlice',
    initialState,
    reducers: {
        setChat: (state, action) => {
            state.chat = [...state.chat, action.payload]
        }
    }
})

export const { setChat } = chatSlice.actions

export default chatSlice.reducer