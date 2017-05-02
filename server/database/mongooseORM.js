const mongoose=require('mongoose');

var url ='mongodb://localhost:27017/Todoapp';
mongoose.Promise=global.Promise;
mongoose.connect(process.env.MONGODB_URI || url);   //mongodb_URI will be available on process environment when we run  our app on heroku
 module.exports={mongoose};
