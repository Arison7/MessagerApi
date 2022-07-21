import React, { useEffect} from "react";
import {IState as Props} from "../App";

interface IProps{
    setChats: React.Dispatch<React.SetStateAction<Props['chat'][]>>,
    chats : Props["chat"][],
    setSingleChat: React.Dispatch<React.SetStateAction<Props['chat']>>,
    setPopUp: React.Dispatch<React.SetStateAction<boolean>>,
}




//TODO: change into class component
const ListChats: React.FC<IProps> = ({chats, setChats,setSingleChat , setPopUp})  => {

  useEffect(() => {
        const getchats = async () => {
            const res = await fetch("/endpoints/chats/");
            const data = await res.json();
            console.log("data",data)
            const chats = data.results.map(({ name, users, url, invite_link }:any) => ({
                url,
                inviteLink: invite_link,
                name,
                users,
            }));
            //console.log("fetching chats",chats);
            setChats(chats);
        };
        getchats();
    }, []);



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
                            inviteLink: chat.inviteLink,
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
        console.log("chats",chats);
        return (
            <div className="list-Chats" >
                <ul>
                    {renderList()}
                </ul>
                <button onClick={() => setPopUp(true)}>Create Chat</button>
            </div>
        )
        }

export default ListChats;


        


    




