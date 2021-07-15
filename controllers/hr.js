const express = require('express');
const router = express.Router();

const Hr = require('../models/hr');
const company = require('../models/company');

var default_hr = {
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

router.get('/home', isLoggedInAshr, function(req, res) {
	res.render('hr/home', { title: 'hr Home Page', hr: default_hr});
});

router.get('/new', isLoggedIn, (req, res) => {
	res.render('hr/new', { title: 'Add New hr', hr: default_hr});
});

router.post('/create', isLoggedIn, (req, res) => {
	var hr = {
	username: req.body.username,
	password: req.body.password,
	name: req.body.name
	};
	var username = req.body.username;

	Hr.getByUserName(username, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
		res.redirect('/hr/new');
		else{
		Hr.create(hr, function(err, doc) {
			if(err)
				res.send("Some error occured");
			else
				res.redirect('/hr/new');
		})	}
	})
});

router.get('/get_username_edit', isLoggedIn, function(req, res) {
	res.render('hr/get_username_edit', { title: "Get Username", username: default_username});
});

router.get('/edit', isLoggedIn, function(req,res) {
	//Failure renders edit if update is incorrect
	var username = req.query.username;
    Hr.getByUserName(username, function(err,doc) {
		if(err)
			res.send("Some error occured");
		else
		{
			if(doc)
			res.render('hr/edit', {title: 'Edit hr', hr: doc});
			else
			res.redirect('/hr/get_username_edit');
		}
	});
});

router.post('/update', isLoggedIn, function(req,res) {
	var hr = {
	  username: req.body.username,
	  password: req.body.password,
	  name: req.body.name
	};
	var prevusername = req.body.username;
	Hr.update(prevusername, hr, function(err, doc) {
			if(err)
				res.render('hr/edit', { title: 'Edit hr', hr: hr});
			else
				res.redirect('../');
		});
});

router.get('/get_username_delete', isLoggedIn, function(req, res) {
	res.render('hr/get_username_delete', { title: "Get Username", username: default_username});
});

router.post('/delete', isLoggedIn, function(req, res) {
	var username = req.body.username;

	Hr.getByUserName(username, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
	{
	Hr.remove(username, function(err, doc) {
		if(err)
			res.send("Some error occured");
		else
			res.redirect('../');
	})}
	else
		res.redirect('../hr/get_username_delete');	
	})
});

router.get('/assign_form', isLoggedIn, function(req, res) {
	res.render('hr/assign', { title: "Assign", username: default_username,
	companyid: default_companyid});
});

router.post('/assign', isLoggedIn, function(req, res) {
	var username = req.body.username;
	var company_code = req.body.companyid;

	Hr.getByUserName(username, function(err,doc) 
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
					Hr.getBycompanyid(username, company_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
							{res.redirect('/hr/assign_form');}
						else
						{
							Hr.assign(username, company_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									res.redirect('/hr/assign_form');

							})	
						}						
					})
				}
				else
					res.redirect('/hr/assign_form');
					
			})
		}
		else
			res.redirect('/hr/assign_form');
		
	})
});


router.get('/unassign_form', isLoggedIn, function(req, res) {
	res.render('hr/unassign', { title: "unassign", username: default_username,
	companyid: default_companyid});
});

router.post('/unassign', isLoggedIn, function(req, res) {
	var username = req.body.username;
	var company_code = req.body.companyid;

	Hr.getByUserName(username, function(err,doc) 
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
					Hr.getBycompanyid(username, company_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
						{
							Hr.unassign(username, company_code, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									res.redirect('/hr/unassign_form');
							})
						}
						else
						{
							res.redirect('/hr/unassign_form');
						}

					})
				}
				else
					res.redirect('/hr/unassign_form');		
			})
		}
		else
			res.redirect('/hr/unassign_form');
	})
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='admin')
        {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInAshr(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='hr')
        {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;


