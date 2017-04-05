const {MongoClient,ObjectID}=require('mongodb');

var url='mongodb://localhost:27017/Todoapp';
MongoClient.connect(url,(err,db)=>{
  if (err) {
  return  console.log('unable to connect to database',err);
  }
  console.log("Conncetion successfull");
  db.collection('User').insertOne({
    name:'karmjeet',
    surname:'saroj',
    age:24,
    username:'karmjeetS'
  },(err,result)=>{
    if (err) {
    return  console.log('cannot insert data',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
  });
  db.close();
});
