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
        //? adds a function to handle resizing of the window
        const handleResize = () => {
            if(window.innerWidth > 600)
                setOpen(false);
                setDimentions({
                    height: window.innerHeight,
                    width: window.innerWidth,
            });
        }
        //? fetches chats from the server
        const getchats = async () => {
            const res = await fetch("/endpoints/chats/");
            const data = await res.json();
            const chats = data.results.map(({ name, users, url, inviteLink }:any) => ({
                url,
                inviteLink,
                name,
                users,
            }));

            //? upadates the chats state with data received from the server
            setChats(chats);
        };
        window.addEventListener("resize", debounce(handleResize));
        getchats();

        //cleanup function
        return () => window.removeEventListener("resize", debounce(handleResize));
    }, []);


    //? renders the list of chats
    const renderList = (): JSX.Element[] => {
        return chats.map(chat => {
            //? since the url has to be unique we can use it as a key
            return (
                <li className= "list-Chats-item" key={chat.url} 
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
        //? if the window is smaller than 600px it will render a button that opens the chats container
        if(dimentions.width < 600){
            //? if the chats container is open it will render the chats container
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
                //? only clickable icon will be rendered
                return (
                    <FontAwesomeIcon icon={faComments} className="chats-List-Button" onClick={() => setOpen(true)}/>
                )
            }
        //? if the window is bigger than 600px it will render the chats container with users by defualt
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


        


    




