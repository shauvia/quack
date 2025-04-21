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

const endpointPost = '/userposts'
const api = "/api"
const serverUrl = "http://localhost:3001";

async function pogadajZSerwerem(serverUrl, api){
  console.log("pogadajZSerwerem", serverUrl, api)
  // console.log("app.js,addTask URL: ", url+postTask,)
  let response = await fetch(serverUrl+api, { 
    method: 'GET' , 
    // body: JSON.stringify(uInput),
    headers: {
      'Content-Type': 'application/json',
      // "Authorization": JSON.stringify(token)
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, pogadajZSerwerem, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.text(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
  console.log("pogadajZSerwerem", content)
  return content;
}

function handlePogadajZSerwerem(){
  let pogadalam = pogadajZSerwerem(serverUrl, api);
  console.log("pogadalam", pogadalam)
}


function WritePost({onAddPost}){
  const [post, setPost] = useState('');

  return(
    // <div className={isPopup ? "popup-style" : "persistent-style"}>
    <div id='writePost'>
    {/* <> */}
      <input  type="text" placeholder="Write if you really must" value={post} onChange={(e) => {
        console.log('post, userPost', post); setPost(e.target.value); 
      }} />
      <button id='writePostBtn' onClick={()=> { onAddPost(post); setPost(''); } }>Quack</button>
    {/* </>   */}
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
    <>
      <input  type="text" placeholder="Write if you really must" value={comment} onChange={(e) => {
      console.log('comment, userComment', comment); setComment(e.target.value)}}/>
      <button onClick={()=>{onAddOpinion(comment); setComment('');togglePopup()}}>Add</button> {/*tutaj funkcja onAddOpinion bierze tylko comment jako parametr, więc u parenta Wall jesr funkcja anonimowa, któa bierze argument comment z onAddOpinion i przekazyje do onAddComment, który bierze dwa argumenty: comment i index */}
  
    </>
  )
}

function CommentOnWall({reply}){
  return(
    <div className='comment'>
      <h6 className='comment-UserName'>Mroczny Waldek</h6>
      <p >{reply}</p>
    </div>
  )
}

function DisplayComment({allComments}){
  const listOfComments = allComments.map((comment, index)=> {return <CommentOnWall reply={comment} key={index}/>})
  return(
    <div className='comments'>
      {listOfComments}
    </div>
  )
}


function PostOnWall({post, onAddOpinion}){
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const popUp = (<GenericPopup> <WriteComment togglePopup={togglePopup} onAddOpinion={onAddOpinion}/> </GenericPopup>)

  return(
    <div>
      <div className="postOnWall">
        <p className='postOnWall-UserPost'>{post.content}</p>
        <button className='postOnWall-LikeBtn'>Like</button>
        <button className='postOnWall-CommentBtn' onClick={togglePopup} >Comment</button>
      </div>
      {isPopupVisible ? popUp : null}
      <DisplayComment allComments={post.comments}/>
    </div>
  );
}

function GenericPopup({children}) {
  return (
    <div className='popup'>
      <div className='popup-content'>
        {children}
      </div>
    </div>
  )
}

function Wall({allPosts, onAddComment}){
  // const listOfUserPosts = allUsers.map(person => {return <PostOnWall user={person} key={person.id}/>})
  console.log('allPosts', allPosts)
  const listOfPosts = allPosts.map((message, index) => {  return  <PostOnWall post={message} key={index} onAddOpinion={(comment) => onAddComment(comment, index)} />})
  return(
    <div>
      {/* <div className='wallContant'> */}
        {listOfPosts}
      {/* </div> */}
      
    </div>
  )
}

function CreateQuack({onAddPost}){
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const onButtonClik = (post) => {onAddPost(post); togglePopup()};
  // const popUpQuack = <WritePost  onAddPost={onButtonClik} isPopup={true}/>

  const popUpQuack = (<GenericPopup><WritePost  onAddPost={onButtonClik}/></GenericPopup>) 

  

  return(
    <>
      {isPopupVisible ? popUpQuack : null}
      <button onClick={togglePopup}>Create Quack</button>
      
    </>
  ) 
}

// function CreateQuack({onAddQuack, togglePopup}){
//   const [quack, setQuack] = useState('');

//   return(
//     <div className='quackPopup'> 
//       <div className='quackPopup-content'>
//         <input  type="text" placeholder="No piszjusz" value={quack} onChange={(e) => {
//         console.log('quack, setQuack', quack); setQuack(e.target.value)}}/>
//         <button onClick={()=>{onAddQuack(quack); setQuack('');togglePopup()}}>Add</button> 
//       </div>  
//     </div>
//   );
// }

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

function LeftPart({id, onAddPost}){
  return(
    <div id={id}>
      <img src={logo} />
      <p>My user name</p>
      <CreateQuack onAddPost={onAddPost}/>
    </div>
  )
}

function MiddlePart({allPosts, id, onAddPost, onAddComment}){
  // console.log("allUsers", allUsers)
  return(
    <div id={id} /*className='scrollableWall'*/ >
        <WritePost onAddPost={onAddPost}/>
      
      <Wall allPosts={allPosts} onAddComment={onAddComment}/>
    </div>  
  )
}

function RightPart({allUsers, id}){
  
  return(
    <div id={id}>
      <UserList allUsers={allUsers}/>
      <button onClick={handlePogadajZSerwerem}>Pogadaj z serwerem</button>
    </div>
  )
}

  // async function updateQuizzesAPI(url, quizApi, uInput){
  //   console.log("addQuizServer", url,  uInput)
  //   // console.log("app.js,addTask URL: ", url+postTask,)
  //   let response = await fetch(url+quizApi, { 
  //     method: 'POST' , 
  //     body: JSON.stringify(uInput),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     }
  //   });
  //   if (!response.ok) {
  //     let err = new Error('fetch failed,addQuizServer, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
  //     throw err;
  //   }
  //   let content = await response.text(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
  //   console.log("addQuizServer", content)
  //   return content;
  // }

// async function addTask(url, users, tasksApi, uInput, token){
//   console.log("addTask", users, uInput, token)
//   // console.log("app.js,addTask URL: ", url+postTask,)
//   let response = await fetch(url+users+tasksApi, { 
//     method: 'POST' , 
//     body: JSON.stringify(uInput),
//     headers: {
//       'Content-Type': 'application/json',
//       "Authorization": JSON.stringify(token)
//     }
//   });
//   if (!response.ok) {
//     let err = new Error('fetch failed, addTask, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
//     throw err;
//   }
//   let content = await response.text(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
//   console.log("addTaskContent", content)
//   return content;
// }

// async function getTasks(url, users, tasksApi, token){
//   console.log('getTasks', users, token, tasksApi);
//   let response = await fetch(url+users+tasksApi, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       "Authorization": JSON.stringify(token)
//     }
//   });
//   if (!response.ok) {
//     let err = new Error('fetch failed, getTasks, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
//     throw err;
//   }
//   let content = await response.json();
//   console.log("getTaskContent", content)
//   return content;
// }

function App() {
  // const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(serverUrl+endpointPost, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const jsonData = await response.json();
        console.log("fetchData", jsonData)
        setPosts(jsonData);
      } catch (error) {
        console.error("fetchData", error);
      }
    };

    fetchData();
  }, []); /*empty array means useEffect runs only once */
  

  async function postPost(serverUrl, PostEndpoint, userInput){
    console.log("PostPost", serverUrl, PostEndpoint)
    let response = await fetch(serverUrl+PostEndpoint, {
      method: 'POST',
      body: JSON.stringify(userInput),
      headers: {
        'Content-Type': 'application/json',
        // "Authorization": JSON.stringify(token)
      }
    })
    if (!response.ok) {
      let err = new Error('fetch failed, PostPost, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
      throw err;
    }
    let content = await response.text(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
    console.log("PostPost", content)
    return content;
  }

  


  function handleAddComment(commentContent, postIndex){
    const newPosts = [...posts];
    for(let i = 0; i < newPosts.length; i++){
      if (i===postIndex){
        newPosts[i].comments.push(commentContent);
      }
    }
    postPost(serverUrl, endpointPost, newPosts)
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
    postPost(serverUrl, endpointPost, newPosts)
    // console.log("handleAddQuiz, newPosts.comments", newPosts.comments)
    setPosts(newPosts);
  }
  


  return (
    <div id="homePage">
      <LeftPart id='leftPart' onAddPost={handleOnAddPost}/>
      <MiddlePart id='middlePart' allPosts={posts} onAddPost={handleOnAddPost} onAddComment={handleAddComment}/>
      <RightPart id='rightPart' allUsers={users} />
      

      
      {/* <AccountPage/>
      <Footer/> */}
    </div>
  );
}

export default App;
