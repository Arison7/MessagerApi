import React, {useEffect,useState} from "react";
import {IState as Props} from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Options from "./Options"

interface IProps{
    message : Props["message"],
}


const MessageInstance: React.FC<IProps> = ({message}) => {

    const [isOpen,setIsOpen] = useState<boolean>(false)
    const handleClick = () => {
        setIsOpen(!isOpen)
    }
    
    return (
        <div className = "text-Message">
            <FontAwesomeIcon icon={faEllipsisVertical} onClick= {handleClick}/>
            {message.text}
            <Options isOpen = {isOpen} message = {message}/>
        </div>
    )

}

export default MessageInstance;