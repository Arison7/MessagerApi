import React, {useState,useEffect} from 'react';
import {HashRouter as Router, Route, Link} from 'react-router-dom';
import ListChats from './components/ListChats';
import ListMessages from './components/ListMessages';


export interface IState{
  message:{
    url:URL,
    text :string,
    author:URL,
    chat:string,
    createdAt:string,
    updatedAt:string,
  },
  chats:{
    url : URL,
    name : string,
    users : string[],
  }[]

}



//write async arrow function

function App() {

  const [chats, setChats] = useState<IState["chats"]>([])
  const [messages, setMessages] = useState<IState["message"][]>([])

  console.log("messages",messages)

    
  return (
    <div className='App'>
      <ListChats chats={chats} setChats={setChats} setMessages = {setMessages} />
      <ListMessages messages={messages} />
      <h1>Hello World</h1>
    </div>
  );
  
}

export default App;