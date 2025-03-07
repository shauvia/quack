import { useState, useEffect } from 'react';
import './App.css';
import {Fragment} from 'react';
import {SignInToQuacker, SignUpToQuacker} from './loginPage.js'

import logo from './logo.png';

let users = [
  { id: 0,
    name: "user1",
    picture: "to be shown",
    post:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    id: 1,
    name: "user2",
    picture:"to be shown",
    post:"Catchphrase"
  },
  {id: 2,
    name: "user3",
    picture: "to be shown",
    post:"Why do I write in Polish?"
  }
]

function QuackBtn(){
  return(
    <>
      <button>Create Quack</button>
    </>
  )
  
}

function WritePost(){
  return(
    <div id='writePost'>
    <input  type="text" placeholder="Write if you really must"/>
    <button id='writePostBtn'>Quack</button>
    </div>
  );
}

function PostOnWall({user}){
  return(
    <div className="postOnWall">
      <h6 className='postOnWall-UserName'>{user.name}</h6>
      <p className='postOnWall-UserPost'>{user.post}</p>
      <button className='postOnWall-LikeBtn'>Like</button>
      <button className='postOnWall-CommentBtn'>Comment</button>
    </div>
  );
}

function Wall({allUsers}){
  const listOfUserPosts = allUsers.map(person => {return <PostOnWall user={person} key={person.id}/>})
  return(
    <>
      {listOfUserPosts}
    </>
  )
}

function UserList({allUsers}){
  const listItems = allUsers.map(person =>
    <li key={person.id} className='person'>
      <p>
        {person.name}
      </p>
    </li>
  );
  return (<ul>{listItems}</ul>);
}


function Footer(){
  return(
    <footer>
      <p>&copy; shauvia</p>
    </footer>
    
  )
}

function AccountPage(){
  return(
    <>
      
      <SignInToQuacker/>
      <SignUpToQuacker/>
      <img src={logo}/>

    </>
  )
}

function LeftPart({id}){
  return(
    <div id={id}>
      <img src={logo} />
      <p>My user name</p>
      <QuackBtn/>
    </div>
  )
}

function MiddlePart({allUsers, id}){
  // console.log("allUsers", allUsers)
  return(
    <div id={id}>
      <WritePost/>
      <Wall allUsers={allUsers}/>
    </div>  
  )
}

function RightPart({allUsers, id}){
  return(
    <div id={id}>
      <UserList allUsers={allUsers}/>
    </div>
  )
}

function App() {
  return (
    <div id="homePage">
      <LeftPart id='leftPart'/>
      <MiddlePart id='middlePart' allUsers={users}/>
      <RightPart id='rightPart' allUsers={users}/>
      

      
      {/* <AccountPage/>
      <Footer/> */}
    </div>
  );
}

export default App;
