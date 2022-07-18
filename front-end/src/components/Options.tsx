import React, {useContext} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen , faDeleteLeft} from '@fortawesome/free-solid-svg-icons'
import { IState as Props} from "../App";
import InputContext from "../contexts/InputContext";
import WebsocketContext from "../contexts/WebsocketContext";
import Cookies from "js-cookie";
import axios from "axios";

interface IProps{
    isOpen : boolean,
    message : Props["message"],
}

const Options : React.FC<IProps> = ({isOpen, message}) => {
    const input = useContext(InputContext)
    const ws = useContext(WebsocketContext)

    const handleEdit = () => {
        input.setInput({
            messageUrl : message.url,
            text: message.text
        })
    }

    const handleDelete = async () => {
        const csrftoken : string = Cookies.get('csrftoken') as string
        //if there is no token we can simple return 
        if(!csrftoken)
            return

        //delete message from the api
        await axios.delete(message.url, {headers: {'X-CSRFToken': csrftoken}}).then(
            res => {
                console.log('res',res)
                if(res.status === 200){
                    const toSend : string  = JSON.stringify({
                        "action" : "MessageDeleted",
                        "data" : res.data
                    })
                    ws?.send(toSend)
            }}
        )



    }

    if(isOpen){
        return (
            <div className = "options-Message">
                <div className = "update-Message">
                    <FontAwesomeIcon icon={faPen} onClick = {handleEdit}/>
                </div>
                <div className = "delete-Message">
                    <FontAwesomeIcon icon={faDeleteLeft} onClick = {handleDelete}/>
                </div>
            </div>
        )

    }else {
        return null
    }


}

export default Options;