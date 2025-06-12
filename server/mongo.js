const { MongoClient, ServerApiVersion } = require('mongodb');
require('@dotenvx/dotenvx').config()

const uri = process.env.URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

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
        const result = await users.findOne(query);
        console.log('findDataMongo', result);
        return result;
    } finally {
        await client.close();
      }
    
}

async function saveDataMongo(data) {
    console.log("index.js: I'm in")
    try {
    await client.connect();

      const database = client.db('quackdata');
      const users = database.collection('users');
  
      // console.log(`Saving: ${(util.inspect(data, {depth: null}))}`);
  
    //   const id = data._id;
    //   console.log('id', id)
    //   const filter = {_id : id};
  
      // console.log(`Deleting`);
    //   await taskList.deleteOne(filter);
      // console.log(`Inserting`);
  
      const result = await users.insertOne(data);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      await client.close();
    }
  }

  async function loadDatafromMongo(data){
    try {
        await client.connect();
        const database = client.db('quackdata');
        const users = database.collection('users');
        let query = {accountName: data}
        const allRecords = await users.findOne(query);
        console.log(`2Records has been read with _id: ${allRecords._id}`);
        return allRecords;
  
      
    } finally {
      // await client.close();
    }
  }

  let storage = {
    saveDataMongo: saveDataMongo,
    findDataMongo: findDataMongo,
    loadDatafromMongo: loadDatafromMongo,
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