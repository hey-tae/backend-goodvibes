// console.log('may node be with you')
const dotenv = require('dotenv')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

// template engine
app.set('view engine', 'ejs')

//middleware
dotenv.config()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // urlencoded tells bodyParser to extract data from the form element and add to the body property in req object
app.use(express.static('public')) // make the public folder accessible to the public 


//establish connection to database
MongoClient.connect(process.env.CONNECTIONSTRING, {useUnifiedTopology: true}, (err, client)=>{
    if(err) return console.log(err)
    console.log('connected to the database')
    const db = client.db('star-wars')
    const quotesCollection = db.collection('quotes')

app.get('/', async (req,res)=>{
   // res.sendFile(__dirname + '/index.html')
    const results = await db.collection('quotes').find().toArray()
    console.log(results)
    res.render('index.ejs', {quotes: results})
})

app.post('/quotes', (req,res)=>{
    quotesCollection.insertOne(req.body)
    .then(result => {
        res.redirect('/')
        //console.log(result)
    })
    .catch(error => console.error(error))

})

app.put('/quotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
      { name: 'tae' },
      {
        $set: {
          name: req.body.name,
          quote: req.body.quote
        }
      },
      {
        upsert: true
      }
    )
      .then(result => res.json('Success'))
      .catch(error => console.error(error))
  })
   

  app.delete('/quotes', (req,res) => {
      quotesCollection.deleteOne(
          { name: req.body.name},
      )
      .then(result => res.json('Deleted quote'))
  })
  
})





// app.get('/',(req,res)=>{
//     res.sendFile(__dirname + '/index.html')
// })

// app.post('/quotes', (req,res)=>{
//     console.log('hi how are ya')
//     console.log(req.body)
// })








app.listen(5500, ()=>{
    console.log("the server is running on port 5500")
})