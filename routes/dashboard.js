var express = require('express');
var router = express.Router();
var customerModel=require('../modules/customer');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');  
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
/* GET home page. */
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
router.get('/',checkLoginUser, function(req, res, next) {
    var Username=localStorage.getItem('Username');
   res.render('dashboard', { title: 'Leisure',Username:Username, msg:'' });
 });
  module.exports = router;