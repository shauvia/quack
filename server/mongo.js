const { MongoClient, ServerApiVersion } = require('mongodb');
require('@dotenvx/dotenvx').config()

const uri = process.env.URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
   maxPoolSize: 200,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
 
});

// const client = new MongoClient(uri, {
//   maxPoolSize: 200
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

async function findDataMongo(data){
    try{
        await client.connect();
        const database = client.db('quackdata');
        const users = database.collection('users');
        let query = {accountName: data}
        console.log("findDataMongo, query", query)
        const result = await users.findOne(query);
        // console.log('findDataMongo', result);
        return result;
    } finally {
        // await client.close();
      }
    
}

async function loadUserMongo(data){
    try{
        await client.connect();
        const database = client.db('quackdata');
        const users = database.collection('users');
        let query = {_id: data}
        // console.log("loadUserMongo, query", query)
        const result = await users.findOne(query);
        // console.log('loadUserMongo, result', result);
        return result;
    } finally {
        // await client.close();
      }
    
}



async function loadAllUsersFromMongo(){
  try{
    await client.connect();

      const database = client.db('quackdata');
      const dbCollection = database.collection('users');
      const allRecords = await dbCollection.find().toArray();
      console.log(`Records  from  ${dbCollection} has been read with _id: ${allRecords.map(x => x._id)}`);
      return allRecords;

  } finally {
    // await client.close();
  }
}


async function loadAllUsersPosts(){
  try{
    await client.connect();

      const database = client.db('quackdata');
      const dbCollection = database.collection('posts');
      const allRecords = await dbCollection.find().toArray();
      console.log(`Records  from  ${dbCollection} has been read with _id: ${allRecords.map(x => x._id)}`);
      return allRecords;

  } finally {
    // await client.close();
  }
}

async function loadAllUsersComments(){
  try{
    // await client.connect();

      const database = client.db('quackdata');
      const dbCollection = database.collection('comments');
      const allRecords = await dbCollection.find().toArray();
      console.log(`Records  from  ${dbCollection} has been read with _id: ${allRecords.map(x => x._id)}`);
      return allRecords;

  } finally {
    // await client.close();
  }
}



async function saveDataMongo(data, collectionName) {
    console.log("index.js: I'm in")
    try {
    await client.connect();

      const database = client.db('quackdata');
      const dbCollection = database.collection(collectionName);
  
      // console.log(`Saving: ${(util.inspect(data, {depth: null}))}`);
  
    //   const id = data._id;
    //   console.log('id', id)
    //   const filter = {_id : id};
  
      // console.log(`Deleting`);
    //   await taskList.deleteOne(filter);
      // console.log(`Inserting`);
  
      const result = await dbCollection.insertOne(data);
      console.log(`saveDataMongo, A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      // await client.close();
    }
  }

  async function loadAllRecordsfromMongo(id, collectionName){
    try {
        await client.connect();
        const database = client.db('quackdata');
        const collection = database.collection(collectionName);
        let query = {userId : id}
        console.log("loadAllRecordsfromMongo, query", query)
        const allRecords = await collection.find(query).toArray();
        console.log(`Records  from  ${collectionName} has been read with _id: ${allRecords.map(x => x._id)}`);
        return allRecords;
  
      
    } finally {
      // await client.close();
    }
  }
  

  async function loadDatafromMongo(data){
    try {
        await client.connect();
        const database = client.db('quackdata');
        const users = database.collection('users');
        let query = {accountName: data}
        console.log("loadDatafromMongo, query", query)
        const allRecords = await users.findOne(query);
        console.log(`2Records has been read with _id: ${allRecords._id}`);
        return allRecords;
  
      
    } finally {
      // await client.close();
    }
  }


  
  async function saveCommentToMongo(comment){
    await saveDataMongo(comment, "comments");
  }

  async function savePostToMongo(post){
    await saveDataMongo(post, "posts");
  }

  async function saveUserToMongo(user) {
    await saveDataMongo(user, "users");
  }

  async function loadAllPostsfromMongo(userId){
    return await loadAllRecordsfromMongo(userId, "posts");
  }

  async function loadAllCommentsfromMongo(userId){
    return await loadAllRecordsfromMongo(userId, "comments");
  }


  let storage = {
    loadUserMongo: loadUserMongo,
    findDataMongo: findDataMongo,
    loadDatafromMongo: loadDatafromMongo,
    saveCommentToMongo: saveCommentToMongo,
    savePostToMongo: savePostToMongo,
    saveUserToMongo: saveUserToMongo,
    loadAllPostsfromMongo: loadAllPostsfromMongo,
    loadAllCommentsfromMongo: loadAllCommentsfromMongo,
    loadAllUsersPosts: loadAllUsersPosts,
    loadAllUsersComments: loadAllUsersComments,
    loadAllUsersFromMongo:loadAllUsersFromMongo
  };
  
  module.exports = storage;

//   async function saveDataMongo(data) {
//     try {
//             await client.connect();
//             console.log("Successfully connected to Atlas");
  
//             // Get the database and collection on which to run the operation
//             const db = client.db("quizAppDatabase");
//             //  console.log("db", db)
//             const col = db.collection("allQuizzes");
//             //  console.log('id', id)
//             const id = "lisWitalis";
//             const filter = {_id : id};
//             console.log("filter", filter);
//             await col.deleteOne(filter);
//             const userdData = {
//               _id: "lisWitalis",
//               quizzesList: data
//             }
//             const result = await col.insertOne(userdData);
//             console.log(`A document was inserted with the _id: ${result.insertedId}`);
      
    
//           } finally {await client.close();}
//   } 