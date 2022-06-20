import React, {useEffect} from "react";
import {IState as Props} from "../App";

interface IProps{
    setChats: React.Dispatch<React.SetStateAction<Props['chats']>>,
    chats : Props["chats"];
    setMessages: React.Dispatch<React.SetStateAction<Props['message'][]>>,
}
//TODO: change into class component
const ListChats: React.FC<IProps> = ({chats, setChats,setMessages})  => {

  useEffect(() => {
        const getchats = async () => {
            const res = await fetch("/endpoints/chats/");
            const data = await res.json();
            const chats = data.results.map(({ name, users, url }:any) => ({
                name,
                users,
                url,
            }));
            console.log(chats);
            setChats(chats);
        };
        getchats();
    }, [setChats]);

    const renderList = (): JSX.Element[] => {
        let pk : number = 0;
        return chats.map(chat => {
            pk++;
            return (
                <li className= "Chats-List-item" key={pk} 
                    onClick={() => {
                            console.log("chat has been clicked",chat.url)
                            const fetchChatMessages = async () =>{
                                const res = await fetch(chat.url);
                                const data = await res.json();
                                console.log("chat messages data",data.messages)
                                const messagesURL : URL[] = data.messages.map(({url}:any) => url);
                                
                                let fetchedMessages : Props['message'][] = [];
                                messagesURL.forEach(async (message) => {
                                    const res = await fetch(message);
                                    const data = await res.json();
                                    console.log("message data",data)
                                    fetchedMessages.push(data);
                                }
                                )
                                console.log("fetched messages",fetchedMessages)
                                setMessages(fetchedMessages);
                                

                            }
                            fetchChatMessages();
                    }}
                
                >
                    <h2>{chat.name}</h2>
                    <p>Users : {chat.users.length}</p>
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


        


    




