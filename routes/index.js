var express = require('express');
var router = express.Router();
var customerModel=require('../modules/customer');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');  
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
/* GET home page. */
router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard');
  }else{
  res.render('index', { title: 'Leisure', msg:'' });
  }
});
function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) { 
    res.redirect('/log_in');
  }
  next(); 
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkUsername(req,res,next){
  var uname=req.body.uname;
  var checkexitemail=customerModel.findOne({username:uname});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('sign_up', { title: 'Leisure', msg:'Username Already Exit' });

 }
 next();
  });
}

function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=customerModel.findOne({email:email});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
return res.render('sign_up', { title: 'Leisure', msg:'Email Already Exit' });

 }
 next();
  });
}

router.get('/log_in', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard');
  }else{
  res.render('log_in', { title: 'Leisure', msg:'' });
  }
});

router.post('/log_in', function(req, res, next) {
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var checkUser=customerModel.findOne({email:email});
  checkUser.exec((err, data)=>{
    if(data==null){
     res.render('log_in', { title: 'Leisure', msg:"Invalid Username and Password." });

    }else{
if(err) throw err;
var getUserID=data._id;
var getPassword=data.password;
var getUser=data.username;

if(bcrypt.compareSync(password,getPassword)){ 
    var token = jwt.sign({ userID: getUserID }, 'loginToken');
    localStorage.setItem('userToken', token);
    localStorage.setItem('loginUser',email);
    localStorage.setItem('Username',getUser);
   res.redirect('/home');
   //res.render('log_in', { title: 'Leisure', msg:"Login Successfully." });
}else{
  res.render('log_in', { title: 'Leisure', msg:"Invalid Username and Password." });

}
    } 
  }); 
 
});
// router.get('/dashboard',checkLoginUser, function(req, res, next) {
//    //var loginUser=localStorage.getItem('loginUser');
//   res.render('dashboard', { title: 'Leisure', msg:'' });
// });

router.get('/sign_up', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard');
  }else{
  res.render('sign_up', { title: 'Leisure', msg:'' });
  }
});
router.post('/sign_up',checkUsername,checkEmail,function(req, res, next) {
        var username=req.body.uname;
        var email=req.body.email;
        var password=req.body.password;  
        var confpassword=req.body.confpassword;
  if(password !=confpassword){
    res.render('sign_up', { title: 'Leisure', msg:'Password not matched!' });
  }else{
     password =bcrypt.hashSync(req.body.password,10);
        var userDetails=new customerModel({
          username:username,
          email:email,
          password:password
        });
     userDetails.save((err,doc)=>{
        if(err) throw err;
        res.render('log_in',{title:'Leisure',msg:''})
     })  ;
    } 
});

router.get('/home', function(req, res, next) {
  var Username=localStorage.getItem('Username');
  var loginUser=localStorage.getItem('loginUser');
  res.render('home', { title: 'Leisure',Username:Username, msg:'' });
});
router.get('/payment_49', function(req, res, next) {
  var price=49;
  var quality="HD available";
  res.render('payment', { title: 'Leisure' ,price:price,quality:quality, msg:'' });
});


router.get('/payment_99', function(req, res, next) {
  var price=99;
  var quality="Ultra HD available"
  res.render('payment', { title: 'Leisure' ,price:price,quality:quality, msg:'' });
});

router.post('/payment',function(req, res, next) {
  res.redirect('/dashboard');
});



router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});

module.exports = router;
