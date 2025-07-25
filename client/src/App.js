import { useState, useEffect } from 'react';
import './App.css';
import {Fragment} from 'react';
import {SignInToQuacker, SignUpToQuacker} from './loginPage.js'

import logo from './logo.png';

// let users = [
//   { id: 0,
//     name: "user1",
//     picture: "to be shown",
//     post:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
//   },
//   {
//     id: 1,
//     name: "user2",
//     picture:"to be shown",
//     post:
//     {
//       content: "Catchphrase",
//       comments: [ "comm1" ]
//     }
//   },
//   {id: 2,
//     name: "user3",
//     picture: "to be shown",
//     post:"Why do I write in Polish?"
//   }
// ]
const serverUrl = "http://localhost:3001";
const getUserEndPoint = '/fetchUser';
const updateUserEndPoint = '/userupdate'
const getAllData = '/allPostsAndComments';
const getAllUsersEndPoint = '/allUsersEndPoint'
const logToAccEndPoint = '/user'
const makeAccEndPoint ='/user'
const manyComments = '/usercommentlist'
const oneComment = '/useronecomment'
const onePost = '/useronepost'
const endpointPost = '/userposts'
const manyPosts = '/userpostlist'
const api = "/api";

// async function pogadajZSerwerem(serverUrl, api){
//   console.log("pogadajZSerwerem", serverUrl, api)
//   // console.log("app.js,addTask URL: ", url+postTask,)
//   let response = await fetch(serverUrl+api, { 
//     method: 'GET' , 
//     // body: JSON.stringify(uInput),
//     headers: {
//       'Content-Type': 'application/json',
//       // "Authorization": JSON.stringify(token)
//     }
//   });
//   if (!response.ok) {
//     let err = new Error('fetch failed, pogadajZSerwerem, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
//     throw err;
//   }
//   let content = await response.text(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
//   console.log("pogadajZSerwerem", content)
//   return content;
// }

// function handlePogadajZSerwerem(){
//   let pogadalam = pogadajZSerwerem(serverUrl, api);
//   console.log("pogadalam", pogadalam)
// }


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


function WriteComment({togglePopup, onAddOpinion}){
  const [comment, setComment] = useState('');
  return(
    <>
      <input  type="text" placeholder="Write if you really must" value={comment} onChange={(e) => {
      console.log('comment, userComment', comment); setComment(e.target.value)}}/>
      <button onClick={()=>{onAddOpinion(comment); setComment('');togglePopup()}}>Add</button> {/*tutaj funkcja onAddOpinion bierze tylko comment jako parametr, więc u parenta Wall jest funkcja anonimowa, któa bierze argument comment z onAddOpinion i przekazuje do onAddComment, który bierze dwa argumenty: comment i index */}
  
    </>
  )
}

function CommentOnWall({reply, author}){
  return(
    <div className='comment'>
      <h6 className='comment-UserName'>{author}</h6>
      <p >{reply}</p>
    </div>
  )
}

function DisplayComment({allComments}){
  const listOfComments = allComments.map((comment)=> {return <CommentOnWall reply={comment.text} author={comment.authorAccName} key={comment._id}/>})
  return(
    <div className='comments'>
      {listOfComments}
    </div>
  )
}


function PostOnWall({post, onAddOpinion}){
  // console.log('PostOnWall, following', user.following, "post authorID", post.userId);
  // console.log('PostOnWall, post.comments', post.comments)
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const popUp = (<GenericPopup> <WriteComment togglePopup={togglePopup} onAddOpinion={onAddOpinion}/> </GenericPopup>)

  return(
    <div>
      <div className="postOnWall">
        <p className='postOnWall-UserName'>{post.accName}</p>
        <p className='postOnWall-UserPost'>{post.content}</p>
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

function Wall({allPosts, onAddComment, user, onFollow, onUnfollow}){
  // console.log('allPosts', allPosts)
  const listOfPosts = allPosts.map((message, index) => { /* console.log('message.id', message._id, 'message', message);*/ return <PostOnWall post={message} key={message._id} onAddOpinion={(comment) => onAddComment(comment, message._id)} />})
  return(
    <div>
        {listOfPosts}
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

  const popUpQuack = (<GenericPopup><WritePost onAddPost={onButtonClik}/></GenericPopup>) 

  

  return(
    <>
      {isPopupVisible ? popUpQuack : null}
      <button type='button' className='leftPartBtn' id='btnCreateQuack' onClick={togglePopup}>Create Quack</button>
      
    </>
  ) 
}

function CreateFollowBtn({ personTofollow, user, onFollow, onUnfollow }) {
  const isFollowing = user.following.includes(personTofollow._id);

  return (
    <button
      className='postOnWall-LikeBtn'
      onClick={() =>
        isFollowing ? onUnfollow(personTofollow._id) : onFollow(personTofollow._id)
      }
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}



function UserList({allUsers, user, onFollow, onUnfollow}){

  const listItems = allUsers.map(person =>
    <li key={person._id} className='person'>
      <p>
        {person.accountName}
      </p>
      <CreateFollowBtn personTofollow={person} user={user} onFollow={onFollow} onUnfollow={onUnfollow}/>

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

function AccountPage({onUserLogged, onAddUser}){
  return(
    <>
      
      <SignInToQuacker onUserLogged={onUserLogged}/>
      <SignUpToQuacker onAddUser={onAddUser}/>
      <img src={logo}/>

    </>
  )
}

function LeftPart({id, onAddPost, onAccountLoggedTo, user}){
  return(
    <div id={id}>
      <img src={logo} />
      <p>{user.accountName} </p>
      <CreateQuack onAddPost={onAddPost}/>
      <button className='leftPartBtn' id='btnLoggedOut' onClick={()=>onAccountLoggedTo()}>Log Out</button>
    </div>
  )
}

function MiddlePart({allPosts, id, onAddPost, onAddComment, user, onUnfollow, onFollow}){
  // console.log("allUsers", allUsers)
  return(
    <div id={id} /*className='scrollableWall'*/ >
      <WritePost onAddPost={onAddPost}/>
      
      <Wall allPosts={allPosts} onAddComment={onAddComment}/>
    </div>  
  )
}

function RightPart({allUsers, id, user, onFollow, onUnfollow}){
  
  return(
    <div id={id}>
      <UserList allUsers={allUsers} user={user} onFollow={onFollow} onUnfollow={onUnfollow}/>
      {/* <button onClick={handlePogadajZSerwerem}>Pogadaj z serwerem</button> */}
    </div>
  )
}


function App() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [post, setPost] = useState({content:''})
  const [comment, setComment] = useState({text:'', postId: -1})
  const [comments, setComments] = useState([]);
  
  
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [accountIsCreated, setAccountIsCreated] = useState("dontKnow");

  async function createAccount(serverUrl, makeAccEndPoint, accName){
    try {
      const response = await fetch(serverUrl+makeAccEndPoint, {
        method: 'PUT',
        body: JSON.stringify(accName),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const content = await response.json();
      // console.log('data fetched from server', jsonData)
      // return jsonData
      // let content = await response.text();   
      console.log("account has been created", content)
      return content; 
    } catch (error) {
      console.error("createAccount", error);
    }
  }

  async function signInToAccount (serverUrl, logToAccEndPoint, accName){
      try {
        const response = await fetch(serverUrl+logToAccEndPoint+'/'+accName,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const content = await response.json();
        // console.log('data fetched from server', jsonData)
        // return jsonData
        // let content = await response.text();   
        console.log("account has been signed in to", content);
        return content; 
    } catch (error) {
      console.error("signInToAccount", error);
    }
    
  };

  // useEffect(() => {
  //   const fetchData = async (user) => {
  //     try {
  //       let token = user._id;
  //       const response = await fetch(serverUrl+manyPosts, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           "Authorization": JSON.stringify(token)
  //         }
  //       });
  //       const jsonData = await response.json();
  //       console.log("fetchData", jsonData)
  //       setPosts(jsonData);
  //     } catch (error) {
  //       console.error("fetchData", error);
  //     }
  //   };

  //   fetchData(user);
  // }, []); /*empty array means useEffect runs only once */

  
  const fetchAllData = async () => {
    try {
      const response = await fetch(serverUrl+getAllData, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // "Authorization": JSON.stringify(token)
        }
      });
      const jsonData = await response.json();
      console.log('data fetched from server', jsonData)
      return jsonData    
    } catch (error) {
      console.error("data fetched from server", error);
    }
  };


  const fetchData = async (user) => {
  try {
    let token = user._id;
    console.log('fetchData, token', token)
    const response = await fetch(serverUrl+manyPosts, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": JSON.stringify(token)
      }
    });
    const jsonData = await response.json();
    console.log('data fetched from server', jsonData)
    return jsonData    
  } catch (error) {
    console.error("data fetched from server", error);
  }
  };

  async function postOnePost(serverUrl, onePost, userPost, user) {
    // przekazać usera tak aby się do niego dobrać
    console.log("postOnePost, user", serverUrl, onePost, user)
    let token = user._id;
    let response = await fetch(serverUrl+onePost, {
      method: 'POST',
      body: JSON.stringify(userPost),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": JSON.stringify(token)
      }
    })
    if (!response.ok) {
      let err = new Error('fetch failed, postOnePost, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
      throw err;
    }
    let content = await response.json(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
    console.log("one post posted on server", content)
    return content;
  }

  async function postOneComment(serverUrl, oneCommentEndpoint, userComment, user){
    let token = user._id;
    console.log("postOneComment", serverUrl, onePost)
    let response = await fetch(serverUrl+oneCommentEndpoint, {
      method: 'POST',
      body: JSON.stringify(userComment),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": JSON.stringify(token)
      }
    })
    if (!response.ok) {
      let err = new Error('fetch failed, postOneComment, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
      throw err;
    }
    let content = await response.json(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
    console.log("one comment posted on server", content)
    return content;
  }

  async function updateUser(serverUrl, updateUserEndPoint, user){
    console.log('updateUser, user', user)
    let token = user._id;
    console.log("updateUser", serverUrl, updateUserEndPoint)
    let response = await fetch(serverUrl+updateUserEndPoint, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": JSON.stringify(token)
      }
    })
    if (!response.ok) {
      let err = new Error('fetch failed, updateUser, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
      throw err;
    }
    let content = await response.text(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
    console.log("updated user posted on server", content)
    return content;
  }

  async function fetchUser(serverUrl, getUserEndPoint, userId){
    let response = await fetch(serverUrl+getUserEndPoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": JSON.stringify(userId)
      }
    })
    if (!response.ok) {
      let err = new Error('fetch failed, fetchUser, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
      throw err;
    }
    let content = await response.json(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
    console.log("fetched user from server", content)
    return content;
  }

  async function fetchAllUsers(serverUrl, getAllUsersEndPoint){
    try {
      const response = await fetch(serverUrl+getAllUsersEndPoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // "Authorization": JSON.stringify(token)
        }
      });
      const result = await response.json();
      console.log('all users fetched from server', result)
      return result;   
    } catch (error) {
      console.error("all users fetched from server", error);
    }
  };
  
  // async function handleOnAllUsers(){
  //   let allUsers = await fetchAllUsers(serverUrl, getAllUsersEndPoint);
  //   setUsers(allUsers);
    
  // }
  
  async function handleOnAddUser(accountName) {
    
    let account = await createAccount(serverUrl, makeAccEndPoint, accountName);
    console.log('handleOnAddUser, account', account);
    console.log('account.alreadyCreated', account.alreadyCreated)

    setAccountIsCreated(account.alreadyCreated);
  }
  

  async function handleUserloggedToAccount(login){
    console.log("isUserLogged", isUserLogged);
    let user = await signInToAccount(serverUrl, logToAccEndPoint, login);
    let allUsers = await fetchAllUsers(serverUrl, getAllUsersEndPoint);
    console.log("handleUserloggedToAccount, allUsers", allUsers)
    let allData = await fetchAllData();
    setUser(user);
    setUsers(allUsers);
    // let data = await fetchData(user);
    setPosts(allData);
    console.log('handleUserloggedToAccount, user', user)
    setIsUserLogged(true);
  }


  function handleAccountLoggedTo() {
    setUser({});
    setIsUserLogged(false);
  }


  async function handleAddComment(commentContent, postIndex){
    const newComments = [...comments];
    let newComment = {...comment};
    newComment.text = commentContent;
    newComment.postId = postIndex;
    await postOneComment(serverUrl, oneComment, newComment, user);
    const allPosts = await fetchAllData();
    // const posts = await fetchData(user);
    setPosts(allPosts);

  }  
  

  async function handleOnAddPost(postContent){
    
    let oneNewPost = {...post}
    oneNewPost.content = postContent;
    console.log('oneNewPost', oneNewPost);
    await postOnePost(serverUrl, onePost, oneNewPost, user)
    const allPosts = await fetchAllData()
    // const posts  = await fetchData(user);
    setPosts(allPosts);

  }

  

  async function handleOnFollow(postUserId){
    console.log('handleOnFollow, userId', postUserId)
    let newUser = {...user}
    // console.log("handleOnFollow, newUser", newUser)
    let followingArr = [...newUser.following];
    console.log('followingArr, handleOnFollow(', followingArr);
    followingArr.push(postUserId);
    newUser.following = followingArr;
    console.log("handleOnFollow, newUser", newUser);
    await updateUser(serverUrl, updateUserEndPoint, newUser);
    let updatedUser = await fetchUser(serverUrl, getUserEndPoint, newUser._id);
    setUser(updatedUser);
  }

  async function handleonUnfollow(postUserId){
    let newUser = {...user};
    let followingArr1 = [...newUser.following];
    console.log("handleUnfollow, followingArr1", followingArr1)
    function findId(IdInArr){
      console.log("postUserId", postUserId, "IdInArr", IdInArr )
      if (postUserId !== IdInArr) {
        return IdInArr
      }
    }
    let arrNotFollowing = followingArr1.filter(findId);
    console.log( "handleUnFollow, arrNotFollowing", arrNotFollowing)
    newUser.following = arrNotFollowing;
    await updateUser(serverUrl, updateUserEndPoint, newUser);
    let updatedUser = await fetchUser(serverUrl, getUserEndPoint, newUser._id);
    setUser(updatedUser);
  }

  const homepage = (<div id="homePage"> <LeftPart id='leftPart' onAddPost={handleOnAddPost} onAccountLoggedTo = {handleAccountLoggedTo} user={user}/>
  <MiddlePart id='middlePart' allPosts={posts} onAddPost={handleOnAddPost} onAddComment={handleAddComment} user={user} onFollow={handleOnFollow} onUnfollow={handleonUnfollow} />
  <RightPart id='rightPart' allUsers={users} user={user} onFollow={handleOnFollow} onUnfollow={handleonUnfollow}/> </div>)
  


  return (
    <div>
      {isUserLogged ? homepage : <AccountPage onUserLogged = {handleUserloggedToAccount} onAddUser={handleOnAddUser}/>}
      {!accountIsCreated ? <p> You have succesfully created account. Please log in to your account </p>: (accountIsCreated === 'dontKnow') ? null :  <p>Account already exists. Use different name to create yours.</p>  }
      
      {/* <Footer/> */}
    </div>
  );
}

export default App;


// function example() {
//   return condition1 ? value1
//     : condition2 ? value2
//     : condition3 ? value3
//     : value4;
// }



// async function createAccountHandler(event){ 
//   let accName = document.getElementById('createAccount').value;
//   let pass = document.getElementById('loginPass').value;
//   console.log("userName: ", accName)
//   if (!accName || accName ==""){
//     clearDisplayMessages();
//     document.getElementById('displayMessage').innerHTML = 'Account username cannot be empty.'
//     return;
//   }
//   if (!pass || pass == "" || pass.length < 5){
//     clearDisplayMessages();
//     document.getElementById('displayMessage').innerHTML = 'Password must have at least 5 letters.'
//     return;
//   }
//   let account = await createAcc(url, users, accName, pass);
//   console.log("tripUrl, accUrl, userName: ", users, accName)
//   console.log("account: ", account);
//   cleanCreateAccInput()
//   if (!account.alreadyCreated){
//     clearDisplayMessages();
//     showHomePage();
//     document.getElementById('displayMessage').innerHTML = 'Your account ' + accName + ' has been set up.';
    
//   } else {
//     clearDisplayMessages();
//     document.getElementById("displayMessage").innerHTML = "You have already created account: " + accName;
//   }   
// }
