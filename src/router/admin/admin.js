


const express = require('express');

const path = require('path');
const bcrypt = require('bcrypt');
const { connection } = require('../../sql/db');
const cookieParser = require('cookie-parser');

const admins = express.Router();

admins.use(cookieParser());



//set cookie expires
const ifLoginNow = (req, res, next) => {
    
    
    if(req.cookies.user_name === undefined)
    {
        res.redirect('/login');
        next();
    }
    else
    {
        LoadData(req, res);
    }

}


admins.get('/', ifLoginNow, (req, res) => {
    
    LoadData(req, res);
});


admins.post('/post', (req, res) => {

    const user_postion = req.cookies.user_postion;
    const post_content = req.body.summernote;
    const post_topic = req.body.post_topic;

    //date
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const Atdate = `${day}/${month}/${year}`;

    const sql = `INSERT INTO nwvoc_post (post_by, post_topic, post_content, post_time) VALUES ('${user_postion}', '${post_topic}', '${post_content}', '${Atdate}')`;
    connection.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });

});



admins.post('/adduser', (req, res) => {
    
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;

        const postion = req.body.postion;
        const email = req.body.email;
        const Ranks = req.body.Ranks;

        //hash password;
        const password = req.body.email;
        const hash = bcrypt.hashSync(password, 10);
    
        const sql = `INSERT INTO nwvoc_user (user_firstname, user_lastname, user_email, user_pass, user_rank, user_postion) VALUES ('${firstname}', '${lastname}', '${email}', '${hash}', '${Ranks}', '${postion}')`;
        connection.query(sql, (err, results) => {
            if(err) throw err;
            res.redirect('/');
        });
    
    
});


function LoadData(req, res) {

    const id = req.cookies.user_id;

    const cookies = req.cookies;

    const sql = `SELECT * FROM nwvoc_user WHERE user_id = '${id}'`;
    
    connection.query(sql, (err, results) => {
        if(err) throw err;
        
        if(results.length > 0) {
            


        

            cookies.user_name = results[0].user_firstname + ' สถานะ ' + results[0].user_postion		

            const sql = `SELECT * FROM nwvoc_user ORDER BY user_id ASC`;
            connection.query(sql, (err, userall) => {
                if(err) throw err;

                if(userall.length > 0) {

                    res.cookie('user_postion', results[0].user_postion);

                    res.render('admin/index', 
                    {
                        user_name: cookies.user_name,
                        user_postion: results[0].user_postion,
                        data: userall
                    });
            }});

        }
        else
        {
            res.redirect('/login');
        }
    });
}


function LoadUserAllData() {

                //load nwvoc_user all ASC
    
    const sql = `SELECT * FROM nwvoc_user ORDER BY user_id ASC`;
    connection.query(sql, (err, results) => {
        if(err) throw err;


        if(results.length > 0) {

            var user_data = results;
            return user_data;
        }});

    return 1;
}


admins.get('/logout', (req, res) => {
    
    res.clearCookie('user_name');
    res.redirect('/');
});



exports.admins = admins;