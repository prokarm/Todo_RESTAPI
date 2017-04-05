const {MongoClient,ObjectID}=require('mongodb'); //used new es6 feature object destructuring in which we can use to retrive multiple properties or method as a varible

var url='mongodb://localhost:27017/Todoapp';
MongoClient.connect(url,(err,db)=>{
  if (err) {
  return  console.log('unable to connect to database',err);
  }
  console.log("Conncetion successfull");
  var collection =db.collection('User');
  //deleteMany

  // collection.deleteMany({name:'karmjeet'}).then((result)=>{
  //   console.log(result);
  // });
  //deleteone
  // collection.deleteOne({name:'karmjeet'}).then((result)=>{
  //   console.log(result);
  // });

  ///findOneAndDelete
  collection.findOneAndDelete({_id:new ObjectID('58d76cb1c84a880dbceb7d93')}).then((result)=>{
    console.log(result);
  });



  //db.close();
});
