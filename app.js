const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const mongoCollection = client.db("skylerSobieProfile").collection("skylerSobieBlog");

function initProfileData() {
  mongoCollection.insertOne({
    title: "This is my dev profile",
    post: "This is a post"
  });
}

//reads data from the collection and logs to the console
app.get('/', async function (req, res) {
  let results = await mongoCollection.find({}).toArray();
  res.render('profile',
    { profileData: results });
})


app.post('/insert', async (req, res) => {

  let results = await mongoCollection.insertOne({
    title: req.body.title,
    post: req.body.post
  })
  res.redirect('/')

});

app.post('/delete', async function (req, res) {

  let result = await mongoCollection.findOneAndDelete(
    {
      "_id": new ObjectId(req.body.deleteId)
    }
  ).then(result => {

    res.redirect('/');
  })
});

app.post('/update', async (req, res) => {
  let result = await mongoCollection.findOneAndUpdate(
    { _id: ObjectId.createFromHexString(req.body.updateId) }, {
    $set:
    {
      title: req.body.updateTitle,
      post: req.body.updatePost
    }
  }
  ).then(result => {
    console.log(result);
    res.redirect('/');
  })
});

app.listen(port, () => console.log(`server is running on ... ${port}`));

/*  
"npm i express"
"npm i body-parser"
"npm i ejs"
"npm i mongodb"
"npm i dotenv"
*/