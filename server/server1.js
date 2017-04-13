
const express=require('express');
const bodyParser=require('body-parser');//its a middleware which stores the data being posted as a body
const {ObjectID}=require('mongodb');

const mongoose=require('./database/mongooseORM.js');
const {todo}=require('./models/todo-model.js'); // is old method or alternatively const Todo = require('./models/todo-model.js').todo;
// IMPNOTE: in es6 object destructuring, we pull out the properties or methods from an object creating a vriable
            // AND pointing that varible to THAT particular object or method ,
            // so by this we do not have to create every time a seperate extra line which is same to pull a different property from that same object
const {User}=require('./models/user-model.js')

var app =express();

app.use(bodyParser.json()); //we are using this middleware to send json data in the body which is being sedn over to server

app.post('/about',(req,res)=>{
  // console.log(req.body);
  var Todo = new todo({
    text:req.body.textdata
  });

  Todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send('something is wrong!! karm with __todo__ ')
    // console.log('',e);
  });
});

//stage: /GET for todo
 app.get('/about',(req,res)=>{
     todo.find().then((todos)=>{
         res.send({todos});
     },(e)=>{
       res.status(400).send(e);
     });
 });

// stage: Post for User
app.post('/User',(req,res)=>{
  var user = new User({
    name:req.body.namea ,
    age:req.body.age
  });
user.save().then((docs)=>{
  res.send(docs);
  // console.log(docs);
},(e)=>{
    res.status(400).send(`something went wrong !!${e}`);
  });
});

//stage:to get an id from the user

app.get('/about/:id',(req,res)=>{
  var id = req.params.id;

   if(!ObjectID.isValid(id)){
     res.status(404).send();
     console.log('id you provided is invalid');
     return;
   }

   todo.findById(id).then((tododata)=>{
  if (!tododata) {
    res.status(404).send();
    console.log('id is not present in the document!!');
  }
    res.send({tododata});

  },(e)=>{
     res.status(404).send(id)
     console.log('data is found in the collection');
   }).catch((e)=>{
     res.status(404).send();
   });



});     // /:id is the url pattern similar to todos/123 where id:123


app.listen(3000,()=>{
  console.log('server is up and running');
});
module.exports={app};
