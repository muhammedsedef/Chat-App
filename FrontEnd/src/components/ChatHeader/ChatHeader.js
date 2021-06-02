import React, {useContext} from 'react'
import styles from './chatheader.module.css'
import Photo from '../../images/pp.svg'
import ConversationIcon from '../../images/chat.svg'
import { AuthContext } from '../../context/AuthContext'


const ChatHeader = ( {photo = Photo, name = "Muhammed Sedef", member1, member2, conversation} ) => {
    const [user,setUser] = useContext(AuthContext)
    let friend = conversation?.members.find(m => m._id !== user._id)

    if (conversation) {
        return (
            <div className = {styles.chatHeader}>
                <img src={photo}/>
                <span>{friend.firstName} {friend.lastName}</span>
            </div>
        )
    }




    if (member1 && member2) {
        return (
            <div className = {styles.chatHeader}>
                <img src={ConversationIcon}/>
                <span>{member1}</span>
                <span>&</span>
                <span>{member2}</span>
            </div> 
        )
    }

    return (
        <div className = {styles.chatHeader}>
            <img src={photo}/>
            <span>{name}</span>
        </div>
    )
}

export default ChatHeader
