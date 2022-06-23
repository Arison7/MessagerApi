import React, {useEffect,useState} from "react";
import {IState as Props} from "../App";


interface IProps{
    message : Props["message"],
}


const MessageInstance: React.FC<IProps> = ({message}) => {


    //console.log("instance",message)
    return (

        <div className = "temp">
            {message.text}
        </div>

    )

}

export default MessageInstance;