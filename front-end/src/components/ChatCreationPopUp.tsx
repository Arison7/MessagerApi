import React, {useState} from 'react';
import { IState as Props} from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import Cookies from "js-cookie";


interface IProps {
    popUp : Props['popUp']
    setChats: React.Dispatch<React.SetStateAction<Props['chat'][]>>,
}

const ChatCreationPopUp : React.FC<IProps> = ({popUp,setChats}) => {

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
                }
            })
        setName('')

    }
    

    if(!popUp) 
        return null
    return (
        <div className="chat-creation-pop-up">
            <textarea
                value={name}
                name= "newChatName"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter chat name"
            />
            <FontAwesomeIcon icon= {faPlus} onClick = {handleClick}/>
            
            

        </div>
    );


}

export default ChatCreationPopUp;

