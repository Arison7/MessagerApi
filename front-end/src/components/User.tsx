import React, { useEffect,useState} from "react";
import {IState as Props} from "../App";

interface IProps{
    user: Props['user'],
}


const User : React.FC<IProps> = ({user}) => {

    return (
        <li className="list-Users-Item"> 
            {user.username}
        </li>
    )



}

export default User;