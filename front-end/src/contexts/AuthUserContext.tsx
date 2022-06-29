import React from "react";
import { IContext as Props } from "../App";

interface IProps{
    user: Props['user']

}

const AuthUserContext = React.createContext<IProps['user']>({
    url: "",
    name: "",
    setAuthUser: () => {}
})


export default AuthUserContext
