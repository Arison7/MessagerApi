import React, {  useEffect,useState, useRef} from "react";
import {IState as Props, IContext, IState} from "../App";
import ListMessages from "./ListMessages";
import User from "./User";
import CreateMessage from "./CreateMessage"
import  InputContext  from "../contexts/InputContext";
import WebsocketContext from "../contexts/WebsocketContext";

interface IProps{
    chat: Props['chat'],
}

let previousChatUrl : string = "" 

const Chat : React.FC<IProps>  = ({chat}) =>{
    const [messages, setMessages] = useState<Props["message"][]>([])
    const [input,setInput] = useState<Props['input']>({
        text: "",
        messageUrl: null
    })
    const wsRef = useRef<WebSocket>()
    //console.log("chat",chat)
    useEffect(()=>{
        if(!chat.url){
            return
        }
        if(previousChatUrl === chat.url){
            return
        }
        previousChatUrl = chat.url
        const getMessages = async ()  => {
            const res = await fetch(chat.url + "messages/")
            const data = await res.json();
            console.log(data);
            const msgs = data.results.map(({url, text, author, chat, createdAt, updatedAt }: any) => ({
                url,
                text,
                author,
                chat,
                createdAt,
                updatedAt
            }));
            setMessages(msgs)
        }
        getMessages()
    },[chat])

    useEffect(()=>{
        if(!chat.url){
            return
        }
        const loc = window.location
        const wsStart = (loc.protocol == "https:" ? "wss://" : "ws://")

        const endpoint = wsStart + loc.host + "/endpoints/chats/" + chat.url[chat.url.length -2] + "/"
        console.log("endpoint",endpoint);
        const ws : WebSocket = new WebSocket(endpoint)
        wsRef.current = ws
        

        ws.onopen = (e) => {
            console.log("connected", e)
            const m = {
                text: "hello",
                chat: chat.url,
            }
            const n  = JSON.stringify(m)
            ws.send(n)
        }
        ws.onmessage = (e) => {
            console.log("message", e)
            console.log("message", e.type)
            const recived = JSON.parse(e.data)
            console.log("recived", recived)
            switch (recived?.type){
                case "MessageCreated":
                    console.log("creating a message")
                    setMessages(messages => [...messages, recived.data])
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
                        const newMessages = messages.filter(m => m.url !== recived.data.url)
                        return newMessages
                    })
                    break;
                default:
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

    const renderList = (): JSX.Element[] => {
        return (
            chat.users?.map(user => {
                return (<User user = {user}/>)
            })
        )

    }

    const inputValue : IContext['input'] = {
        ...input,
        setInput,
    }

    const webSocketValue : WebSocket | undefined = wsRef.current

    return (
        <div className="chat">
            <p className="name-Chat">{chat.name}</p>
            <WebsocketContext.Provider value={webSocketValue}>
                <InputContext.Provider value={inputValue}>
                    <ListMessages messages = {messages} setMessages = {setMessages} /> 
                    <CreateMessage  chat={chat} ws = {wsRef} setMessages = {setMessages} />
                </InputContext.Provider>
            </WebsocketContext.Provider>
            <ul className="list-Users">
                {renderList()}
            </ul>
                    
            

        </div>
    )
}

export default Chat