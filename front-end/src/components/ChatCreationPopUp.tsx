import React, {useEffect, useState} from 'react';
import { IState as Props} from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import Cookies from "js-cookie";


interface IProps {
    popUp : Props['popUp']
    setPopUp: React.Dispatch<React.SetStateAction<Props['popUp']>>
    setChats: React.Dispatch<React.SetStateAction<Props['chat'][]>>,
    setSingleChat: React.Dispatch<React.SetStateAction<Props['chat']>>,
}

const ChatCreationPopUp : React.FC<IProps> = ({popUp,setPopUp,setChats,setSingleChat}) => {

    const [name, setName] = useState('');

    const handleClick = async () => {
        //cannot create a chat with an empty name
        if(!name) return;
        //gets csrftoken from the browser cookies
        const csrftoken : string = Cookies.get('csrftoken') as string
        //if there is no token we can simple return
        if(!csrftoken)
            return
        const data = {
            name: name
        }
        await axios.post<Props['chat']>('/endpoints/chats/',data,
            {headers: {'X-CSRFToken': csrftoken}})
            .then(res => {
                console.log('res',res)
                if(res.status === 201){
                    console.log('res.data',res.data)
                    setChats(chats => [...chats,res.data].sort())
                    setSingleChat(res.data)
                }
            })
        
        setName('');
        setPopUp(false)

    }
    const handleClickOutside = (e: any) => {
        setName('');
        setPopUp(false);
    }


    

    if(!popUp) 
        return null
    return (
        <div className="chat-Creation-Pop-Up" >
            <div className='grey-Area pop-Up-Grey' onClick={handleClickOutside}></div>
            <div className='colorful-area'></div>
            <p>Create a new chat!</p>
            <div className='chat-Creation-Form-Body'>
                <textarea
                    value={name}
                    name= "newChatName"
                    onChange={(e) => setName(e.target.value)}
                    maxLength={24}
                    placeholder="Enter chat's name"
                />
                <div className='tick-Container' onClick = {handleClick} >
                    <FontAwesomeIcon icon={faCheck} style={{color: "#ffffff"}} />
                </div>
            </div>
            
            

        </div>
    );


}

export default ChatCreationPopUp;

