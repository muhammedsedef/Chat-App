import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import styles from './chat.module.css'
import Message from '../../components/Message/Message'
import Card from '../../components/Card/Card'
import GroupCard from '../../components/GroupCard/GroupCard'
import ChatHeader from '../../components/ChatHeader/ChatHeader'
import Send from '../../images/send.svg'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

const Chat = () => {
    const [messages, setMessages] = useState([]) //Messages in chat screen
    const [input, setInput] = useState("") //Message input
    const [users, setUsers] = useState() //Users on the left frame
    const [chats, setChats] = useState()
    const [user, setUser] = useContext(AuthContext)
    const [currentChat, setCurrentChat] = useState() //Current chat indicator
    const [showChat, setShowChat] = useState(false) //For responsiveness
    const scrollRef = useRef() //To scroll chat screen after sending message
    const myChats = []

    //Remove after auth
    const userType = "user"
    const userID = 1
    let id = 1
    //
    
    useEffect(()=>{
        //Scroll to bottom
        scrollRef.current?.scrollIntoView( {behavior: "smooth"} )
    },[messages, currentChat])

    useEffect(()=>{
        console.log(user)
        const getUsers = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/users/getUsers")
                console.log(res)
                setUsers(res.data.data)
            } catch (e) {
                console.log(e.response)
            }
        }

        const getConversations = async () => {
            try {
                const res = await axios(`http://localhost:8000/api/conversations/getConversation/${JSON.parse(localStorage.getItem('user'))}`)
                setChats(res.data)
            }
            catch (e) {
                console.log(e.response)
            }
        }
        getConversations()
        getUsers()
    },[])

    const getMessages = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/messages/getMessages/${id}`)
            console.log(res)
            setMessages(res.data)
        } catch (e) {
            console.log(e.response)
        }
    }

    // const createConversation = async (id) => {
    //     try {
    //         const res = await axios.post("http://localhost:8000/api/conversations/newConversation", {
    //         senderId: user,
    //         receiverId: id
    //     })
    //     console.log(res)
    //     } catch (e) {
    //         console.log(e.response)
    //     }
    // }


    // const getChatWithUser = (u) => {
    //     let hasPreviousChat = false
    //     myChats?.forEach(c => {
    //         console.log(c)
    //         if (c.members.includes(u._id)) {
    //             hasPreviousChat = true;
    //         }
    //     })
    //     if (hasPreviousChat) {
    //         let index = chats.findIndex(e => {
    //             return e.members.includes(u._id)
    //         })
    //         console.log(index)
    //         let id = chats[index]._id
    //         console.log(id)
    //         getMessages(id)
    //     }
    //     else {
    //         createConversation(u._id)
    //     }
    // }



    const time = new Date();
    function addZero(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
    }   
    const hm = `${addZero(time.getHours())}:${addZero(time.getMinutes())}`

    const sendMessage = () => {
        if(!input) return
        id++
        setMessages(prevMessages => [...prevMessages, {
            id,
            text: input,
            senderID: 1,
            recieverID: 2,
            time: hm
        }])

        setInput("")
    }

    const sendMessageKeyPress = (e) => {
        if (e.key === 'Enter' && input) {
            id++
            setMessages(prevMessages => [...prevMessages, {
                id,
                text: input,
                senderID: 1,
                recieverID: 2,
                time: hm
            }])
    
            setInput("")
        }
    }

    return (
        <div className={styles.chat} >
            <div className={showChat ? styles.show : styles.left}>
                <div className={styles.groups}>
                    <div className={styles.header}>
                        <div className={styles.indicator}></div>
                        <span>Groups</span>
                    </div>
                    <div className={styles.users}>
                        <GroupCard></GroupCard>
                    </div>           
                </div>
                <div className={styles.conversations}>
                    <div className={styles.header}>
                        <div className={styles.indicator}></div>
                        <span>Chats</span>
                    </div>
                    <div className={styles.users}>
                        <Card></Card>
                    </div>           
                </div>
                <div className={styles.onlines}>
                    <div className={styles.header}>
                        <div className={styles.indicator}></div>
                        <span>Onlines</span>
                    </div>
                    <div className={styles.users}>
                        {
                            users?.map(u => (
                                
                                <div onClick={ () => {
                                        console.log(typeof u._id)
                                        setCurrentChat(u)
                                        //getChatWithUser(u)
                                        if (window.innerWidth <= 700) {
                                            setShowChat(!showChat)
                                        }
                                    }}>
                                    <Card
                                        id = {u._id}
                                        name = {`${u.firstName} ${u.lastName}`}
                                        current = {currentChat === u ? true : false}
                                />
                                </div>
                                
                            ))
                        }
                    </div>
                </div>
                <div className={styles.offlines}>
                    <div className={styles.header}>
                        <div className={styles.indicator}></div>
                        <span>Offlines</span>
                    </div>
                    <div className={styles.users}>
                    {
                            users?.map(u => (
                                u.status === 'Offline' ?
                                <div onClick={ () => {
                                    setCurrentChat(u)
                                    if (window.innerWidth <= 700) {
                                        setShowChat(!showChat)
                                    }
                                }}> 
                                <Card
                                    id = {u.id}
                                    name = {u.name}
                                    status = {u.status}
                                    current = {currentChat === u ? true : false}
                                />
                                </div>
                                : null
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={showChat ? styles.hide : styles.right}>
                <div
                    className={styles.hamburger}
                    onClick= {() => {
                        setShowChat(!showChat)
                    }}
                    >
                    <div className={styles.hamburgerEl}></div>
                    <div className={styles.hamburgerEl}></div>
                    <div className={styles.hamburgerEl}></div>
                </div>
                <div className={styles.chatHeader}>
                    {userType === 'admin' ?
                    <Link className={styles.logslink} to="/logs"><button className={styles.logs}> See Logs </button></Link>
                    : null
                    }
                    {
                    currentChat ?
                    <ChatHeader
                        name = {`${currentChat?.firstName} ${currentChat?.lastName}`}
                    />
                    :
                    null
                    }
                </div>
                <div className={styles.messages}>
                    {currentChat ? messages?.map((m)=> ( 
                        <div ref={scrollRef}>
                             <Message
                                type={m.senderID === userID ? "sent" : "recieved"}
                                time={m.time}
                                name={m.name}
                            >
                                {m.text}
                            </Message>
                        </div>
                    ))
                    :
                    <h3 className={styles.noChat} >Select someone from left to start chatting.</h3>
                }
                </div>
                {
                currentChat ?
                <div className={styles.input}>
                    <input onKeyPress={sendMessageKeyPress} placeholder="Type something to send message..." type="text" value={input} onChange={e => setInput(e.target.value)}/>
                    <button onClick={sendMessage}><img src={Send}/></button>
                </div>
                : null
                }
            </div>
        </div>
    )
}

export default Chat
