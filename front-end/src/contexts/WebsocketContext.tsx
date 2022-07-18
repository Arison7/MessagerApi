import React, { useRef } from "react";
import { IContext } from "../App";


interface IProps{
    ws : WebSocket | undefined,
}


const WebsocketContext = React.createContext<IProps['ws']>(undefined)

export default WebsocketContext;