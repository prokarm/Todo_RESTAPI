require('./config/config.js');
const _ = require('lodash');
const express=require('express');
const bodyParser=require('body-parser');//its a middleware which stores the data being posted as a body
const {ObjectID}=require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const mongoose=require('./database/mongooseORM.js');
const {todo}=require('./models/todo-model.js'); // is old method or alternatively const Todo = require('./models/todo-model.js').todo;
// IMPNOTE: in es6 object destructuring, we pull out the properties or methods from an object creating a vriable
            // AND pointing that varible to THAT particular object or method ,
            // so by this we do not have to create every time a seperate extra line which is same to pull a different property from that same object
const {User}=require('./models/user-model.js');
const {authenticate} = require('./middleware/authenticate.js')

var port = process.env.PORT /* || 3000 */ ;

var app = express();

app.use(bodyParser.json()); //we are using this middleware to send json data in the body which is being sedn over to server

                        // stage : /POST for todo

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




                                    //stage:to get an id from the todo database

app.get('/about/:id',(req,res)=>{
  var id = req.params.id;

   if(!ObjectID.isValid(id)){
     res.status(404).send();
     console.log('id you provided is invalid');
     return;
   }

   todo.findById(id).then((tododata) => {
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


                       //stage:delete the data from the


 app.delete('/about/:id',(req,res) => {

   var id = req.params.id;

    if(!ObjectID.isValid(id)){
         res.status(404).send();
        console.log('id you provided is invalid');
        return;
   }

   todo.findByIdAndRemove(id).then((deletedata) => {

           if(!deletedata) {
             res.status(404).send();
             console.log('data is not presenet in the database');
           }
           res.send({deletedata});

   }).catch((e) => {
     res.status(400).send();
     console.log(e);
   });
 }); //end delete



                                            //Start: patch

app.patch('/about/:id',(req,res) => {

  id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if(!ObjectID){
    res.status(404).send();
  }

  //checking if the  completed is set to true then we will update the completedat

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedat = new Date().getTime();

  }
  else {

    body.completedat = null;
    body.completed = false;
  }

  todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((updatedata) => {
    if(!updatedata){
      return res.status(404).send();
    }

    res.send({updatedata});
  }).catch((e) => {
    return res.status(400).send();
  });
});//end patch


                                // stage: Post for User
// 0
app.post('/User',(req,res)=>{
var body = _.pick(req.body , ['email','password']);

var user = new User(body);

user.save().then( () => {

 return user.generatreAuthToken();


// res.send(docs);
// console.log(docs);
}).then((token) => {
  res.header('x-auth',token).send(user); //weare creating custom headers
}).catch((e) => {

  res.status(400).send(`something went wrong !!${e}`);
    });
});


      //stage: private route to fetch user


app.get('/User/me',authenticate,(req,res) => {

      // var token = req.header('x-auth');
      //
      // User.findByToken(token).then((user)=>{
      //
      //   if (!user) {  //checking if the user is found in the database or not
      //    console.log('not in the database ');
      //     return Promise.reject();
      //
      //   }
      //
      //   res.send(user);
      //
      // }).catch((e) =>{
      //   res.status(401).send(e);
      // });  // it was private route code for this route only  now after adding the middleware to this route we use just below line
      res.send(req.user);

   });
//1
   app.post('/User/login',(req,res) => {

     var body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email,body.password).then((user) => {
     user.generatreAuthToken().then((token) => {
         res.header('x-auth',token).send(user);
     });
  }).catch((e) => {
     res.status(400).send();
  });

   });





app.listen(port,()=>{
  console.log(`server is up and running on port ${port}`);
});
module.exports={app};
