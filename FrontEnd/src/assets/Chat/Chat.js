import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styles from './chat.module.css'
import Message from '../../components/Message/Message'
import Card from '../../components/Card/Card'
import GroupCard from '../../components/GroupCard/GroupCard'
import ChatHeader from '../../components/ChatHeader/ChatHeader'
import Send from '../../images/send.svg'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import LogOut from '../../images/log-out.svg'
import Logo from '../../images/logo.svg'
import { io } from 'socket.io-client'


const Chat = () => {
    const [messages, setMessages] = useState([]) //Messages in chat screen
    const [input, setInput] = useState("") //Message input
    const [users, setUsers] = useState() //Users on the left frame
    const [chats, setChats] = useState([])
    const [user, setUser] = useContext(AuthContext)
    const [currentChat, setCurrentChat] = useState() //Current chat indicator
    const [showChat, setShowChat] = useState(false) //For responsiveness
    const [chatCount, setChatCount] = useState(0)
    const scrollRef = useRef() //To scroll chat screen after sending message
    const [loading, setLoading] = useState(false)
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const socket = useRef()
    const history = useHistory()

    //Remove after auth
    const userType = user.isAdmin ? 'admin' : 'user'

    useEffect(() => {
       socket.current = io("ws://localhost:8000")
       socket.current.on("getMessage", data => {
           setArrivalMessage({
               sender: data.senderId,
               text: data.text,
               createdAt: new Date().toString()
           })
       })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.filter(m => m._id === arrivalMessage.sender).length > 0 &&
        setMessages( prevMessages => [...prevMessages, arrivalMessage])
        console.log(messages)
    }, [arrivalMessage])

    useEffect( ()=>{
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", users => {
            console.log(users)
        })
    }, [user])
    
    useEffect(()=>{
        //Scroll to bottom
        scrollRef.current?.scrollIntoView( {behavior: "smooth"} )
    },[messages, currentChat, loading])

    useEffect(()=>{
        console.log(user)
        //Get all users
        const getUsers = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/users/getUsers")
                console.log(res)
                setUsers(res.data.data)
            } catch (e) {
                console.log(e.response)
            }
        }

        getUsers()
    },[])

    useEffect(()=>{
        //Get all conversations
        const getConversations = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/conversations/getConversation/${user._id}`)
                console.log(res.data.data)
                setChats(res.data.data)
            }
            catch (e) {
                console.log(e.response)
            }
        }
        getConversations()
    },[chatCount, arrivalMessage])



    const getMessages = async (id) => {
        setLoading(true)
        //Get messages from a conversation
        try {
            console.log(id)
            const res = await axios.get(`http://localhost:8000/api/messages/getMessages/${id}`)
            setMessages(res.data.data)
            setLoading(false)
            console.log(res.data.data)
        } catch (e) {
            console.log(e.response)
            setLoading(false)
        }
    }

    const addZero = (i) => {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
    }   

    const sendMessage = async () => {
        //Send a mesage to a conversation
        if(!input) return
        const receiverId = currentChat?.members.find(member => member._id !== user._id)
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: input
        })

        try {
            const res = await axios.post("http://localhost:8000/api/messages/newMessage/", {
            conversationId: currentChat,
            senderId: user._id,
            text: input
        })
        console.log(res)
        setMessages(prevMessages => [...prevMessages, res.data.data])
        }catch (e) {
            console.log(e.response)
        }
        setInput("")
    }

    const createConversation = async (id) => {
        //Create a conversation with someone from user list

        //Check if that conversation already exists.
        let flag = false
        chats.forEach(c => {
            c.members.forEach( m => {
                if(m._id === id) {
                    flag = true
                }
            })
        })
        //If does not exist
        if (flag === false) {
        try {
            const res = await axios.post("http://localhost:8000/api/conversations/newConversation", {
            senderId: user._id,
            receiverId: id
        })
        setChats(prevChat => [...prevChat, res.data.data])
        setChatCount(prev => prev + 1)
        console.log(res)
        } catch (e) {
            console.log(e.response)
        }
    }
    }

    const sendMessageKeyPress = async (e) => {
        //Send message with enter
        if (e.key === 'Enter' && input) {
            const receiver = currentChat.members.find( member => member._id !== user._id )
            const receiverId = receiver._id
            console.log(receiverId)
            socket.current.emit("sendMessage", {
                senderId: JSON.parse(localStorage.getItem("user"))._id,
                receiverId,
                text: input
            })
            try {
                const res = await axios.post("http://localhost:8000/api/messages/newMessage/", {
                conversationId: currentChat,
                senderId: user._id,
                text: input
            })
            setMessages(prevMessages => [...prevMessages, {
                conversationId: currentChat,
                senderId: user._id,
                text: input,
                createdAt: new Date().toString()
            }])
            }catch (e) {
                console.log(e.response)
            }
            setInput("")
        }
    }

    const logOut = () => {
        setUser(null)
        socket.current?.emit('forceDisconnect')
        localStorage.clear()
        history.push('/')
    }
    //Template
    return (
        <div className={styles.chat} >
            <div className={showChat ? styles.show : styles.left}>
                <div className={styles.userInformation}>
                    <img width="48px" src={Logo} alt="" />
                    <p>{user.firstName} {user.lastName}</p>
                    <button onClick = {logOut} ><img src={LogOut} alt="logout"/></button>
                </div>
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
                        {
                            chats.length > 0 ? chats.map(c => (
                                <div onClick={ () => {
                                    //If a conversation is clicked, set it as current chat, get all messages. 
                                    setCurrentChat(c)
                                    getMessages(c._id)
                                    //For responsiveness
                                    if (window.innerWidth <= 700) {
                                        setShowChat(!showChat)
                                    }
                                }}>
                                <Card
                                    conversation = {c}
                                    current = {currentChat === c ? true : false}
                                >
                                </Card>
                                </div>
                            ))
                            :
                            <p style={{alignSelf:'center', marginBottom:'1rem'}}> <em>No active chats.</em> </p>
                        }
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
                                //If a user is clicked, starts a conversation with them.
                                <div onClick={ () => {
                                        createConversation(u._id)
                                        //For responsiveness
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
                        conversation = {currentChat}
                    />
                    :
                    null
                    }
                </div>
                <div className={styles.messages}>
                    {!loading ? currentChat ? messages.length > 0 ? messages?.map((m)=> ( 
                        <div ref={scrollRef}>
                             <Message
                                type={m.sender ? (m.sender === user._id ? "sent" : "recieved") : m.senderId._id ? (m.senderId._id === user._id ? "sent" : "recieved") : (m.senderId === user._id ? "sent" : "recieved")}
                                time={addZero(new Date(m.createdAt).getHours()) + ':' + addZero(new Date(m.createdAt).getMinutes())}
                            >
                                {m.text}
                            </Message>
                        </div>
                    ))
                    :
                    <h3 className={styles.noMsg} >You don't have any messages with this user.</h3>
                    :
                    <h3 className={styles.noChat} >Select someone from left to start chatting.</h3>
                    :
                   <div style={{textAlign:'center'}} >
                        <Loader
                            type="ThreeDots"
                            color="#348C74"
                            height={70}
                            width={70}
                            timeout={3000} //3 secs
                        />
                   </div>
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
