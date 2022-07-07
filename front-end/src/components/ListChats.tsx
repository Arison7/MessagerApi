import React, { useEffect} from "react";
import {IState as Props} from "../App";

interface IProps{
    setChats: React.Dispatch<React.SetStateAction<Props['chat'][]>>,
    chats : Props["chat"][],
    setSingleChat: React.Dispatch<React.SetStateAction<Props['chat']>>,
}




//TODO: change into class component
const ListChats: React.FC<IProps> = ({chats, setChats,setSingleChat})  => {

  useEffect(() => {
        const getchats = async () => {
            const res = await fetch("/endpoints/chats/");
            const data = await res.json();
            console.log(data)
            const chats = data.results.map(({ name, users, url }:any) => ({
                name,
                users,
                url,
            }));
            //console.log("fetching chats",chats);
            setChats(chats);
        };
        getchats();
    }, [setChats]);


    const renderList = (): JSX.Element[] => {
        let pk : number = 0;
        return chats.map(chat => {
            pk++;
            return (
                <li className= "list-Chats-item" key={pk} 
                    onClick= {() => 
                        setSingleChat({
                            url: chat.url,
                            name: chat.name,
                            users: chat.users
                        })
                    } 
                >
                    <h2>{chat.name}</h2>
                    <p>Users : {chat.users.length}</p>
                </li>

            )
        })
        }
        return (
            <ul className="list-Chats">
                {renderList()}
            </ul>
        )
        }

export default ListChats;


        


    




