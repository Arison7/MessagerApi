import React, { useEffect,useState} from "react";
import {IState as Props} from "../App";
import ListMessages from "./ListMessages";
import User from "./User";
import CreateMessage from "./CreateMessage"
interface IProps{
    chat: Props['chat'],
    setMessagesURL : React.Dispatch<React.SetStateAction<Props['message']['url'][]>>
    messagesURL : string[]
}


const Chat : React.FC<IProps>  = ({chat , setMessagesURL,messagesURL}) =>{
    const [messages, setMessages] = useState<Props["message"][]>([])
    const [user,setUser] = useState<Props["user"]>(
        {
            url : '',
            name: ''
        }
    )
    let urls: string[] = [];
    console.log("chat",chat)
    useEffect(()=>{
        if(chat.url){
            const getMessagesURL = async ()  => {
                const res = await fetch(chat.url)
                const data = await res.json();
                urls = data.messages;
                setMessagesURL(urls)
            }
            getMessagesURL()
        }
    },[chat])

    const renderList= () : JSX.Element[]  => {
        return chat.users.map((userURL) =>{
            return(
                <li key = {userURL}>
                    <User userURL={userURL} user = {user} setUser = {setUser}/>
                </li>
            )

        })

    }

    //TODO: change it to list and fetch one url each inside of MessageInstance
    return (
        <div className="chat">
            <p className="name-Chat">{chat.name}</p>
            <ListMessages messagesURL = {messagesURL} messages = {messages} setMessages = {setMessages} /> 
            <CreateMessage  chat={chat} />
            <ul className="list-Users">
                {renderList()}
            </ul>
        </div>
    )
}

export default Chat