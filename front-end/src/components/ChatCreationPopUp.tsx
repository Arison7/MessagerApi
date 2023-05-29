import React, {useState} from 'react';
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

    //name of the chat to be created
    const [name, setName] = useState('');

    const handleClick = async () => {
        //cannot create a chat with an empty name
        //there is a server side validation as well
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
                //if the chat was created successfully
                if(res.status === 201){
                    //adds chat to the list 
                    setChats(chats => [...chats,res.data].sort())
                    //sets the chat as the current chat
                    setSingleChat(res.data)
                }
            })
        //clears the form and closes the pop up
        setName('');
        setPopUp(false)

    }
    //closes the pop up if the user clicks outside of it
    const handleClickOutside = (e: any) => {
        setName('');
        setPopUp(false);
    }

    
    if(!popUp) 
        //if the pop isn't open we don't render anything 
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

