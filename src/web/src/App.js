import './App.css';
import { useState, useEffect } from 'react'
// import Header from './components/header/header'
import Body from './components/body/body';
import Login from './components/login/login';
function App() {
  let [ state, setState ]= useState(false);
  function stateChange(state){
    setState(state);
    
  }
  // useEffect(()=>{
  //   console.log(state)
  // },[state])
  return (
    <div className="App">
      {/* <Header /> */}
      { 
        // state
        true
        ?<Body/>
        :<Login change={stateChange}/>
       }
    </div>
  );
}

export default App;
