import React, {useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './Login.css'
const PRegister = () => {

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
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
        const result = await (await axios.post('/pregister',user)).data;
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
          
            <form action=""  onSubmit={submitHandler}>
            Register
                <div>
            <input type="name" placeholder="name" name="name" onChange={changeHandler} />
            </div>
            <div>
                <input type="email" placeholder="email" name="email" onChange={changeHandler}  />
                </div>
                <div>
                <input type="password" placeholder="password" name="password" onChange={changeHandler}  />
                </div>
                <div>
                <input type="number" placeholder="phone" name="phone"onChange={changeHandler}/>
                </div>
                <div>
                <button className="regb">Submit</button>
                </div>
            Already have an account?<Link to="/plogin" >Login</Link> 

            </form>
            </div>
        </div>
    )
}

export default PRegister;