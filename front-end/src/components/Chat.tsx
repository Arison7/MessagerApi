import React, {useContext, useEffect,useState, useRef} from "react";
import {IState as Props, IContext, IState} from "../App";
import ListMessages from "./ListMessages";
import User from "./User";
import CreateMessage from "./CreateMessage"
import  InputContext  from "../contexts/InputContext";
import WebsocketContext from "../contexts/WebsocketContext";
import axios from "axios";
import Cookies from "js-cookie";
import {faUser,faUsers} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import debounce from "../functions/debounce";
interface IProps{
    chat: Props['chat'],
    setPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    setChats: React.Dispatch<React.SetStateAction<IState['chat'][]>>,
    setSingleChat: React.Dispatch<React.SetStateAction<IState['chat']>>,
}


const Chat : React.FC<IProps>  = ({chat, setPopUp, setChats, setSingleChat}) =>{
    const [messages, setMessages] = useState<Props["message"][]>([])
    const [input,setInput] = useState<Props['input']>({
        text: "",
        messageUrl: null
    })
    const [buttonContent, setButtonContent] = useState<string>("Copy invite link")

    //? adds a state to control resizing of the window
    const [dimentions, setDimentions] = useState<{height:number, width:number}>({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    //? adds a state to keep track when chats container is open
    const [open, setOpen] = useState<boolean>(false);

    const wsRef = useRef<WebSocket>()

    useEffect(()=>{

        const handleResize = () => {
            if(window.innerWidth > 600)
                setOpen(false);
                setDimentions({
                    height: window.innerHeight,
                    width: window.innerWidth,
                });
        }
        window.addEventListener("resize", debounce(handleResize));

        //if users haven't yet selected a chat we can return without doing anything
        if(!chat.url){
            return
        }

        
        //get messages from the api
        const getMessages = async ()  => {
            const res = await fetch(chat.url + "messages/")
            const data = await res.json();
            const msgs = data.results.reverse().map(({url, text, author, author_name, chat, created_at, updated_at }: any) => ({
                url,
                text,
                author,
                author_name,
                chat,
                created_at,
                updated_at
            }));
            setMessages(msgs)
        }
        getMessages()
        return () => window.removeEventListener("resize", debounce(handleResize));
    },[chat])

    useEffect(()=>{
        //if users haven't yet selected a chat we can return without doing anything
        if(!chat.url){
            return
        }
        //get correct endpoint for the websocket
        const loc = window.location
        const wsStart = (loc.protocol == "https:" ? "wss://" : "ws://")

        //connect to the websocket
        const endpoint = wsStart + loc.host + "/endpoints/chats/" + chat.url[chat.url.length -2] + "/"

        //getting a reference to the websocket
        const ws : WebSocket = new WebSocket(endpoint)
        wsRef.current = ws
        

        ws.onopen = (e) => {
            console.log("connected", e)
        }
        ws.onmessage = (e) => {
            
            const recived = JSON.parse(e.data)

            /*
            ? recived data got from api should contain the action field with relates to:
            * MessageCreated ==> new message was created
            * MessageUpdated ==> message was updated
            * MessageDeleted ==> message was deleted
            */
            switch (recived?.type){
                case "MessageCreated":
                    console.log("creating a message")
                    setMessages(messages => [ ...messages,recived.data])
                    break;
                case "MessageUpdated":
                    console.log("updating a message")
                    setMessages(messages => {
                        const newMessages = messages.map(m => {
                            if(m.url === recived.data.url){
                                return recived.data
                            }
                            return m
                        }
                        )
                        return newMessages
                    })
                    break;
                case "MessageDeleted":
                    console.log("deleting a message")
                    setMessages(messages => {
                        return messages.filter(m => m.url !== recived.data.url)
                    })
                    break;
                default:
                    //well this is a problem if we get here
                    console.log("unknown message type", e)
            }
        }
        ws.onclose = (e) => {
            console.log("closed", e)
        }
        ws.onerror = (e) => {
            console.log("error", e)
        }


    return () => {ws.close()}    

    },[chat])
    //? renders users
    const renderList = (): JSX.Element[] | JSX.Element => {
        //? checks if chat has been selected
        if(chat.name){
            return (
                chat.users?.map(user => {
                    return (
                        <li className="list-Users-Container">
                            <FontAwesomeIcon icon={faUser}/>
                            <User user = {user}/>
                        </li>)
                })
        )}else{
            return (<li></li>);
        }
        

    }
    //? creates input context base on the input state
    const inputValue : IContext['input'] = {
        ...input,
        setInput,
    }

    //? handles closing the pop up if chat is pressed
    const handleClick = () => {
        setPopUp(false);
    }

    //? handles user leaving the chat 
    const handleLeave = async () => {
        const data = {
            "action": "quit",
        }
        //get crftken
        const csrftoken : string = Cookies.get('csrftoken') as string
        //if there is no token we can simple return
        if(!csrftoken)
            return

        axios.patch(chat.url, data, {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
            console.log(res)
            if(res.status === 200){
                setChats(chats => {
                    return chats.filter(c => c.url !== chat.url)
                })
                //updates the single chat state to empty
                setSingleChat({
                    url: "",
                    name: "",
                    inviteLink: "",
                    users: [],
                })
                setMessages([])
            }
        }
        )
    }
    //? handles user copying the chat url
    const handleCopy = async() => {
        setButtonContent("Copied!")
        if('clipboard' in navigator){
            return await navigator.clipboard.writeText(chat.inviteLink)
        }
        return document.execCommand('copy',true,chat.inviteLink)

    }
    //? handles user leaving the chat
    const handleMouseLeave = async () => {
        setTimeout(() => {
            setButtonContent("Copy invite link")
        },5000)

    }

    //? creates websocket context base on the websocket reference
    const webSocketValue : WebSocket | undefined = wsRef.current

    const edit : JSX.Element | null = input.messageUrl ? (
        <div className = "remove-Edit" 
            onClick = {() => {
                setInput({
                    messageUrl : null,
                    text: "" 
                })
            }}
        >
            Cancel edit
        </div>
    ) : null
    //renders quit button if user sellected a chat
    const menu : JSX.Element | null = chat.url.length !== 0 ? (
        <div className = "menu-Chat">
            <button className= "copy-Inv-Chat" onClick={handleCopy} onMouseLeave={handleMouseLeave}>{buttonContent}</button>
            <button className="leave-Btn-Chat" onClick={handleLeave}>Leave the chat room</button>
        </div>
    ) : null

    if(dimentions.width < 600){
        if(open){
            return (
                <div className="chat" onClick={handleClick}>
                    <p className="name-Chat">{chat.name}</p>
                    {edit}
                    <WebsocketContext.Provider value={webSocketValue}>
                        <InputContext.Provider value={inputValue}>
                            <ListMessages messages = {messages} setMessages = {setMessages} /> 
                            <CreateMessage  chat={chat}  />
                        </InputContext.Provider>
                    </WebsocketContext.Provider>
                    <div className="list-Users-Container" style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                    }}>
                        <div className="list-Users" style ={{animation : "slideInRight 0.7s ease-in-out"}}>
                            <h1 className="category-Title">Users</h1>
                            <span className="line-Break"></span>
                            <ul className="list-Users-Ul">
                                {renderList()}
                            </ul>
                            {menu}
                        </div>
                        
                    <div className="users-Grey-Area grey-Area" onClick={()=> {setOpen(false)}}></div>
                    </div>

                </div>
            )
        }else{
            return (
                <div className="chat" onClick={handleClick}>
                    <p className="name-Chat">{chat.name}</p>
                    {edit}
                    <WebsocketContext.Provider value={webSocketValue}>
                        <InputContext.Provider value={inputValue}>
                            <ListMessages messages = {messages} setMessages = {setMessages} /> 
                            <CreateMessage  chat={chat}  />
                        </InputContext.Provider>
                    </WebsocketContext.Provider>
                    <FontAwesomeIcon icon={faUsers} className="users-Button" onClick = {()=>{setOpen(true)}}/>
                </div>
            )
        }
    }else{
        return (
            <div className="chat" onClick={handleClick}>
                <p className="name-Chat">{chat.name}</p>
                {edit}
                <WebsocketContext.Provider value={webSocketValue}>
                    <InputContext.Provider value={inputValue}>
                        <ListMessages messages = {messages} setMessages = {setMessages} /> 
                        <CreateMessage  chat={chat}  />
                    </InputContext.Provider>
                </WebsocketContext.Provider>
                <div className="list-Users">
                    <h1 className="category-Title">Users</h1>
                    <span className="line-Break"></span>
                    <ul className="list-Users-Ul">
                        {renderList()}
                    </ul>
                    {menu}
                </div>
            </div>
        )
    }
}
export default Chat