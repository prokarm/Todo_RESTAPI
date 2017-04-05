const mongoose=require('mongoose');
var todo=mongoose.model('Todo',
{
  text:{
    type:String,
    required:true,
    trim:true
  },
  completedat:{
    type:Number,
    default:null
  },
  completed:{
    type:Boolean,
    default:false
  }
});

module.exports={todo};
