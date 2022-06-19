import React, {useEffect, useMemo} from "react";
import {IState as Props} from "../App";

interface IProps{
    setChats: React.Dispatch<React.SetStateAction<IProps['chats']>>,
    chats : Props["chats"];
}

const ListChats: React.FC<IProps> = ({chats, setChats}) => {

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
    }, []);

    const renderList = (): JSX.Element[] => {
        let pk : number = 0;
        return chats.map(chat => {
            pk++;
            return (
                <li className= "Chats-List-item" key={pk}>
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


        


    




