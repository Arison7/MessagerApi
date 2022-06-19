import React, {useState,useEffect} from 'react';
import {HashRouter as Router, Route, Link} from 'react-router-dom';
import ListChats from './components/ListChats';


export interface IState{
  messages:{
    text:string,
    author:string,
    chat:string,
    createdAt:string,
    updatedAt:string,
  }[],
  chats:{
    url : string,
    name : string,
    users : string[],
  }[]

}



//write async arrow function

function App() {

  const [chats, setChats] = useState<IState["chats"]>([])


    
  return (
    <div className='App'>
      <ListChats chats={chats} setChats={setChats}/>
      <h1>Hello World</h1>
    </div>
  );
}

export default App;