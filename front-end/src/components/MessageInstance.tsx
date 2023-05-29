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

    //?holds the state of the menu being open
    const [isOpen,setIsOpen] = useState<boolean>(false)
    //?holds the state of the menu being visible
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const handleClick = () => {
        setIsOpen(!isOpen)
    }
    const handleMouseEnter = () => {
        setIsVisible(true)
    }
    const handleMouseLeave = () => {
        setIsVisible(false)
        setIsOpen(false)
    }
    const getCurrentDate = () : string => {
        const date : Date = new Date(message.created_at);
        const formattedDate : string = date.toLocaleString([], {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        return formattedDate;

    }

    if (user.url === message.author ) {
        if (isVisible){
            return (
                <div className="message-Author" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <p className="message-Author-User">You</p>
                    <div className="message-Author-Text-Container">
                        <Options isOpen = {isOpen} message = {message} />
                        <FontAwesomeIcon icon={faEllipsisVertical} onClick= {handleClick} className = "message-Menu" />
                        <div className = "text-Message-Author">
                            {message.text}
                        </div>
                    </div>
                    <p className="message-Author-Date">{getCurrentDate()}</p>
                </div>
            )
        }else{
            return (
                <div className="message-Author" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <p className="message-Author-User">You</p>
                    <div className = "text-Message-Author">
                        {message.text}
                    </div>
                    <p className="message-Author-Date">{getCurrentDate()}</p>
                </div>
            )

        }
    }
    return (
        <div className="message-Other">
            <p className="message-Other-User">{message.author_name}</p>
            <div className = "text-Message-Other">
                {message.text}
            </div>
            <p className="message-Other-Date">{getCurrentDate()}</p>
        </div>
    )

})

export default MessageInstance;