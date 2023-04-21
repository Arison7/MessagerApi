import React, {useState,useEffect} from 'react';
import ListChats from './components/ListChats';
import Chat from './components/Chat';
import ChatCreationPopUp from './components/ChatCreationPopUp';
import AuthUserContext from './contexts/AuthUserContext';
import "./styles/main.css"



export interface IState{
  message:{
    url:string,
    text :string,
    author: string,
    author_name:string,
    chat:string,
    created_at:string,
    updated_at:string,
  },
  chat:{
    url : string,
    name : string,
    inviteLink : string,
    users : {
      url:string,
      username:string,
    }[]
  },
  user:{
    url: string,
    username: string
  },
  input:{
    text:string,
    messageUrl:string | null
  },
  popUp : boolean

}
export interface IContext{
  user:{
    url: string,
    username: string,
    setAuthUser: React.Dispatch<React.SetStateAction<IState['user']>>
  }
  input:{
    text: string,
    messageUrl: string | null,
    setInput: React.Dispatch<React.SetStateAction<IState['input']>>,
  }



}



//write async arrow function

function App() {


  const [authUser,setAuthUser] = useState<IState["user"]>({url: "", username: ""})
  const [chats, setChats] = useState<IState["chat"][]>([])
  const [chat, setSingleChat] = useState<IState['chat']>({
    url: "",
    name: "",
    inviteLink: "",
    users: [
      {
        url: "",
        username: ""
      }
    ],

  })
  const [popUp, setPopUp] = useState<boolean>(false)
  
  //fetching current auth user
  useEffect(()=>{
    const getUser = async ()=> {
      const res = await fetch("/endpoints/users/");
      const data = await res.json()
      const user = data.results[0]
      setAuthUser({
        url : user.url,
        username: user.username
      })
    }
    getUser()

  },[])



  
  const value : IContext['user'] = {...authUser,setAuthUser}

  return (
    <div className='app'>
      <ChatCreationPopUp popUp= {popUp} setPopUp={setPopUp} setChats = {setChats} />
      <ListChats chats={chats} setChats={setChats} setSingleChat = {setSingleChat} setPopUp = {setPopUp}  />
      <AuthUserContext.Provider value={value}>
        <Chat chat ={chat} setPopUp = {setPopUp} setChats = {setChats} setSingleChat = {setSingleChat}/>
      </AuthUserContext.Provider>
    </div>
  );
  
}

export default App;