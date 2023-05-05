import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../../../App'
import { chatSelector, loginSelector } from '../../../helpers/selectors/selectors'
import { setChat } from '../../../redux/slices/chatSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import style from './Chat.module.css'
import ChatMessage from './ChatMessage/ChatMessage'

type onlineUsersType = {
    username: string,
    socketID: string
}

export type chatType = {
    message: string,
    sender: string,
    sender_id: string,
    channel: string,
    message_id: number
}

const Chat = () => {
    const [onlineUsers, setOnlineUsers] = useState<onlineUsersType[]>([])
    const [chatInput, setChatInput] = useState<string>('')
    const [selectedChannel, setSelectedChannel] = useState('Global')
    const socket = useContext(SocketContext)
    const { isLogged, username, socketID } = useAppSelector(loginSelector)
    const { chat } = useAppSelector(chatSelector)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const chatNotEmpty = chat.length > 0 ? true : false
    

    const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatInput(e.target.value)
    }

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (chatInput.trim().length > 0) {
            const message = {
                message: chatInput,
                sender: socket.id,
                channel: selectedChannel
            }
            socket.emit('send-message', message)
            setChatInput('')
        }
        
    }

    useEffect(() => {
        if (!isLogged) {
            navigate('/')
        }

        const onlineUsersHandler = (data: any) => {
            setOnlineUsers(data)
        }

        socket.on('online-users', onlineUsersHandler)
        socket.emit('active-channel', selectedChannel)
        socket.on('receive-message', data => {
            dispatch(setChat(data))
        })

        return () => {
            socket.off('online-users', onlineUsersHandler)
        }
        }, [socket, isLogged, navigate, dispatch, selectedChannel])

    return <div className={style.chatWrapper}>
        <p className={style.welcomeMessage}>welcome, // {username}</p>
        <div className={style.subWrapper}>

            <div className={style.channels}>
                <header>Channels</header>
                <div className={style.channel} onClick={() => setSelectedChannel('Global')}>
                    Global Chat
                </div>
                <div className={style.channel} onClick={() => alert('Not working yet')}>
                    + New Channel
                </div>
            </div>

            <div className={style.chat}>
                <div className={`${style.dialog} ${chatNotEmpty ? '' : style.emptyChat}`}>
                    {chatNotEmpty ? chat.map(message => <ChatMessage key={message.message_id} data={message} socketID={socketID} /> ) : 'No messages yet'}
                </div>
                <form onSubmit={handleSendMessage} className={style.inputForm} >
                    <input type="text" placeholder='Message' value={chatInput} onChange={handleChatInputChange} className={style.textInput} />
                    <input type="submit" value="Send" className={style.submitInput} />
                </form>
            </div>

            <div className={style.users}>
                {onlineUsers.map(user => <div key={user.socketID} className={style.user}>{user.username}</div>)}
            </div>
        </div>
    
    </div>
}

export default Chat