import React, {useState, useEffect} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './Login.css'
const Login = () => {

    useEffect(()=> {
        if(localStorage.getItem('currentUser'))
        {
            window.location.href='/home'
        }
    })

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        hospital: "",
        phone: 0,

    })
    const changeHandler = (event) => {

        const { value, name } = event.target;



        setUser({
            ...user,
            [name]: value
        })

    }


    async function submitHandler(e){
        e.preventDefault();

        // const result = await (await axios.post('/register', ))
        const result = await (await axios.post('/login',user)).data;

    if(result)
    {
        window.location.href='/home';
    }
    else{
        window.location.href='/';
    }
    }


    return(
        
        <div className="log-con"> 
        <div className="log-img"></div>
        <div className="log-container">
            Login - DoctorMap
            <form action="" onSubmit={submitHandler}>
                <div>
                <input type="name" placeholder="name" name="name" onChange={changeHandler} />
                </div>
                <div>
                <input type="email" placeholder="email" name="email" onChange={changeHandler}  />
                </div>
                <div>
                <input type="password" placeholder="password" name="password" onChange={changeHandler}  />
                </div>
               
                
               
                <button >Submit</button>
            </form>

            New to account?<Link to="/register" >Register</Link> 
        </div>
        </div>
    )
}

export default Login;