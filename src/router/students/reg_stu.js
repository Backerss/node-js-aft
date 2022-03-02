const express = require("express");

const fetchAPI = require("node-fetch");
const path = require("path");
const bcrypt = require("bcrypt");
const { connection } = require("../../sql/db");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sub = require("../../../data/subject.json");
const thai_amp = require("../../../data/thai_amphures.json");
const thai_pro = require("../../../data/thai_provinces.json");
const thai_tombons = require("../../../data/thai_tombons.json");

const reg_stu = express.Router();

//io
const io = require("socket.io")();


reg_stu.use(
  cookieParser({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

reg_stu.use(bodyParser.json());

const ifLoginNow = (req, res, next) => {
  //get cookie
  const cookies = req.cookies;
  if (cookies.user_name) {
    return res.redirect("/");
  } else next();
};



reg_stu.get("/", (req, res) => {


      res.render("students/reg_stu", {
        sub: sub,
        thai_amp: thai_amp.RECORDS,
        thai_pro: thai_pro.RECORDS,
        thai_tombons: thai_tombons.RECORDS,
      });
});



reg_stu.post("/check_idcard", (req, res) => {

    const idcard = req.body.id_card;

    connection.query('SELECT * FROM `nwvoc_stu` WHERE `stu_id_card` = ?', [idcard], (err, results) => {
        if (err) throw err;
  
        if (results.length > 0) {
            res.json({
                status: true,
            });
        } else {
            res.json({
                status: false,
            });
          
        }
    });
  

});


reg_stu.post("/submit_add", (req, res) => {

  const {grade_select, sub, id_card, prefix, firstname, lastname ,
    birtday, email, pro, amp, tombon, zip_code, old_school, old_pro,
    old_amp, old_tom, old_grade, pnumber} = req.body;

  connection.query('INSERT INTO `nwvoc_stu` (`stu_id_card`, `stu_prefix`, `stu_firstname`, `stu_lastname`, `stu_birtday`, `stu_pnumber`, `stu_email`, `stu_pro`, `stu_amp`, `stu_tombon`, `stu_zip_code`, `stu_old_school`, `stu_old_pro`, `stu_old_amp`, `stu_old_tom`, `stu_old_grade`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id_card, prefix, firstname, lastname, birtday, pnumber, email, pro, amp, tombon, zip_code, old_school, old_pro, old_amp,
    old_tom, old_grade], (err, results) => {
      if (err) throw err;

      res.json({
          status: "success",
      });
  });
    
});

exports.reg_stu = reg_stu;