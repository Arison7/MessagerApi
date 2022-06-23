import { render } from "@testing-library/react";
import React, {useEffect,useState} from "react";
import {IState as Props} from "../App";
import MessageInstance from "./MessageInstance";

interface IProps {
    messagesURL : Props["message"]['url'][],
    messages: Props['message'][],
    setMessages : React.Dispatch<React.SetStateAction<Props['message'][]>>
}


const ListMessages: React.FC<IProps> = ({messagesURL,messages,setMessages}) => {
    useEffect(() => {
        const getMessages = async () => {
            setMessages([])
            messagesURL.map(async (url:URL) =>{
                const res = await fetch(url);
                const data = await res.json();
                //console.log("data",data)
                //TODO: this should be just one call
                setMessages((previousState) => {
                    return [
                        ...previousState,
                        {
                            url: data.url,
                            text: data.text,
                            author: data.author,
                            chat: data.chat,
                            createdAt: data.createdAt,
                            updatedAt: data.updatedAt
                        }
                    ]
                })
            })
        }
        getMessages()


    },[messagesURL])
    const RenderList = (): JSX.Element[] => {
        //console.log("messages",messages)
        return messages.map(msg => {
            //console.log("going to render message",msg)
            return (
                <li className = "List-Messages-item" key = {msg.url.toString()}>
                    <MessageInstance message = {msg}/>
                </li>
            )
        }) 

    }
    return (
        <ul className="List-Messages" >
            {RenderList()}
        </ul>
    )

}

export default ListMessages;