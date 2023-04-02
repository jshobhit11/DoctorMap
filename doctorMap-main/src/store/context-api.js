import React, {useState} from 'react'

//create context takes a default context

//AuthContext is an object that contains the component

const AuthContext = React.createContext({
    isLoggedIn: false,
    
    
});


export default AuthContext;