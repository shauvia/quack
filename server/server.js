const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


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

  // app.get("/userposts", async (req,res) => {
  //   try{
  //   //   let quizzesList =  await loadDatafromMongo();
  //     console.log("server get, data", postList)
  //     if (!postList){
  //       let qArr = []
  //       res.send(qArr);
  //     } else {
  //       res.send(postList);
  //     }
  //   } catch(error){
  //       if (error.httpCode) {
  //         res.status(error.httpCode).send(error.httpMsg);
  //       } else {
  //         res.status(500).send();
  //         console.log('Error on the server, retrieve userposts failed: ', error)
  //       }
  //     }   
  // });

  // app.post("/userposts", async (req, res)=> {
  //   try{
  //     postList = req.body;
  //   //   await saveDataMongo(quizzesList);
  //     console.log("server posting quizzes, quizesList", postList);
  //     res.send("OK");
  //   } catch(error){
  //     if (error.httpCode) {
  //       res.status(error.httpCode).send(error.httpMsg);
  //     } else {
  //       res.status(500).send();
  //       console.log('Error on the server, posting task failed: ', error);
  //     }
  //   }  
      
  // })

  let postArr = []
  let nextPostId  = 10;
  let commentArr = [];
  let nextCommentId = 20;

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

  // for(let i = 0; i < newPosts.length; i++){
    //   if (i===postIndex){
    //    newPosts[i].comments.push(commentContent);
    //     }
    //   }

  app.get('/usercommentlist', async (req, res) => {
    try{
      console.log("/usercommentlist commentArr", commentArr)
      if (!commentArr){
        let cArr = []
        res.send(cArr);
      } else {
        res.send(commentArr);
      }
    } catch (error) {
      if (error.httpCode) {
        res.status(error.httpCode).send(error.httpMsg);
      } else {
        res.status(500).send();
        console.log('Error on the server, retrieve commentArr failed: ', error)
      }
    }
  })

  app.post('/useronepost', async (req, res) => {
    console.log("/useronepost")
    try{
      let singlePost = {
        id: -1,
        content: ''
      };
      singlePost.content = req.body.content;
      singlePost.id = nextPostId
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
      singleComment.id = nextCommentId;
      nextCommentId = nextCommentId + 1;
      console.log("singleComment", singleComment)
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

  const server = app.listen(port, listening);

  

  // app.post('/users/tasks', async function(req, res){
  //   try {    
  //     let user = await getUserfromMongo(req);
  //     let nextTaskId = user.nextTaskId;
  //     const singleTask = {
  //       taskName: "",
  //       checked: false,
  //       taskId: -1
  //     }
  //     singleTask.taskId = nextTaskId;
  //     nextTaskId = nextTaskId + 1;
  //     user.nextTaskId = nextTaskId;
  //     console.log("nextTaskId", nextTaskId)
  //     singleTask.taskName = req.body.userTask;
  //     user.tasks.push(singleTask);
  //     console.log("user", user);
  //     await saveDataMongo(user);
  //     // console.log("allTasks", allTasks);
  //     res.send("OK");
  //   }catch(error){
  //     if (error.httpCode) {
  //       res.status(error.httpCode).send(error.httpMsg);
  //     } else {
  //       res.status(500).send();
  //       console.log('Error on the server, posting task failed: ', error);
  //     }
  //   }
  // })
  
  
  
  // app.get('/users/tasks', async function (req, res){
  //   try{
  //     let user = await getUserfromMongo(req);
  //     let taskArr = user.tasks
  //     console.log("Sending tasks", taskArr.length);
  //     res.send(taskArr);
  //   } catch(error){
  //     if (error.httpCode) {
  //       res.status(error.httpCode).send(error.httpMsg);
  //     } else {
  //       res.status(500).send();
  //       console.log('Error on the server, getting task list failed: ', error)
  //     } 
  //   }  
  // })