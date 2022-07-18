import React from "react";
import { IContext } from "../App";




interface IProps{
    input : IContext['input'],
}


const InputContext = React.createContext<IProps['input']>({
    text: "",
    setInput: () => {},
    messageUrl: null,

})


export default InputContext;