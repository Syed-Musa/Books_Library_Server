const cors = require('cors');
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express());
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jv3edzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const BooksCollection = client.db('BooksLibrariesDB').collection('famouse');
    const AllBooksCollection = client.db('BooksLibrariesDB').collection('allbooks');
    const BorrowedBooksCollection = client.db('BooksLibrariesDB').collection('borrowedbooks');
    const userCollection = client.db('BooksLibrariesDB').collection('user');

    app.post('/borrowedbooks',async(req,res)=>{
      const body = req.body
      const value = await BorrowedBooksCollection.insertOne(body);
      console.log(value);
      res.send(value)
    });

    app.get('/user', async(req, res)=>{
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    })

    app.post('/user', async(req, res)=>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get('/allbooks', async(req, res)=>{
      const result = await AllBooksCollection.find().toArray();
      res.send(result);
    });

    app.get('/allbooks/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await AllBooksCollection.findOne(query);
      res.send(result);
    });

    app.post('/allbooks', async(req, res)=>{
      const newBooks = req.body;
      console.log(newBooks);
      const result = await AllBooksCollection.insertOne(newBooks);
      res.send(result);
    });
  
    // app.post('/allbooks', async(req, res) => {
    //   try {
    //       const newBooks = req.body; 
    //       console.log(newBooks);
          
    //       const result = await AllBooksCollection.insertOne(newBooks); 
    //       res.send(result);
    //   } catch (error) {
    //       console.error("Error inserting the book:", error);
    //       res.status(500).send({ message: "Failed to add the book." });
    //   }
    // });
  

    app.put('/allbooks/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const UpdatedBooks = req.body;
      const books = {
        $set: {
          books_name:UpdatedBooks?.books_name, 
          author_name:UpdatedBooks?.author_name, 
          category:UpdatedBooks?.category, 
          publisher:UpdatedBooks?.publisher, 
          Rating:UpdatedBooks?.Rating, 
          num_of_page:UpdatedBooks?.num_of_page, 
          details:UpdatedBooks?.details, 
          books_image:UpdatedBooks?.books_image,
        }
      }

      const result = await AllBooksCollection.updateOne(filter, books, options);
      res.send(result);
    })

    app.get('/famouse', async(req, res)=>{
      const result = await BooksCollection.find().toArray();
      res.send(result);
    });

    app.get('/famouse/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await BooksCollection.findOne(query);
      res.send(result);
    });
  
    app.post('/famouse', async(req, res)=>{
      const category = req.body;
      console.log(category);
      const result = await BooksCollection.insertOne(category);
      res.send(result);
    });

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);




app.use('/', (req, res)=>{
    res.send('Books Library running')
});

app.listen(port, ()=>{
    console.log(`Books Library is running on port ${port}`)
});