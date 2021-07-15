const express = require('express');
const router = express.Router();

const Student = require('../models/students');
const company = require('../models/company');

var default_student = {
    username: "Your LDAP ID",
    password: "Password",
    name: "Name",
    rollno: "Roll Number"
};

var default_username = "User Name";

var default_companyid = "company Code";

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/home', isLoggedInAsStudent, function(req, res) {
	res.render('students/home', { title: 'Student Home Page', student: default_student});
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('students/new', { title: 'Add New Student', student: default_student});
});

router.post('/create', isLoggedIn, (req, res) => {
	var student = {
	username: req.body.username,
	password: req.body.password,
	name: req.body.name,
	rollno: req.body.rollno
	};
	var username = req.body.username;

	Student.getByUserName(username, (err,doc) => {
	if(err)
		res.send("Some error occured");
	else if(doc)
		res.redirect('/students/new');
		else{
		Student.create(student, (err, doc) => {
			if(err)
				res.send("Some error occured");
			else
				res.redirect('/students/new');
		})	}
	})
});

router.get('/get_username_edit', isLoggedIn, function(req, res) {
	res.render('students/get_username_edit', { title: "Get Username", username: default_username});
});

router.get('/edit', isLoggedIn, function(req,res) {
	var username = req.query.username;
    Student.getByUserName(username, function(err,doc) {
		if(err)
			res.send("Some error occured");
		else
		{
			if(doc)
			res.render('students/edit', {title: 'Edit Student', student: doc});
			else
			res.redirect('/students/get_username_edit');
		}
	});
});

router.post('/update', isLoggedIn, function(req, res) {
	var student = {
	username: req.body.username,
	password: req.body.password,
	name: req.body.name,
	rollno: req.body.rollno
	};
	var prevusername = req.body.username;

	Student.update(prevusername, student, function(err, doc) {
			if(err)
				res.render('students/edit', { title: 'Edit Student', student: student});
			else
				res.redirect('/students/get_username_edit');
	});
});

router.get('/get_username_delete', isLoggedIn, function(req, res) {
	res.render('students/get_username_delete', { title: "Get Username", username: default_username});
});

router.post('/delete', isLoggedIn, function(req, res) {
	var username = req.body.username;

	Student.getByUserName(username, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
	{
	Student.remove(username, function(err, doc) {
		if(err)
			res.send("Some error occured");
		else
			res.redirect('/students/get_username_delete');
	})}
	else
		res.redirect('/students/get_username_delete');	
	})
});

router.get('/register_form', isLoggedIn, function(req, res) {
	res.render('students/register', { title: "Register", username: default_username,
	companyid: default_companyid});
});


router.post('/register', isLoggedIn, function(req, res) {
	var username = req.body.username;
	var company_code = req.body.companyid;

	Student.getByUserName(username, function(err,doc) 
	{
		if(err)
			res.send("Some error occured");
		else if(doc)
		{
			company.getBycompanyid(company_code, function(err,doc)
			{
				if(err)
					res.send("Some error occured");
				else if(doc)
				{
					Student.getBycompanyid(username, company_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
							{res.redirect('/students/register_form');}
						else
						{
							Student.register(username, company_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									res.redirect('/students/register_form');

							})	
						}						
					})
				}
				else
					res.redirect('/students/register_form');
					
			})
		}
		else
			res.redirect('/students/register_form');
		
	})
});

router.get('/deregister_form', isLoggedIn, function(req, res) {
	res.render('students/deregister', { title: "Deregister", username: default_username,
	companyid: default_companyid});
});

router.post('/deregister', isLoggedIn, function(req, res) {
	// TO DO: Ensure that the student and company exists
	// TO DO: Add failure cases
	var username = req.body.username;
	var company_code = req.body.companyid;

	Student.getByUserName(username, function(err,doc) 
	{
		if(err)
			res.send("Some error occured");
		else if(doc)
		{
			company.getBycompanyid(company_code, function(err,doc)
			{
				if(err)
					res.send("Some error occured");
				else if(doc)
				{
					Student.getBycompanyid(username, company_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
						{
							Student.deregister(username, company_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									res.redirect('/students/deregister_form');
							})
						}
						else
						{
							res.redirect('/students/register_form');
						}

					})
				}
				else
					res.redirect('/students/register_form');		
			})
		}
		else
			res.redirect('/students/register_form');
	})
});

module.exports = router;

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='admin')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInAsStudent(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='student')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}