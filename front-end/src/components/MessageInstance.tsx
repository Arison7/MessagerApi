import React, {memo,useState, useContext} from "react";
import {IState as Props} from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import AuthUserContext from "../contexts/AuthUserContext";
import Options from "./Options"

interface IProps{
    message : Props["message"],
}


const MessageInstance: React.FC<IProps> = memo(({message}) => {
    const user = useContext(AuthUserContext)


    const [isOpen,setIsOpen] = useState<boolean>(false)
    const handleClick = () => {
        setIsOpen(!isOpen)
    }
    if (user.url == message.author) {
        return (
            <div className = "text-Message-Author">
                <FontAwesomeIcon icon={faEllipsisVertical} onClick= {handleClick}/>
                {message.text}
                <Options isOpen = {isOpen} message = {message}/>
            </div>
        )
    }
    return (
        <div className = "text-Message-Other">
            {message.text}
        </div>
    )

})

export default MessageInstance;