
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const tinyurl = require('tinyurl');
var validate = require('url-validator');


const db = mysql.createPool({
    host: "nnmeqdrilkem9ked.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "tkuxmzjnmcagk6tk",
    password: "ehuksxoopbhg3gys",
    database: "suwdt6giiu8qz4aa"

});
db.getConnection((error,connection) =>{
    try{
        if(connection){
            connection.release();
        }

    }
    catch(error){
        console.log(error);
    }
})

exports.shorten = (req, res) => {
    const mail = req.cookies.email;

    const longurl = req.body.longurl;
    if (!validate(longurl) ) {
        return res.render('index', {
            invalidurl: 'please enter a valid url',
        })
       
    }
  
    tinyurl.shorten(longurl, (result, error) => {
        if (error) {
            return res.render('index', {
                serverproblem: 'there is some problem in url generation try again :) '
            })
        }
        if (!mail) {

            return res.render('index', {
                shorturl: result,
                element: ' <center><div class="alert alert-success alert-dismissible"><a  class="close" data-dismiss="alert" aria-label="close" >&times;</a>To store your urls please <strong><a href="/login">Login here</a></strong> and try again</div ></center> '

            })
        }
        else {
            db.query('insert into users_urls set ?', { email: mail, long_url: longurl, short_url: result }, async (error,results) => {
            if(error){
                console.log(error)
            }
            else{
                console.table(results);
                res.render('index',{
                    shorturl:result
                })

            }
               
            })
        }
    });
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'please provide email and password'
            })
        }
        db.query('select * from users_table where email = ?', [email], async (error, results) => {
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                return res.status(401).render('login', {
                    message: 'Email or password is incorrect'
                })
            }
            else {
                const email = results[0].email;

                // adding the user data into cookies
                res.cookie('email', email, { maxAge: 7776000000 + Date.now() });
                
                res.redirect('/')

            }

        })
    }
    catch{
        console.log(error);
    }
}
exports.register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
    db.query('select email from users_table where email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }
        if (result.length > 0) {
            return res.render('register', {
                exists: 'That email already exists'
            })

        }
        else if (password != passwordConfirm) {
            return res.render('register', {
                dontmatch: 'passwords do not match'
            })

        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('insert into users_table set ?', { name: name, email: email, password: hashedPassword }, async (error, results) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(results);

                return res.render('register', {
                    message: '<p class="alert-success"><i class="fa fa-check text-success" aria-hidden="true"></i>  you are registered</p>'

                });
            }
        })
    });
}

exports.logout = (req,res) =>{
    res.cookie('email','',{expires: new Date(0)});
    res.redirect('/');
}
