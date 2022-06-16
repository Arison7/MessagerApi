import React from "react";
import {IState as Props} from "../App";

interface IProps{
    chats : Props["chats"];
}


const ListChats: React.FC<IProps> = ({chats}) => {

    const renderList = (): JSX.Element[] => {
        return chats.map(chat => {
            return (
                <li className= "Chats-List-item">
                    <div className="Chats-List-field">
                        <h3>{chat.name}</h3>
                        <p>Users : {chat.users.length}</p>
                    </div>
                    
                </li>

            )
        })
        }
        return (
            <ul className="Chats-List">
                {renderList()}
            </ul>
        )
        }

export default ListChats;


        


    




