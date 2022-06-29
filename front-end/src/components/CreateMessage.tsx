import React, {useContext, useEffect,useState} from "react";
import {IState, IState as Props} from "../App";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import AuthUserContext from "../contexts/AuthUserContext"

interface IProps{
    chat: IState['chat']
}



const CreateMessage :React.FC<IProps>  = ({chat}) =>{


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
        //post message to the api
        //TODO:fetch user 
        await axios.post('/endpoints/messages/',{
            text:input.text,
            chat:chat.url,
            user: user.url
        }).then(res => console.log("respond: ",res," data: ",res.data))
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


