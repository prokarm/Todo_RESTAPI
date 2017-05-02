const validator =require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ =require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({    //we are creating a new schema with same
                                               //functionality as model but we can add methods to it

    email:{
      type:String,
      required:true,
      minlength:4,
      unique:true,    //this lets make onlly one copy of a data in the whole collection
      validate:{
        validator: validator.isEmail,        //  is an aternative to // (value) => {return validator.isEmail(value)},
        message:'{VALUE} is not correct email'
      }

    },

    password:{
        type:String,
        required:true,
        minlength:6
    },

    tokens:[{
        access:{
          type:String,
          required:true
        },
        token:{
          type:String,
          required:true
        }
      }]

});
userSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','email']);
};

userSchema.methods.generatreAuthToken = function() {    //methods stores user model instances i.e  individual module

 var user = this;
 var access = 'auth';
 var  token = jwt.sign({_id:user._id.toHexString(),access},'golubitti').toString();
  if(user.tokens.length<1){
  user.tokens.push({access,token});
}else {
  console.log('token already present !!');
}
 return user.save().then(() => {
   return token;
 });

};

userSchema.statics.findByToken = function (token){      //statics is where the User model methods are stored
  var  User = this;    // we are binding the this to the User(model name) model to access whole model
  var decoded;
   try {
     decoded = jwt.verify(token,'golubitti')
   } catch (e) {
    //  return new Promise((resolve,reject) =>{ reject(); }) another alternative is
       return Promise.reject();
   }

   return User.findOne({
       '_id':decoded._id,
       'tokens.token': token ,
       'tokens.access':'auth'    // myerrors typed token.access thats why 401 unable to find in the database

   });


};


userSchema.pre('save',function(next){
  var User = this;

  if(User.isModified('password')){
        bcrypt.genSalt(10,function(err,salt){
          bcrypt.hash(User.password,salt,function(err,hash){
            User.password=hash;
            next();
          })
        })
  }
  else {
    next();
  }
});
// finnding the user by email id and password
userSchema.statics.findByCredentials = function (email,password) {
  var User = this ;
  return User.findOne({email}).then((user)=>{
     if(!user){
      return Promise.reject();
    }
  return new Promise ( (resolve,reject) => {
      bcrypt.compare(password,user.password,(err,res) => {
        if(res){
        // console.log(user);
          resolve(user);
        }else {
          reject();
        }
    });
  });
  });

}




var User = mongoose.model('User',userSchema);

module.exports={User};
