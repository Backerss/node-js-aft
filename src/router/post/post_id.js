

const express = require('express');

const path = require('path');
const bcrypt = require('bcrypt');
const { connection } = require('../../sql/db');
const cookieParser = require('cookie-parser');

const posts = express.Router();




posts.use(cookieParser({
    name : 'session',
    keys : ['key1', 'key2'],
    maxAge : 24 * 60 * 60 * 1000 // 24 hours
}));


posts.get('/', (req, res) => {
    res.redirect('/');
});


posts.get('/id', (req, res) => {

    const id = req.query.id;

    const sql = `SELECT * FROM nwvoc_post WHERE post_id = ${id}`;
    connection.query(sql, (err, results) => {
        if(err) throw err;

        if(results.length === 0) {
            res.redirect('/');
        } else {


            res.render('page/post', {
                data : results[0]
            });
        }
    });
});



exports.posts = posts;