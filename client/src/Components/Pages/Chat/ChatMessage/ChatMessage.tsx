import { chatType } from "../Chat"
import style from './ChatMessage.module.css'

type ChatMessagePropsType = {
    data: chatType,
    socketID: string
}

const ChatMessage = ({data, socketID}: ChatMessagePropsType) => {
    const isSenderMe = socketID === data.sender_id ? true : false

    return <div className={`${style.wrapper} ${isSenderMe ? style.senderIsMeWrapper : ''}`}>
        <div className={style.nmwrap}>
            {!isSenderMe && <div className={style.senderName} >{data.sender}</div>}
            <div className={`${style.message} ${isSenderMe ? style.senderIsMe : ''}`}>
                {data.message}
            </div>
        </div>
    </div>
    
}

export default ChatMessage