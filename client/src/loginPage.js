import { useState, useEffect } from 'react';
import './App.css';
import {Fragment} from 'react';


export function SignInToQuacker({onUserLogged}){
    return(
        <form>
            <label htmlFor="signIn">Sign in to Q</label>
            <input type="text" id="signIn" placeholder='Username' defaultValue='' />
            <button type='button' onClick={()=> onUserLogged()}>Log in</button>
        </form>
    )
}


export function SignUpToQuacker({onAddUser}){
    const [userName, setUserName] = useState('')
    return(
        <form>
            <label htmlFor="signUp">Join Q today</label>
            <input type="text" id="signUp" placeholder='Enter Username' value={userName} onChange={(e) => {
        console.log('userName', userName); setUserName(e.target.value);}}/>
            <button type='button' onClick={()=>{onAddUser(userName); setUserName('');}}>Create account</button>
        </form>
    )
}