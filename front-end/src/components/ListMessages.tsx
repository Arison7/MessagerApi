import React, {useEffect,useState} from "react";
import {IState as Props} from "../App";
import MessageInstance from "./MessageInstance";

interface IProps {
    messages: Props['message'][],
    setMessages : React.Dispatch<React.SetStateAction<Props['message'][]>>
}


const ListMessages: React.FC<IProps> = ({messages,setMessages}) => {
    
    const RenderList = (): JSX.Element[] => {
        console.log("re render")
        return messages?.map(msg => {
            return (
                <li className = "list-Messages-item" key = {msg.url.toString()}>
                    <MessageInstance message = {msg}/>
                </li>
            )
        }) 

    }
    return (
        <ul className="list-Messages" >
            {RenderList()}
        </ul>
    )

}

export default ListMessages;