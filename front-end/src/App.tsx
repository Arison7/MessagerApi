import React, {useState} from 'react';
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
    name : string,
    users : string[],

  }[]

}



//write async arrow function

function App() {
  const [chats, setChats] = useState<IState["chats"]>([
    {
      name: 'General',
      users: ["abc","abd"]
    },
    {
      name: 'Random',
      users: ["abc","abd","abf"]
    }




  ])
  return (
    <div className='App'>
      <ListChats chats={chats}/>
      <h1>Hello World</h1>
    </div>
  );
}

export default App;