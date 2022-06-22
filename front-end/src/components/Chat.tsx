import React, { useEffect} from "react";
import {IState as Props} from "../App";


interface IProps{
    chat: Props['chat'],
    setMessagesURL : React.Dispatch<React.SetStateAction<Props['message']['url'][]>>
}



const Chat : React.FC<IProps>  = ({chat , setMessagesURL}) =>{
    
    let urls: URL[] = [];
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
        return chat.users.map((user) =>{
            return(
                <li key = {user}>
                    {user}
                </li>
            )

        })

    }


    return (
        <div className="currentChat">
            <p>{chat.name}</p>
            <ul>
                {renderList()}
            </ul>
        </div>
    )
}

export default Chat