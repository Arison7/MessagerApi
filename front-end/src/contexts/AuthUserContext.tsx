import React from "react";
import { IContext as Props } from "../App";

interface IProps{
    user: Props['user']

}

//? creates a context to hold the current authenticated user
const AuthUserContext = React.createContext<IProps['user']>({
    url: "",
    username: "",
    setAuthUser: () => {}
})


export default AuthUserContext
