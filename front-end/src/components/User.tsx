import React from "react";
import {IState as Props} from "../App";

interface IProps{
    user: Props['user'],
}


const User : React.FC<IProps> = ({user}) => {

    return (
        <p className="list-Users-Item"> 
            {user.username}
        </p>
    )



}

export default User;