const {MongoClient,ObjectID}=require('mongodb');

var url='mongodb://localhost:27017/Todoapp';
MongoClient.connect(url,(err,db)=>{
  if(err){return console.log('unable to connect to the database :',err);}
  console.log('Conncetion is done to database');

  var collection=db.collection('User');

  //find and update the data
collection.findOneAndUpdate({name:'sumit'},{age:80},{returnOriginal:false}).then((re)=>{
  return console.log(re);
});



});
