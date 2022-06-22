import React, {useState,useEffect} from 'react';
import {HashRouter as Router, Route, Link} from 'react-router-dom';
import ListChats from './components/ListChats';
import ListMessages from './components/ListMessages';
import Chat from './components/Chat';


export interface IState{
  message:{
    url:URL,
    text :string,
    author:URL,
    chat:string,
    createdAt:string,
    updatedAt:string,
  },
  chat:{
    url : string,
    name : string,
    users : string[],
  }

}



//write async arrow function

function App() {

  const [chats, setChats] = useState<IState["chat"][]>([])
  const [messagesURL, setMessagesURL] = useState<IState["message"]['url'][]>([])
  const [messages, setMessages] = useState<IState["message"][]>([])
  const [chat, setSingleChat] = useState<IState['chat']>({
    url: "",
    name: "",
    users: [],

  })



    // messages = {messages} setMessages = {setMessages} />

  return (
    <div className='App'>
      <ListChats chats={chats} setChats={setChats} setSingleChat = {setSingleChat} />
      <ListMessages messagesURL = {messagesURL} messages = {messages} setMessages = {setMessages} /> 
      <Chat chat ={chat} setMessagesURL = {setMessagesURL}/>
      <h1>Hello World</h1>
    </div>
  );
  
}

export default App;