const {User} =require('./../models/user-model.js')


var authenticate =  (req,res,next) => {

  var token = req.header('x-auth');

  User.findByToken(token).then((user) =>{
    if (!user) {
      return Promise.reject();
    }
    req.user=user;    //we are modifying or attaching the user to the req object of the middleware which will
    req.token=token;//      be passed to the req object of the get route of the user
    next();
  }).catch((e) => {
    res.status(401).send();
  })
};

module.exports = {authenticate}
