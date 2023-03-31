import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../../../App'
import { chatSelector, loginSelector } from '../../../helpers/selectors/selectors'
import { setChat } from '../../../redux/slices/chatSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import style from './Chat.module.css'

type onlineUsersType = {
    username: string,
    socketID: string
}

export type chatType = {
    message: string,
    sender: string,
    channel: string
}

const Chat = () => {
    const [onlineUsers, setOnlineUsers] = useState<onlineUsersType[]>([])
    const [chatInput, setChatInput] = useState<string>('')
    const [selectedChannel, setSelectedChannel] = useState('Global')
    const socket = useContext(SocketContext)
    const { isLogged, username } = useAppSelector(loginSelector)
    const { chat } = useAppSelector(chatSelector)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    console.log(chat);
    
    

    const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatInput(e.target.value)
    }

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const message = {
            message: chatInput,
            sender: socket.id,
            channel: selectedChannel
        }
        socket.emit('send-message', message)
        setChatInput('')
        
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
            debugger
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
            </div>
            <div className={style.chat}>
                
            {chat.length > 0 ? chat.map(message => <div>{message.message}</div>) : 'No messages yet'}
                <form onSubmit={handleSendMessage}>
                    <input type="text" placeholder='Message' value={chatInput} onChange={handleChatInputChange} />
                    <input type="submit" value="Send" />
                </form>
            </div>
            <div className={style.users}>
                <header>Online now:</header>
                {onlineUsers.map(user => <div key={user.socketID}>{user.username}</div>)}
            </div>
        </div>
    
    </div>
}

export default Chat