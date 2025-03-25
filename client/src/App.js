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
  // const [userPosts, setUserPosts] = useState({})

  return(
    <div id='writePost'>
    <input  type="text" placeholder="Write if you really must" value={post} onChange={(e) => {
      console.log('post, userPost', post);
      setPost(e.target.value); 
      // setUserPosts({...userPosts, post}); 
    }} />
    <button id='writePostBtn' onClick={()=> { onAddPost(post); setPost(''); } }>Quack</button>
    </div>
  );
}

// let nextId = 3;
// const initialArtists = [
//   { id: 0, name: 'Marta Colvin Andrade' },
//   { id: 1, name: 'Lamidi Olonade Fakeye'},
//   { id: 2, name: 'Louise Nevelson'},
// ];

// export default function List() {
//   const [name, setName] = useState('');
//   const [artists, setArtists] = useState(
//     initialArtists
//   );

//   function handleClick() {
//     const insertAt = 1; // Could be any index
//     const nextArtists = [
//       // Items before the insertion point:
//       ...artists.slice(0, insertAt),
//       // New item:
//       { id: nextId++, name: name },
//       // Items after the insertion point:
//       ...artists.slice(insertAt)
//     ];
//     setArtists(nextArtists);
//     setName('');
//   }

//   return (
//     <>
//       <h1>Inspiring sculptors:</h1>
//       <input
//         value={name}
//         onChange={e => setName(e.target.value)}
//       />
//       <button onClick={handleClick}>
//         Insert
//       </button>
//       <ul>
//         {artists.map(artist => (
//           <li key={artist.id}>{artist.name}</li>
//         ))}
//       </ul>
//     </>
//   );
// }

function CommentOnWall({riplay}){
  return(
    <p>{riplay}</p>
  )
}

function DisplayComment({allComments}){
  // const allComments = ["komentarz", "pusia", 'siusia', 'popek']
  const listOfComments = allComments.map((comment, index)=> {return <CommentOnWall riplay={comment} key={index}/>})
  return(
    <div>
      {listOfComments}
    </div>
  )
}


function PostOnWall({post}){

  /* <h6 className='postOnWall-UserName'>{user.name}</h6> */
  /* <p className='postOnWall-UserPost'>{user.post}</p> */
 

  return(
    <div className="postOnWall">
      <p className='postOnWall-UserPost'>{post.content}</p>
      <button className='postOnWall-LikeBtn'>Like</button>
      <button className='postOnWall-CommentBtn'>Comment</button>
      <DisplayComment allComments={post.comments}/>
      
    </div>
  );
}

function Wall({allPosts}){
  // const listOfUserPosts = allUsers.map(person => {return <PostOnWall user={person} key={person.id}/>})
  console.log('allPosts', allPosts)
  const listOfPosts = allPosts.map((message, index) => {  return  <PostOnWall post={message} key={index}/>})
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

function MiddlePart({allPosts, id, onAddPost}){
  // console.log("allUsers", allUsers)
  return(
    <div id={id}>
      <WritePost onAddPost={onAddPost}/>
      <Wall allPosts={allPosts}/>
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
  
  function handleOnAddPost(postContent){
    const post = {
      content:postContent,
      comments:["To jest komentarz do wyświetlenia", 'Atu pewnie drugi komentarz do wyświetlenia', 'A tu catchphrase']
    }
    // console.log('handleOnAddPost, post', post)
    const newPosts = [...posts];
    newPosts.push(post);
    // console.log("handleAddQuiz, 147, newPosts", newPosts)
    setPosts(newPosts);
  }
  


  return (
    <div id="homePage">
      <LeftPart id='leftPart'/>
      <MiddlePart id='middlePart' allPosts={posts} onAddPost={handleOnAddPost} />
      <RightPart id='rightPart' allUsers={users} />
      

      
      {/* <AccountPage/>
      <Footer/> */}
    </div>
  );
}

export default App;
