import React, {useContext, useEffect,useState} from "react";
import {IState, IState as Props} from "../App";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import AuthUserContext from "../contexts/AuthUserContext"
import InputContext from "../contexts/InputContext";
import WebsocketContext from "../contexts/WebsocketContext";
import Cookies from "js-cookie"

interface IProps{
    chat: IState['chat']
}



const CreateMessage :React.FC<IProps>  = ({chat}) =>{
    


    const user = useContext(AuthUserContext)
    const input = useContext(InputContext)
    const ws = useContext(WebsocketContext)



    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement> ) => {
        //set input.text to e.target.value while keeping input.messageUrl not changed
        input.setInput({
            text: e.target.value,
            messageUrl: input.messageUrl
        })

    
    }
    const handleClick = async () =>{
        //cannot sent an empty message
        if(!input.text) return;
        console.log("input.messageUrl",input.messageUrl) 
        //gets csrftoken from the browser cookies
        const csrftoken : string = Cookies.get('csrftoken') as string
        //if there is no token we can simple return 
        if(!csrftoken)
            return

        if(input.messageUrl === null){
                
            const data =  {
                text:input.text,
                chat:chat.url,
                author: user.url
            };

            //post message to the api
            await axios.post<Props['message']>('/endpoints/messages/',data,
                {headers: {'X-CSRFToken': csrftoken}})
                .then(res => {
                    console.log('res',res)
                    if(res.status === 201){
                        const toSend : string  = JSON.stringify({
                            "action" : "MessageCreated",
                            "data" : res.data
                        })
                        ws?.send(toSend)
                    }});
        }else{
            //update message

            const data =  {
                text:input.text,
            };

            //update message to the api
            console.log("updating")
            await axios.patch<Props['message']>(input.messageUrl,data,
                {headers: {'X-CSRFToken': csrftoken}})
                .then(res => {
                    if(res.status === 200){
                        const toSend : string  = JSON.stringify({
                            "action" : "MessageUpdated",
                            "data" : res.data
                        })
                        ws?.send(toSend)
                    }}
                ); 



        }
        input.setInput({
            text: "",
            messageUrl: null
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


