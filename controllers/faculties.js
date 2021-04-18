const express = require('express');
const router = express.Router();

const Faculty = require('../models/faculty');
const Course = require('../models/course');

var default_faculty = {
	  username: "Your LDAP ID",
	  password: "Password",
	  name: "Name"
	};
	
var default_username = "User Name";

var default_courseid = "Course Code";



router.get('/new', (req, res) => {
	res.render('faculties/new', { title: 'Add New faculty', faculty: default_faculty});
});

router.post('/create', (req, res) => {
	var faculty = {
	username: req.body.username,
	password: req.body.password,
	name: req.body.name
	};
	var username = req.body.username;

	Faculty.getByUserName(username, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
		res.redirect('/faculties/new');
		else{
		Faculty.create(faculty, function(err, doc) {
			if(err)
				res.send("Some error occured");
			else
				res.redirect('/faculties/new');
		})	}
	})
});

router.get('/get_username_edit', function(req, res) {
	res.render('faculties/get_username_edit', { title: "Get Username", username: default_username});
});

router.get('/edit', function(req,res) {
	//Failure renders edit if update is incorrect
	var username = req.query.username;
    Faculty.getByUserName(username, function(err,doc) {
		if(err)
			res.send("Some error occured");
		else
		{
			if(doc)
			res.render('faculties/edit', {title: 'Edit faculty', faculty: doc});
			else
			res.redirect('/faculties/get_username_edit');
		}
	});
});

router.post('/update', function(req,res) {
	var faculty = {
	  username: req.body.username,
	  password: req.body.password,
	  name: req.body.name
	};
	var prevusername = req.body.username;
	Faculty.update(prevusername, faculty, function(err, doc) {
			if(err)
				res.render('faculties/edit', { title: 'Edit faculties', faculty: faculty});
			else
				res.redirect('../');
		});
});

router.get('/get_username_delete', function(req, res) {
	res.render('faculties/get_username_delete', { title: "Get Username", username: default_username});
});

router.post('/delete', function(req, res) {
	var username = req.body.username;

	Faculty.getByUserName(username, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
	{
	Faculty.remove(username, function(err, doc) {
		if(err)
			res.send("Some error occured");
		else
			res.redirect('../');
	})}
	else
		res.redirect('../faculties/get_username_delete');	
	})
});

router.get('/assign_form', function(req, res) {
	res.render('faculties/assign', { title: "Assign", username: default_username,
	courseid: default_courseid});
});

router.post('/assign', function(req, res) {
	var username = req.body.username;
	var course_code = req.body.courseid;

	Faculty.getByUserName(username, function(err,doc) 
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
					Faculty.getBycourseid(username, course_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
							{res.redirect('/faculties/assign_form');}
						else
						{
							Faculty.assign(username, course_code, function(err, doc)
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
					res.redirect('/faculties/assign_form');
					
			})
		}
		else
			res.redirect('/faculties/assign_form');
		
	})
});


router.get('/unassign_form', function(req, res) {
	res.render('faculties/unassign', { title: "unassign", username: default_username,
	courseid: default_courseid});
});

router.post('/unassign', function(req, res) {
	var username = req.body.username;
	var course_code = req.body.courseid;

	Faculty.getByUserName(username, function(err,doc) 
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
					Faculty.getBycourseid(username, course_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
						{
							Faculty.unassign(username, course_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									res.redirect('/');
							})
						}
						else
						{
							res.redirect('/faculties/unassign_form');
						}

					})
				}
				else
					res.redirect('/faculties/unassign_form');		
			})
		}
		else
			res.redirect('/faculties/unassign_form');
	})
});

module.exports = router;


