import React, {  useEffect,useState} from "react";
import {IState as Props} from "../App";
import ListMessages from "./ListMessages";
import User from "./User";
import CreateMessage from "./CreateMessage"

interface IProps{
    chat: Props['chat'],
}


const Chat : React.FC<IProps>  = ({chat}) =>{
    const [messages, setMessages] = useState<Props["message"][]>([])
    //console.log("chat",chat)
    useEffect(()=>{
        if(chat.url){
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
        }
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
            <CreateMessage  chat={chat} />
            <ul className="list-Users">
                {renderList()}
            </ul>
                    
            

        </div>
    )
}

export default Chat