
const express = require('express');
const app = express();

const path = require('path');
const { admins } = require('./src/router/admin/admin');
const { logins } = require('./src/router/system-login/login');

const cookieParser = require('cookie-parser');
const { connection } = require('./src/sql/db');
const { posts } = require('./src/router/post/post_id');

const http = require('http').createServer(app);
const port = process.env.PORT || 3000;

const io = require('socket.io')(http);

app.set('views', "./src/views");
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());




app.get('/', (req, res) => {


    //loop data in mysql ASC
    const sql = `SELECT * FROM nwvoc_post ORDER BY post_id ASC`;
    connection.query(sql, (err, results) => {
        if(err) throw err;
        
        //format data in mysql to display remove html tag
        for(let i = 0; i < results.length; i++) {
            results[i].post_content = results[i].post_content.replace(/<[^>]*>/g, '');
        }


        res.render('index', {
            data: results,
            cookies: req.cookies
        });
    });
});


app.get('/home', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.use('/login',logins);
app.use('/admin', admins);
app.use('/post', posts);




//zone admin









http.listen(port, () => {
    console.log('http://localhost:' + port);
});