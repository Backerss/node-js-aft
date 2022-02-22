


const express = require('express');

const path = require('path');
const bcrypt = require('bcrypt');
const { connection } = require('../../sql/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const admins = express.Router();
admins.use(bodyParser.json());
admins.use(cookieParser());



const http = require('http').createServer(admins);
const io = require('socket.io')(http);





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

admins.get('/getuser', (req, res) => {
    
    //count tabale nwvoc_user
    const sql = `SELECT COUNT(*) AS count FROM nwvoc_user`;
    connection.query(sql, (err, results) => {
        if(err) throw err;
    
       res.json({
              count: results[0].count
       });

    
    });
    
});

admins.get('/getpost', (req, res) => {
    
    //count tabale nwvoc_user
    const sql = `SELECT COUNT(*) AS count FROM nwvoc_post`;
    connection.query(sql, (err, results) => {
        if(err) throw err;
    
       res.json({
              count: results[0].count
       });

    
    });
    
});

admins.get('/getranks', (req, res) => {
    
    connection.query('SELECT * FROM `nwvoc_ranks` ORDER BY `nwvoc_ranks`.`ranks_id` ASC', (err, results) => {
        if(err) throw err;

            res.json({
                data: results,
                count: results.length
            });


    });
    
});


admins.get('/getranks/(:rank_id)', (req, res) => {

    connection.query('SELECT * FROM `nwvoc_ranks` WHERE `nwvoc_ranks`.`ranks_id` = ?',[req.params.rank_id], (err, results) => {
        if(err) throw err;

            res.json({
                data: results[0],
            });
    });
});


admins.get('/delrank', (req, res) => {
    

    //get url param
    const rank_id = req.query.del_id; 

    connection.query('DELETE FROM `nwvoc_ranks` WHERE `ranks_id` = ?',[rank_id], (err, results) => {
        if(err) throw err;

        res.redirect('/admin');
    });

});


admins.post('/add-rank', (req, res) => {

    
    connection.query('INSERT INTO `nwvoc_ranks`(`ranks_name`) VALUES (?)', [req.body.ranks_name], (err, results) => {
        if(err) throw err;

        console.log('add rank success');
    });
});


admins.post('/edit-rank', (req, res) => {    
    
    
    connection.query('UPDATE `nwvoc_ranks` SET `ranks_name` = ? WHERE `ranks_id` = ?',[req.body.ranks_name, req.body.ranks_id], (err, results) => {
        if(err) throw err;
    });
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



admins.post('/check-user', (req, res) => {

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const postion = req.body.postion;
    
    connection.query('SELECT * FROM `nwvoc_user` WHERE `user_firstname` = ? AND `user_lastname` = ?', [firstname, lastname], (err, results) => {
        if(err) throw err;

        if(results.length > 0)
        {
            res.json({
                status: 'firstname:lastname is exist'
            });
        }
        else
        {
           connection.query('SELECT * FROM `nwvoc_user` WHERE `user_email` = ?', [email], (err, results) => {
                if(err) throw err;

                if(results.length > 0)
                {
                    res.json({
                        status: 'email is exist'
                    });
                }
                else
                {
                    const password = req.body.email;
                    const hash = bcrypt.hashSync(password, 10);

                    connection.query('INSERT INTO nwvoc_user (user_firstname, user_lastname, user_email, user_pass, user_rank, user_postion) VALUES (?,?,?,?,?,?)', [firstname, lastname, email, hash, "User", postion], (err, results) => {
                        if(err) throw err;
                        res.json({
                            status: 'success'
                        });
                    });
                }
           });
        }
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