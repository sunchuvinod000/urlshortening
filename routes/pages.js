const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dotenv = require('dotenv');


const db = mysql.createConnection({
    host: "nnmeqdrilkem9ked.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "tkuxmzjnmcagk6tk",
    password: "ehuksxoopbhg3gys",
    database: "suwdt6giiu8qz4aa"

});

router.get('/', (req, res) =>{
    res.render('index');
});

router.get('/register', (req, res) =>{
    res.render('register');
});
router.get('/login', (req, res) =>{
    res.render('login');
    
});
router.get('/myurls', (req,res) =>{
    if(!req.cookies.email){
        
        res.render('myurls', {
            notlogin :'<div class="content-myurl "><div class=" justify-content-center row"><i class="fa fa-frown-o imoji text-danger" aria-hidden="true"></i></div> <div class="row justify-content-center"><p class="h3 "><strong>You are not logged in...</strong></p></div></div>'
        });
    }else{
    db.query('select long_url,short_url from users_urls where email=?',[req.cookies.email],(error,result) =>{
        
        if(error){
            console.log(error);}
        else{
            res.render('myurls',{
                result: result,
                logout: '<div class="row justify-content-center mt-5"><form action="/auth/logout" method="GET"><button type="submit" class="btn btn-primary">Logout</button></form></div>',
                bottom: 'fixed-bottom',
                nourls: '<div class="row justify-content-center mt-5"><strong class="text-danger h1">It looks like you have not generated any urls <br> <center> :)</center> </strong></div>' ,

            })
        }
       

    });
}
});


   
 
    
  

module.exports = router;