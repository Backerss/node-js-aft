

const express = require('express');

const path = require('path');
const bcrypt = require('bcrypt');
const { connection } = require('../../sql/db');
const cookieParser = require('cookie-parser');

const logins = express.Router();

//io
const io = require('socket.io')();



logins.use(cookieParser({
    name : 'session',
    keys : ['key1', 'key2'],
    maxAge : 24 * 60 * 60 * 1000 // 24 hours
}));

const ifLoginNow = (req, res, next) => {
    //get cookie
    const cookies = req.cookies;
    if(cookies.user_name)
    {
        return res.redirect('/admin');
    }else next();
}

logins.get('/', ifLoginNow, (req, res) => {
    res.render('page/login');
});


logins.post('/loginForm', (req, res) => {
    
    const { email, pass } = req.body;

    if(email === '' || pass === '') {
        res.render('page/login', {
            error: 'email:pass:empty'
        });
    }else
    {
        //compare password
        connection.query('SELECT * FROM nwvoc_user WHERE user_email = ?', [email], (err, results) => {
            if(err) throw err;
            if(results.length > 0) {
                if(bcrypt.compareSync(pass, results[0].user_pass)) {

                    //set cookie
                    res.cookie('user_id', results[0].user_id, { maxAge: 24 * 60 * 60 * 1000});
                    res.cookie('user_name', results[0].user_firstname, { maxAge: 24 * 60 * 60 * 1000 });
                    
                    res.redirect('/admin');
                }else {
                    res.render('page/login', {
                        error: 'password:notfound'
                    });
                }
            }else {
                res.render('page/login', {
                    error: 'email:notfound'
                });
            }
        });
    }

    
});



exports.logins = logins;