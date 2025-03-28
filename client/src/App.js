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
    post:
    {
      content: "Catchphrase",
      comments: [ "comm1" ]
    }
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

function WritePost({onAddPost}){
  const [post, setPost] = useState('');

  return(
    <div id='writePost'>
    <input  type="text" placeholder="Write if you really must" value={post} onChange={(e) => {
      console.log('post, userPost', post); setPost(e.target.value); 
    }} />
    <button id='writePostBtn' onClick={()=> { onAddPost(post); setPost(''); } }>Quack</button>
    </div>
  );
}



// function App() {
//   const [isPopupVisible, setIsPopupVisible] = useState(false);

//   const togglePopup = () => {
//     setIsPopupVisible(!isPopupVisible);
//   };

//   return (
//     <div>
//       <button onClick={togglePopup}>Open Popup</button>

//       {isPopupVisible && (
//         <div className="popup">
//           <div className="popup-content">
//             <h2>Popup Window</h2>
//             <p>This is a popup. Click outside or on close to dismiss.</p>
//             <button onClick={togglePopup}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


function WriteComment({togglePopup, onAddOpinion}){
  const [comment, setComment] = useState('');
  return(
    <div className='popup'> 
      <div className='popup-content'>
        <input  type="text" placeholder="Write if you really must" value={comment} onChange={(e) => {
        console.log('comment, userComment', comment); setComment(e.target.value)}}/>
        <button onClick={()=>{onAddOpinion(comment); setComment('');togglePopup()}}>Add</button> {/*tutaj funkcja onAddOpinion bierze tylko comment jako paramentr, więc u parenta Wall jesr funkcja anonimowa, któa bierza argument comment z onAddOpinion i przekazyje do onAddComment, który bierze dwa argumenty: comment i index */}
        {/* <button onClick={()=> { onAddComment(comment, postIndex); setComment(''); togglePopup()}}>Add</button> */}
      </div>  
    </div>
  )
}

function CommentOnWall({reply}){
  return(
    <p>{reply}</p>
  )
}

function DisplayComment({allComments}){
  // const allComments = ["komentarz", "pusia", 'siusia', 'popek']
  const listOfComments = allComments.map((comment, index)=> {return <CommentOnWall reply={comment} key={index}/>})
  return(
    <div>
      {listOfComments}
    </div>
  )
}


function PostOnWall({post, onAddOpinion}){
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const popUp = <WriteComment togglePopup={togglePopup} onAddOpinion={onAddOpinion}/>

  return(
    <div className="postOnWall">
      <p className='postOnWall-UserPost'>{post.content}</p>
      <button className='postOnWall-LikeBtn'>Like</button>
      <button className='postOnWall-CommentBtn' onClick={togglePopup} >Comment</button>
      {isPopupVisible ? popUp : null}
      <DisplayComment allComments={post.comments}/>
      
    </div>
  );
}

function Wall({allPosts, onAddComment}){
  // const listOfUserPosts = allUsers.map(person => {return <PostOnWall user={person} key={person.id}/>})
  console.log('allPosts', allPosts)
  const listOfPosts = allPosts.map((message, index) => {  return  <PostOnWall post={message} key={index} onAddOpinion={(comment) => onAddComment(comment, index)} />})
  return(
    <>
      {listOfPosts}
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

function MiddlePart({allPosts, id, onAddPost, onAddComment}){
  // console.log("allUsers", allUsers)
  return(
    <div id={id}>
      <WritePost onAddPost={onAddPost}/>
      <Wall allPosts={allPosts} onAddComment={onAddComment}/>
      {/* <DisplayComment/> */}
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
  // const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([]);

  function handleAddComment(commentContent, postIndex){
    const newPosts = [...posts];
    for(let i = 0; i < newPosts.length; i++){
      if (i===postIndex){
        newPosts[i].comments.push(commentContent);
      }
    }
    setPosts(newPosts);
  }
  
  function handleOnAddPost(postContent){
    const post = {
      content:postContent,
      comments:[]
    }
    // console.log('handleOnAddPost, post', post)
    const newPosts = [...posts];
    newPosts.push(post);
    // console.log("handleAddQuiz, newPosts.comments", newPosts.comments)
    setPosts(newPosts);
  }
  


  return (
    <div id="homePage">
      <LeftPart id='leftPart'/>
      <MiddlePart id='middlePart' allPosts={posts} onAddPost={handleOnAddPost} onAddComment={handleAddComment}/>
      <RightPart id='rightPart' allUsers={users} />
      

      
      {/* <AccountPage/>
      <Footer/> */}
    </div>
  );
}

export default App;
