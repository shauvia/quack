import { useState, useEffect } from 'react';
import './App.css';
import {Fragment} from 'react';


export function SignInToQuacker(){
    return(
        <form>
            <label htmlFor="signIn">Sign in to Q</label>
            <input type="text" id="signIn" defaultValue='Username'/>
            <button>Log in</button>
        </form>
    )
}


export function SignUpToQuacker(){
    return(
        <form>
            <label htmlFor="signIn">Join Q today</label>
            <input type="text" id="signIn" defaultValue='Enter Username'/>
            <button>Create account</button>
        </form>
    )
}