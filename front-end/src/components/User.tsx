import React, { useEffect,useState} from "react";
import {IState as Props} from "../App";

interface IProps{
    userURL : string,
    user: Props['user'],
    setUser: React.Dispatch<React.SetStateAction<Props['user']>>
}


const User : React.FC<IProps>= ({userURL,user,setUser}) => {
    useEffect(() => {
        const getUsers = async () =>{
            //console.log("userURL",userURL)
            const res = await fetch("endpoints/users/1/");
            const data = await res.json();
            //console.log("data",data)
            setUser({
                url: data.url,
                name: data.username
            })
        }
        getUsers();

    },[userURL])

    return(
        <p> 
            {user.name}
        </p>
    )



}

export default User;