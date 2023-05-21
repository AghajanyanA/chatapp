import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../../../App'
import { chatSelector, loginSelector } from '../../../helpers/selectors/selectors'
import { setChat } from '../../../redux/slices/chatSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import style from './Chat.module.css'
import ChatMessage from './ChatMessage/ChatMessage'
import { setLogOut } from '../../../redux/slices/loginSlice'

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
type ChannelsType = {
    channelName: string,
    channelID: string,
    authorSocketID?: string
}

const Chat = () => {
    const [onlineUsers, setOnlineUsers] = useState<onlineUsersType[]>([])
    const [chatInput, setChatInput] = useState<string>('')
    const [channels, setChannels] = useState<ChannelsType[]>([])
    
    const [selectedChannel, setSelectedChannel] = useState(channels.at(0)?.channelName || 'Global')
    const [addNewChannelWindowOn, setAddNewChannelWindowOn] = useState(false)
    const [newChannelInput, setNewChannelInput] = useState('')
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

    const handleSignOut = () => {
        socket.emit('handle-sign-out', socketID)
        dispatch(setLogOut())
    }

    const handleNewChannelForm = (e: any) => {
        e.preventDefault()
        if (e.nativeEvent.submitter.name === 'submit' && newChannelInput.trim().length > 0) {
            socket.emit('add-channel', {
                channelName: newChannelInput,
                authorSocketID: socketID
            })
            setNewChannelInput('')
        }
        setAddNewChannelWindowOn(false)
        if (e.nativeEvent.submitter.name === 'cancel') {
            setAddNewChannelWindowOn(false)
        }
    }

    const handleClosePrompt = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // @ts-ignore
        if (e.target === e.currentTarget.children[0] || e.target.tagName === 'INPUT' || e.target.parentElement === e.currentTarget.children[0]) {
            return
        }
        else {
            setAddNewChannelWindowOn(false)
        }
    }
    

    useEffect(() => {
        if (!isLogged) {
            navigate('/')
        }

        const onlineUsersHandler = (data: any) => {
            setOnlineUsers(data)
        }
        const handleSetChannels = (data: ChannelsType[]) => {
            setChannels(data)
        }

        socket.on('channels', handleSetChannels)
        socket.on('online-users', onlineUsersHandler)
        socket.emit('active-channel', selectedChannel)
        socket.on('receive-message', data => {
            dispatch(setChat(data))
        })

        return () => {
            socket.off('online-users', onlineUsersHandler)
            socket.off('channels', handleSetChannels)
        }
        }, [socket, isLogged, navigate, dispatch, selectedChannel])

    return <div className={style.chatWrapper}>

        <div className={addNewChannelWindowOn ? style.newChannelWindowShow : style.newChannelWindowHide} onClick={handleClosePrompt}>
            <div className={style.newChannelPrompt}>
                <header>New channel</header>
                <form onSubmit={handleNewChannelForm} className={style.inputWrapperForm}>
                    <div className={style.inputForm} >
                        <input type='text' placeholder={`${username}'s channel...`} className={style.textInput} value={newChannelInput} onChange={e => setNewChannelInput(e.target.value)} />
                        <input type='submit' value='Add :)' className={style.submitInput} name='submit' />
                    </div>
                    <input type='submit' value='Cancel :(' className={`${style.submitInput} ${style.calcelButton}`} name='cancel' />
                </form>
            </div>
        </div>

        <div className={style.welcomeMessage}>
            <p>welcome, // {username}</p>
            <button onClick={handleSignOut}>Sign out</button>
        </div>

        <div className={style.subWrapper}>

            <div className={style.channels}>
                {channels.map(channel => 
                <div key={channel.channelID} className={`${style.channel} ${selectedChannel === channel.channelName ? style.selectedChannel : ''}`} onClick={() => setSelectedChannel(channel.channelName)}>
                    {channel.channelName}
                </div>)}
                <div className={style.channel} onClick={() => setAddNewChannelWindowOn(true)}>
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