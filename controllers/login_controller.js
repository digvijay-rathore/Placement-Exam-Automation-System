var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res) {
    var usertype = req.query.usertype;
    if(usertype == 'admin')
        res.render('login', {title: "Admin Login", method: "authenticate_admin"});
    if(usertype == 'student')
        res.render('login', {title: "Student Login", method: "authenticate_student"});
    if(usertype == 'hr')
        res.render('login', {title: "hr Login", method: "authenticate_hr"});
});

router.post('/authenticate_admin', passport.authenticate('local-login-admin', {
        successRedirect : '../admin/home', 
        failureRedirect : '/',
        failureFlash : true 
}));

router.post('/authenticate_student', passport.authenticate('local-login-student', {
        successRedirect : '../students/home',
        failureRedirect : '/', 
        failureFlash : true 
}));

router.post('/authenticate_hr', passport.authenticate('local-login-hr', {
        successRedirect : '../hr/home', 
        failureRedirect : '/', 
        failureFlash : true 
}));


module.exports = router;