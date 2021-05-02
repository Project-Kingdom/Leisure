var express = require('express');
var router = express.Router();
var customerModel=require('../modules/customer');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');  
var jwt = require('jsonwebtoken');
const axios=require('axios');
require('dotenv').config({ path: __dirname+'/.env' })

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


router.get('/',checkLoginUser, async(req, res)=> {
    var Username=localStorage.getItem('Username');
    try{
      const movieAPI = await axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=a119b32c7ac09bfbd83ca7c34317afb1`);
      console.log(movieAPI.data);
      res.render('dashboard', { title: 'Leisure',Username:Username, msg:'',articles:movieAPI.data});
    } catch(err){
      if(err.response) {
        res.render('index', { articles : null })
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
    } else if(err.requiest) {
        res.render('index', { articles : null })
        console.log(err.requiest)
    } else {
        res.render('index', { articles : null })
        console.error('Error', err.message)
    }
    }
 });
 router.post('/', async(req, res) => {
  let search = req.body.search
  var Username=localStorage.getItem('Username');
  try {
      const movieAPI = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=a119b32c7ac09bfbd83ca7c34317afb1&query=${search}`)
      res.render('movie_search', {title: 'Leisure',Username:Username, msg:'', articles : movieAPI.data })    
  } catch (err) {
      if(err.response) {
          res.render('movie_search', {title: 'Leisure',Username:Username, msg:'', articles : null })
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
      } else if(err.requiest) {
          res.render('movie_search', { title: 'Leisure',Username:Username, msg:'', articles : null })
          console.log(err.requiest)
      } else {
          res.render('movie_search', { title: 'Leisure',Username:Username, msg:'', articles : null })
          console.error('Error', err.message)
      }
  } 
})

  module.exports = router;