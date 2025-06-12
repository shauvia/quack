import { useState, useEffect } from 'react';
import './App.css';
import {Fragment} from 'react';


export function SignInToQuacker({onUserLogged}){
    const [login, setLogin] = useState('')
    return(
        <form>
            <label htmlFor="signIn">Sign in to Q</label>
            <input type="text" id="signIn" placeholder='Username' value={login} onChange={(e) => {
        console.log('login', login); setLogin(e.target.value);}} />
            <button type='button' onClick={()=> {onUserLogged(login); setLogin('');}}>Log in</button>{/*--> zrobić logowanie do konta na razie bez kontaKTOWANIA SIĘ Z SERWEREM   */}
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