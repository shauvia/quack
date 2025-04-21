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

  app.get("/userposts", async (req,res) => {
    try{
    //   let quizzesList =  await loadDatafromMongo();
      console.log("server get, data", postList)
      if (!postList){
        let qArr = []
        res.send(qArr);
      } else {
        res.send(postList);
      }
    } catch(error){
        if (error.httpCode) {
          res.status(error.httpCode).send(error.httpMsg);
        } else {
          res.status(500).send();
          console.log('Error on the server, retrieve userposts failed: ', error)
        }
      }   
  });

  app.post("/userposts", async (req, res)=> {
    try{
      postList = req.body;
    //   await saveDataMongo(quizzesList);
      console.log("server posting quizzes, quizesList", postList);
    } catch(error){
      if (error.httpCode) {
        res.status(error.httpCode).send(error.httpMsg);
      } else {
        res.status(500).send();
        console.log('Error on the server, posting task failed: ', error);
      }
    }  
      
  })

  const server = app.listen(port, listening);