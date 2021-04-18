const express = require('express');
const router = express.Router();

const Student = require('../models/students');
const Course = require('../models/course');

var default_student = {
    username: "Your LDAP ID",
    password: "Password",
    name: "Name",
    rollno: "Roll Number"
};

var default_username = "User Name";

var default_courseid = "Course Code";

router.get('/home', function(req, res) {
	res.render('students/home', { title: 'Student Home Page', student: default_student});
});

router.get('/new', (req, res) => {
    res.render('students/new', { title: 'Add New Student', student: default_student});
});

router.post('/create', (req, res) => {
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

router.get('/get_username_edit', function(req, res) {
	res.render('students/get_username_edit', { title: "Get Username", username: default_username});
});

router.get('/edit', function(req,res) {
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

router.post('/update', function(req, res) {
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

router.get('/get_username_delete', function(req, res) {
	res.render('students/get_username_delete', { title: "Get Username", username: default_username});
});

router.post('/delete', function(req, res) {
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

router.get('/register_form', function(req, res) {
	res.render('students/register', { title: "Register", username: default_username,
	courseid: default_courseid});
});


router.post('/register', function(req, res) {
	var username = req.body.username;
	var course_code = req.body.courseid;

	Student.getByUserName(username, function(err,doc) 
	{
		if(err)
			res.send("Some error occured");
		else if(doc)
		{
			Course.getBycourseid(course_code, function(err,doc)
			{
				if(err)
					res.send("Some error occured");
				else if(doc)
				{
					Student.getBycourseid(username, course_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
							{res.redirect('/students/register_form');}
						else
						{
							Student.register(username, course_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									res.redirect('/');

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

router.get('/deregister_form', function(req, res) {
	res.render('students/deregister', { title: "Deregister", username: default_username,
	courseid: default_courseid});
});

router.post('/deregister', function(req, res) {
	// TO DO: Ensure that the student and course exists
	// TO DO: Add failure cases
	var username = req.body.username;
	var course_code = req.body.courseid;

	Student.getByUserName(username, function(err,doc) 
	{
		if(err)
			res.send("Some error occured");
		else if(doc)
		{
			Course.getBycourseid(course_code, function(err,doc)
			{
				if(err)
					res.send("Some error occured");
				else if(doc)
				{
					Student.getBycourseid(username, course_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
						{
							Student.deregister(username, course_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									res.redirect('/');
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
