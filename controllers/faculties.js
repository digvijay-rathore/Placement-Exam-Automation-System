const express = require('express');
const router = express.Router();

const Faculty = require('../models/faculty');
const company = require('../models/company');

var default_faculty = {
	  username: "Your LDAP ID",
	  password: "Password",
	  name: "Name"
	};
	
var default_username = "User Name";

var default_companyid = "company Code";

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/home', isLoggedInAsFaculty, function(req, res) {
	res.render('faculties/home', { title: 'Faculty Home Page', faculty: default_faculty});
});

router.get('/new', isLoggedIn, (req, res) => {
	res.render('faculties/new', { title: 'Add New faculty', faculty: default_faculty});
});

router.post('/create', isLoggedIn, (req, res) => {
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

router.get('/get_username_edit', isLoggedIn, function(req, res) {
	res.render('faculties/get_username_edit', { title: "Get Username", username: default_username});
});

router.get('/edit', isLoggedIn, function(req,res) {
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

router.post('/update', isLoggedIn, function(req,res) {
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

router.get('/get_username_delete', isLoggedIn, function(req, res) {
	res.render('faculties/get_username_delete', { title: "Get Username", username: default_username});
});

router.post('/delete', isLoggedIn, function(req, res) {
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

router.get('/assign_form', isLoggedIn, function(req, res) {
	res.render('faculties/assign', { title: "Assign", username: default_username,
	companyid: default_companyid});
});

router.post('/assign', isLoggedIn, function(req, res) {
	var username = req.body.username;
	var company_code = req.body.companyid;

	Faculty.getByUserName(username, function(err,doc) 
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
					Faculty.getBycompanyid(username, company_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
							{res.redirect('/faculties/assign_form');}
						else
						{
							Faculty.assign(username, company_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									res.redirect('/faculties/assign_form');

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


router.get('/unassign_form', isLoggedIn, function(req, res) {
	res.render('faculties/unassign', { title: "unassign", username: default_username,
	companyid: default_companyid});
});

router.post('/unassign', isLoggedIn, function(req, res) {
	var username = req.body.username;
	var company_code = req.body.companyid;

	Faculty.getByUserName(username, function(err,doc) 
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
					Faculty.getBycompanyid(username, company_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
						{
							Faculty.unassign(username, company_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									res.redirect('/faculties/unassign_form');
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

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='admin')
        {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInAsFaculty(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='faculty')
        {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;


