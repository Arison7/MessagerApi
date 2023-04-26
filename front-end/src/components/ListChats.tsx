import React, { useEffect, useState} from "react";
import {IState as Props} from "../App";
import debounce from "../functions/debounce";
import {faComments} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
interface IProps{
    setChats: React.Dispatch<React.SetStateAction<Props['chat'][]>>,
    chats : Props["chat"][],
    setSingleChat: React.Dispatch<React.SetStateAction<Props['chat']>>,
    setPopUp: React.Dispatch<React.SetStateAction<boolean>>,
}





const ListChats: React.FC<IProps> = ({chats, setChats,setSingleChat , setPopUp})  => {

    //? adds a state to control resizing of the window
    const [dimentions, setDimentions] = useState<{height:number, width:number}>({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    //? adds a state to keep track when chats container is open
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth > 600)
                setOpen(false);
                setDimentions({
                    height: window.innerHeight,
                    width: window.innerWidth,
            });
        }
        const getchats = async () => {
            const res = await fetch("/endpoints/chats/");
            const data = await res.json();
            console.log("data",data)
            const chats = data.results.map(({ name, users, url, inviteLink }:any) => ({
                url,
                inviteLink,
                name,
                users,
            }));
            //console.log("fetching chats",chats);
            setChats(chats);
        };
        window.addEventListener("resize", debounce(handleResize));
        getchats();
        return () => window.removeEventListener("resize", debounce(handleResize));
    }, []);



    const renderList = (): JSX.Element[] => {
        let pk : number = 0;
        return chats.map(chat => {
            pk++;
            return (
                <li className= "list-Chats-item" key={pk} 
                    onClick= {() => {
                        setSingleChat({
                            url: chat.url,
                            name: chat.name,
                            inviteLink: chat.inviteLink,
                            users: chat.users
                        })
                        setOpen(false);
                    }

                    } 
                >
                    <h2>{chat.name}</h2>
                    <p>Users : {chat.users.length}</p>
                </li>

            )
        })
        }
        console.log("chats",chats);
        if(dimentions.width < 600){
            if(open){
                return(
                    <div style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                    }}>
                        <div className="list-Chats" style={{animation: "slideInLeft 0.7s ease-in-out"}}>
                            <h1 className="category-Title">Chats</h1>
                            <span className="line-Break"></span>
                            <ul>
                                {renderList()}
                            </ul>
                            <div className="button-Container">
                                <button onClick={() => setPopUp(true)}>Create Chat</button>
                                <button onClick={() => window.location.href = '/logout/'}>Logout</button>
                            </div>
                        </div>
                        <div className="list-Chats-Grey-Area grey-Area" onClick={()=> {setOpen(false)}} ></div>
                    </div>
                )
            }else{
                return (
                    <FontAwesomeIcon icon={faComments} className="chats-List-Button" onClick={() => setOpen(true)}/>
                )
            }
        }else{
            return (
                <div className="list-Chats" >
                    <h1 className="category-Title">Chats</h1>
                    <span className="line-Break"></span>
                    <ul>
                        {renderList()}
                    </ul>
                    <div className="button-Container">
                        <button onClick={() => setPopUp(true)}>Create Chat</button>
                        <button onClick={() => window.location.href = '/logout/'}>Logout</button>
                    </div>
                </div>
            )
        }
    }

export default ListChats;


        


    




