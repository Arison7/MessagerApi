import React from "react";


interface IProps{
    ws : WebSocket | undefined,
}


const WebsocketContext = React.createContext<IProps['ws']>(undefined)

export default WebsocketContext;