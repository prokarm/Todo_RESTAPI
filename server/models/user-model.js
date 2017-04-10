const mongoose = require('mongoose');

var User = mongoose.model('Users',{
  name:{
    type:String,
    required:true,
    minlength:1,
    trim:' '
  },
  age:{
    type:Number,
    dafault:22,
  },
  email:{
    type:String,
    default:'xyz@gmail.com'
  }
});

module.exports={User};
