import React, {memo, useContext} from "react";
import {IState as Props} from "../App";
import MessageInstance from "./MessageInstance";
import AuthUserContext from "../contexts/AuthUserContext";
interface IProps {
    messages: Props['message'][],
}


const ListMessages: React.FC<IProps> = memo(({messages}) => {
    const user = useContext(AuthUserContext)

    const RenderList = (): JSX.Element[] => {
        return messages?.map(msg => {
            const classname = (msg.author === user.url) ? "list-Messages-item-Author" : "list-Messages-item-Other"
            return (
                <li className = {classname} key = {msg.url.toString()}>
                    <MessageInstance message = {msg}/>
                </li>
            )
        }) 

    }
    return (
        <ul className="list-Messages" >
            {RenderList()}
        </ul>
    )

})

export default ListMessages;