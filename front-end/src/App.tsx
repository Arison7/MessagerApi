import React, {useState,useEffect} from 'react';
import ListChats from './components/ListChats';
import Chat from './components/Chat';
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



//write async arrow function

function App() {

  const [chats, setChats] = useState<IState["chat"][]>([])
  const [messagesURL, setMessagesURL] = useState<IState["message"]['url'][]>([])
  const [chat, setSingleChat] = useState<IState['chat']>({
    url: "",
    name: "",
    users: [],

  })



    // messages = {messages} setMessages = {setMessages} />

  return (
    <div className='app'>
      <ListChats chats={chats} setChats={setChats} setSingleChat = {setSingleChat} />
      <Chat chat ={chat} setMessagesURL = {setMessagesURL} messagesURL = {messagesURL}/>
    </div>
  );
  
}

export default App;