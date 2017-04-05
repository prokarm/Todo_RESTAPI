const {MongoClient,ObjectID}=require('mongodb'); //used new es6 feature object destructuring in which we can use to retrive multiple properties or method as a varible

var url='mongodb://localhost:27017/Todoapp';
MongoClient.connect(url,(err,db)=>{
  if (err) {
  return  console.log('unable to connect to database',err);
  }
  console.log("Conncetion successfull");
  db.collection('User').find({username:'KarmjeetS'}).toArray().then((docs)=>{
    console.log('User');
    console.log(JSON.stringify(docs,undefined,2));
    // console.log(`first was created on:${docs[0]._id.getTimestamp()}`);
    // console.log(`first was created on:${docs[2]._id.getTimestamp()}`);
  },(err)=>{
    console.log('no data available or having error:',err);
  });
  db.collection('User').find({username:'KarmjeetS'}).count().then((count)=>{
    console.log(`the number of records are:${count}`);
      },(err)=>{
    console.log('no data available or having error:',err);
  });

  //db.close();
});
