import React from 'react';
import {HashRouter as Router, Route, Link} from 'react-router-dom';


interface Istate{
  message:{
    text:string,
    author:string,
    chat:string,
    createdAt:string,
    updatedAt:string,
  }[]



}



function App() {

  
  return (
    <Router>
      <div className="App">
        <Route path = "/">
          <h1>Hello World</h1>
        </Route>
      </div>
    </Router>
  );
}

export default App;