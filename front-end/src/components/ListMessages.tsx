import React, {useEffect,useState} from "react";
import {IState as Props} from "../App";
import MessageInstance from "./MessageInstance";

interface IProps {
    messages : Props["message"][],
}



const ListMessages: React.FC<IProps> = ({messages}) => {

    const RenderList = (): JSX.Element[] => {
        console.log("I am being called", messages)

        return messages.map(message => {
            console.log("going to render message",message)
            return (
                <li className = "List-Messages-item" key = {message.url.toString()}>
                    <MessageInstance message = {message}/>
                </li>
            )
        }) 

    }
    return (
        <ul className="List-Messages" >
            {messages.length}
            {RenderList()}
        </ul>
    )

}

export default ListMessages;