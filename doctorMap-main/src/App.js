import React, {useState,useEffect, useContext} from "react";
import axios from "axios";
import './App.css'
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import RoomPage from './pages/room/index';
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import PRegister from './components/PRegister';
import PLogin from './components/PLogin'
function App() {
  const [isLoggedIn, setLoggedIn] = useState(false); 

  
  
  return (
    <div className="App" >

  <Routes>
    <Route path="/home" element={<Home/>}></Route>
    <Route path="/" element={<Login check={isLoggedIn}/>} />
    <Route path="/register" element={<Register />}/>
    <Route path='/connect' element={<HomePage/>} />
    <Route path='/room/:roomId' element={<RoomPage/>} />
    <Route exact path="/pregister" element={<PRegister />} />
    <Route exact path="/plogin" element={<PLogin />} />

 </Routes>
    </div>
  );
}

export default App;
