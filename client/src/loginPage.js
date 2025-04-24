import { useState, useEffect } from 'react';
import './App.css';
import {Fragment} from 'react';


export function SignInToQuacker({onUserLogged}){
    return(
        <form>
            <label htmlFor="signIn">Sign in to Q</label>
            <input type="text" id="signIn" defaultValue='Username'/>
            <button type='button' onClick={()=> onUserLogged()}>Log in</button>
        </form>
    )
}


export function SignUpToQuacker(){
    return(
        <form>
            <label htmlFor="signIn">Join Q today</label>
            <input type="text" id="signIn" defaultValue='Enter Username'/>
            <button type='button'>Create account</button>
        </form>
    )
}