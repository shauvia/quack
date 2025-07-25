require('@dotenvx/dotenvx').config()
const ObjectId = require('mongodb').ObjectId;
// require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const storage = require('./mongo.js');

const loadUserMongo = storage.loadUserMongo;
const findDataMongo = storage.findDataMongo;
const saveCommentToMongo = storage.saveCommentToMongo;
const savePostToMongo = storage.savePostToMongo;
const saveUserToMongo = storage.saveUserToMongo;
const loadAllPostsfromMongo = storage.loadAllPostsfromMongo;
const loadAllCommentsfromMongo = storage.loadAllCommentsfromMongo;   
const loadAllUsersPosts = storage.loadAllUsersPosts
const loadAllUsersComments = storage.loadAllUsersComments;
const loadAllUsersFromMongo = storage.loadAllUsersFromMongo;




const app = express();
app.use(cors());
app.use(bodyParser.urlencoded( {extended: false} ));
// strict:false is needed to accept raw string
app.use(bodyParser.json({strict:false}));
app.use(express.static('build'));

let postList
let commentList

const port = process.env.PORT || 3001 // default is port 3000 (locally) but if there a different environment then use port that is default for the environment (np. strona serwowana z azurowego dysku bedzie miala domyslny port uzyty w srodowisku azura)


function listening(){
    console.log('server runnning');
    // console.log(`runnning on localhost ${port}`);
}

  app.get('/api', (req, res) => {
    console.log('server runnning');
    res.send('Hello from Jasna Cholera!');
  });

app.post('/userupdate', async (req, res) => {
  try{
    let userToken = JSON.parse(req.header("Authorization"));
    let o_id = new ObjectId(userToken);
    console.log("userupdate, userToken", userToken )
    let userToUpdate = req.body;
    userToUpdate._id = o_id;
    console.log('/userupdate, userToUpdate', userToUpdate)
    await saveUserToMongo(userToUpdate);
    res.send('OK');
  } catch (error) {
    res.status(500).send();
    console.log('Error on the server, posting update failed: ', error);
  }
})

app.get('/fetchUser', async (req, res) => {
  try{
    // let o_id = new ObjectId(comment.userId);
    let userToken = JSON.parse(req.header("Authorization"));
    let o_id = new ObjectId(userToken);
    console.log('/fetchUser, token', o_id)
    let user =  await loadUserMongo(o_id);
    if (!user) {
        console.log('fetchUser, account retrieval failed.');
        res.status(404).send('User not found');
        
    } else {
      res.send(user);
    }    
    }catch (error) {
      res.status(500).send();
      console.log('Error on the server, getting update failed: ', error);
    } 
   

  })

  app.get('/allUsersEndPoint', async (req, res) => {
    try{
      let allUsers = await loadAllUsersFromMongo();
      console.log("allUsersEndPoint, users", allUsers)
      res.send(allUsers);
    } catch (error) {
      if (error.httpCode) {
        res.status(error.httpCode).send(error.httpMsg);
      } else {
        res.status(500).send();
        console.log('Error on the server, retrieve userposts failed: ', error)
      }
    }  
  })

  app.get ('/allPostsAndComments', async (req, res)=> {
    try{
        // function log(msg) {
        //   console.log(new Date().getTime(), "allPostsAndComments : ", msg);
        // }

      // log("start");
      let allPostsArr = await loadAllUsersPosts();
      // log("after loadAllUsersPosts");
      let allCommentsArr = await loadAllUsersComments();
      // log("after loadAllUsersComments");
      let allUsers = await loadAllUsersFromMongo();
      // log("after loadAllUsersFromMongo");
      let allUsersPostsAndCommentsArr = [];
      for (oldPost of allPostsArr){
        var post = {...oldPost}
        post.comments = [];
        // let o_id = new ObjectId(post.userId);
 
        function findUser(matchingUser){
          return post.userId === matchingUser._id.toString();
        }
        let usersArr = allUsers.filter(findUser)
        post.accName = usersArr[0].accountName;
        allUsersPostsAndCommentsArr.push(post);
        for (comment of allCommentsArr) {
          if (post._id.toString() === comment.postId){
                function findUser(user){
                return comment.userId === user._id.toString();
                }
                let usersArr = allUsers.filter(findUser)

                comment.authorAccName = usersArr[0].accountName;
                post.comments.push(comment);
  
            } 
          }
      }  
      // log("end");
      res.send(allUsersPostsAndCommentsArr);
    } catch (error) {
      if (error.httpCode) {
        res.status(error.httpCode).send(error.httpMsg);
      } else {
        res.status(500).send();
        console.log('Error on the server, retrieve userposts failed: ', error)
      }
    }
  })

  app.get('/userpostlist', async (req, res) => {
    try{
      let userToken = JSON.parse(req.header("Authorization"));
      let postArr = await loadAllPostsfromMongo(userToken);
      let commentArr = await loadAllCommentsfromMongo(userToken);
      console.log("/userpostlist", 'postArr',  postArr, 'commentArr', commentArr )
      let postsAndCommentsArr = [];
      for (oldPost of postArr){
        var post = {...oldPost}
        post.comments = [];
        postsAndCommentsArr.push(post);
        for (comment of commentArr) {
          // console.log('post._id', post._id, 'comment.postId', comment.postId)
          if (post._id.toString() === comment.postId){
                // console.log('post.id', post._id, 'comment.postId', comment.postId)
                let o_id = new ObjectId(comment.userId);
                console.log("userpostlist, o_id ", o_id)
                let user = await loadUserMongo(o_id);
                console.log("userpostlist, user", user);
                comment.authorAccName = user.accountName;
                post.comments.push(comment);
                console.log('post.comments', post.comments)
  
            } 
          }
      }
        console.log('postsAndCommentsArr', postsAndCommentsArr)
        res.send(postsAndCommentsArr);
    } catch (error) {
      if (error.httpCode) {
        res.status(error.httpCode).send(error.httpMsg);
      } else {
        res.status(500).send();
        console.log('Error on the server, retrieve userposts failed: ', error)
      }
    }
  })

  


  app.post('/useronepost', async (req, res) => {
    console.log("/useronepost")
    try {
      let singlePost = {
        content: '',
        userId: -1
      };
      let userToken = JSON.parse(req.header("Authorization"));
      console.log("/useronepost, userToken", userToken)
      singlePost.content = req.body.content;
      singlePost.userId = userToken;
      console.log("useronepost, singlePost", singlePost)
      await savePostToMongo(singlePost);
      res.send('OK');
    } catch(error){
      if (error.httpCode) {
        res.status(error.httpCode).send(error.httpMsg);
      } else {
        res.status(500).send();
        console.log('Error on the server, posting task failed: ', error);
      }
    }
  })


  app.post('/useronecomment', async (req, res) => {
    console.log("/useronecomment")
    try{
      let singleComment = req.body;
      let userToken = JSON.parse(req.header("Authorization"));
      singleComment.userId = userToken;
      console.log("useronecomment, singleComment", singleComment)
      await saveCommentToMongo(singleComment);
      res.send('OK');
    } catch(error){
      if (error.httpCode) {
        res.status(error.httpCode).send(error.httpMsg);
      } else {
        res.status(500).send();
        console.log('Error on the server, posting task failed: ', error);
      }
    }
  })

  app.put('/user', async function(req, res){
    try{
      let userAccName = req.body;
      // let userExists = false;
      let userExists = await findDataMongo(userAccName)
      console.log('userExists',userExists);
      // let userExists = await loadDatafromMongo(userAccName);
      let accCheck = {
        alreadyCreated : false
      };
      if (!userExists) {
        let user = {
          accountName: userAccName,
          following: []
        }
        await saveUserToMongo(user);
        res.send(accCheck);
      } else {
        accCheck.alreadyCreated = true;
        console.log('Konto już jest ', userAccName);
        res.send(accCheck);
      }

    } catch (error) {
      res.status(500).send();
      console.log('Error on the server, account creating failed: ', error);
    } 
  })

  app.get('/user/:accName', async (req, res) => {
    console.log('/get/user');
    try {
      let userAccName = req.params.accName;
      console.log('getUser userAccName', userAccName)
      let user = await findDataMongo(userAccName);
      if (!user) {
        console.log('/get/user, account retrieval failed.');
        res.status(404).send('User not found');
        
        } else {
          res.send(user);
        }    

      // zrobic logowanie do konta i wysylanie uzytkownika i wyswietlanie w kliencie


    } catch (error) {
      res.status(500).send();
      console.log('Error on the server, account creating failed: ', error);
    }
  })

  

  const server = app.listen(port, listening);
  
  // async function getUserfromMongo(req){
  //   let credentials = JSON.parse(req.header("Authorization"));
  //   let userAcc = credentials.login;
  //   let encrypted = credentials.encrypted
  //   const decrypted = crypto.AES.decrypt(encrypted, key).toString(crypto.enc.Utf8)
  //   errorToThrow = new Error();
  //   if (userAcc != decrypted){
  //     errorToThrow.httpCode = 498;
  //     errorToThrow.httpMsg = "Invalid Token";
  //     throw  errorToThrow;
  //   } else {
  //     let user = await loadDatafromMongo(userAcc);
  //     if (!user) {
  //       errorToThrow.httpCode = 404;
  //       errorToThrow.httlMsg = "No such user";
  //       throw  errorToThrow;
  //     } else {
  //       return user
  //     }
  //   }
  // }

  // try{
  //   let credentials = JSON.parse(req.header("Authorization"));
  //   let userAcc = credentials.login;
  //   let password = credentials.password;
  //   console.log('Zczytalo', userAcc)
    
  //   let accCheck = {
  //     isCreated : true,
  //   };
  //   let user = await loadDatafromMongo(userAcc);
  //   console.log("Konto: ", user)
  //   if (!user){
  //     accCheck.isCreated = false;
  //     console.log('konto nie istnieje, accCheck: ', accCheck)
  //     res.send(accCheck);
  //   } 

  

  // app.put('/users', async function (req, res){
  //   try{
  //     let userAccName = req.body.login;
  //     let password = req.body.password;
  //     console.log("creating account,login: ", userAccName, "pass: ", password)
  //     const hash = await bcrypt.hash(password, saltRounds);
  //     console.log("hash", hash);
  //     let userExists = await loadDatafromMongo(userAccName);
  //     console.log("Sprawdzam czy konto istnieje", userExists);
  //     let accCheck = {
  //       alreadyCreated : false
  //     };
  //     if (!userExists){
  //       let user = {
  //         _id : userAccName,
  //         passwordHash: hash,
  //         tasks: [],
  //         nextTaskId: 0,
  //       }
  //       await saveDataMongo(user);
  //       res.send(accCheck);
  //     } else {
  //       accCheck.alreadyCreated = true;
  //       console.log('Konto już jest ', userAccName);
  //       res.send(accCheck);
  //     }
  //   }catch(error){
  //     res.status(500).send();
  //     console.log('Error on the server, account creating failed: ', error);
  //   }  
  // });

  

  