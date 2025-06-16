require('@dotenvx/dotenvx').config()
// require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const storage = require('./mongo.js');


const saveDataMongo = storage.saveDataMongo;
const findDataMongo = storage.findDataMongo;

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

  app.get('/users/tasks', async function (req, res){
    try{
      let user = await getUserfromMongo(req);
      let taskArr = user.tasks
      console.log("Sending tasks", taskArr.length);
      res.send(taskArr);
    } catch(error){
      if (error.httpCode) {
        res.status(error.httpCode).send(error.httpMsg);
      } else {
        res.status(500).send();
        console.log('Error on the server, getting task list failed: ', error)
      } 
    }  
  })

  
  
  let postArr = []
  let nextPostId  = 100;
  let commentArr = [];
  let nextCommentId = 1000;

  app.get('/userpostlist', async (req, res) => {
    try{
      let postsAndCommentsArr = [];
      console.log("/userpostlist, postsAndCommentsArr", postsAndCommentsArr)
      // if (!postsAndCommentsArr){
      //   let pArr = []
      //   res.send(pArr);
      // } else { when taking data from database
      for (oldPost of postArr){
        var post = {...oldPost}
        post.comments = [];
        postsAndCommentsArr.push(post);
        for (comment of commentArr) {
          if (post.id === comment.postId){
                console.log('post.id', post.id, 'comment.postId', comment.postId)
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
    try{
      let singlePost = {
        id: -1,
        content: '',
        userId: -1
      };
      let userToken = JSON.parse(req.header("Authorization"));
      console.log("/useronepost, userToken", userToken)
      singlePost.content = req.body.content;
      singlePost.userId = userToken;
      singlePost.id = nextPostId;
      nextPostId = nextPostId +1;
      console.log("singlePost", singlePost)
      postArr.push(singlePost);
      console.log('postArr', postArr);
      res.send('OK');
      // res.send(singlePost);
    }catch(error){
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
      singleComment.id = nextCommentId;
      nextCommentId = nextCommentId + 1;
      console.log("useronecomment, singleComment", singleComment)
      commentArr.push(singleComment);
      console.log('commentArr', commentArr);
      res.send('OK');
      // res.send(singlePost);
    }catch(error){
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
          accountName: userAccName
        }
        await saveDataMongo(user);
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

  

  