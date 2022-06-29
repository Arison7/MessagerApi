import React, {useState,useEffect} from 'react';
import ListChats from './components/ListChats';
import Chat from './components/Chat';
import AuthUserContext from './contexts/AuthUserContext';
import "./styles/main.css"



export interface IState{
  message:{
    url:string,
    text :string,
    author: string,
    chat:string,
    createdAt:string,
    updatedAt:string,
  },
  chat:{
    url : string,
    name : string,
    users : string[],
  },
  user:{
    url: string,
    name: string
  }

}
export interface IContext{
  user:{
    url: string,
    name: string,
    setAuthUser: React.Dispatch<React.SetStateAction<IState['user']>>
  }   


}


//write async arrow function

function App() {


  const [authUser,setAuthUser] = useState<IState["user"]>({url: "", name: ""})
  const [chats, setChats] = useState<IState["chat"][]>([])
  const [messagesURL, setMessagesURL] = useState<IState["message"]['url'][]>([])
  const [chat, setSingleChat] = useState<IState['chat']>({
    url: "",
    name: "",
    users: [],

  })


  //fetching current auth user
  useEffect(()=>{
    const getUser = async ()=> {
      const res = await fetch("/endpoints/users/");
      const data = await res.json()
      const user = data.results[0]
      setAuthUser({
        url : user.url,
        name: user.username
      })
    }
    getUser()

  },[])

  
  const value : IContext['user'] = {...authUser,setAuthUser}

    // messages = {messages} setMessages = {setMessages} />
  return (
    <div className='app'>
      <ListChats chats={chats} setChats={setChats} setSingleChat = {setSingleChat} />
      <AuthUserContext.Provider value={value}>
        <Chat chat ={chat} setMessagesURL = {setMessagesURL} messagesURL = {messagesURL}/>
      </AuthUserContext.Provider>
    </div>
  );
  
}

export default App;