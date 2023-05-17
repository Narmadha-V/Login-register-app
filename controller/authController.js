const User = require('./../model/userModel')
exports.signup = async (req,res,next)=>{
try{
  const newUser = await User.create(req.body)
res.status(200).json({
  status:'success',
  data:{
   newUser
  }
});
}catch(err){
  res.status(400).json({
    status:'error',
    message:'You got some error'
  })
}

}