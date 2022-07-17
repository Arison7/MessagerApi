import React, {useContext, useEffect,useState} from "react";
import {IState, IState as Props} from "../App";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import AuthUserContext from "../contexts/AuthUserContext"
import Cookies from "js-cookie"

interface IProps{
    chat: IState['chat']
    ws : React.MutableRefObject<WebSocket | undefined> 
}



const CreateMessage :React.FC<IProps>  = ({chat,ws}) =>{


    const [input,setInput] = useState({
        text: ""
    })

    const user = useContext(AuthUserContext)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> ) => {
        setInput({
            text: e.target.value
        })
    }
    const handleClick = async () =>{
        //cannot sent an empty message
        if(!input.text) return;

        //gets csrftoken from the browser cookies
        const csrftoken : string = Cookies.get('csrftoken') as string
        //if there is no token we can simple return 
        if(!csrftoken)
            return
            
        const data =  {
            text:input.text,
            chat:chat.url,
            author: user.url
        };

        //post message to the api
        await axios.post<Props['message']>('/endpoints/messages/',data,
            {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                if(res.status === 201){
                    const toSend : string  = JSON.stringify({
                        "action" : "MessageCreated",
                        "data" : res.data
                    })
                    ws.current?.send(toSend)
                }});
        setInput({
            text: ""
        })

    }



    return (
        <div className="create-Message">
            <textarea
                name="newMessage"
                onChange={handleChange}
                className="create-Message-input" 
                placeholder="Type message ..."
                value = {input.text}
            />
            <FontAwesomeIcon icon={faPaperPlane} onClick= {handleClick}/>

        </div>

    )



}

export default CreateMessage;


