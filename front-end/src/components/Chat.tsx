import React, {  useEffect,useState, useRef} from "react";
import {IState as Props} from "../App";
import ListMessages from "./ListMessages";
import User from "./User";
import CreateMessage from "./CreateMessage"

interface IProps{
    chat: Props['chat'],
}

let previousChatUrl : string = "" 

const Chat : React.FC<IProps>  = ({chat}) =>{
    const [messages, setMessages] = useState<Props["message"][]>([])
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
            console.log("revived", recived)
            switch (recived?.type){
                case "MessageCreated":
                    console.log("hi")
                    setMessages(messages => [...messages, recived.data])
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




    return (
        <div className="chat">
            <p className="name-Chat">{chat.name}</p>
            <ListMessages messages = {messages} setMessages = {setMessages} /> 
            <CreateMessage  chat={chat} ws = {wsRef} />
            <ul className="list-Users">
                {renderList()}
            </ul>
                    
            

        </div>
    )
}

export default Chat