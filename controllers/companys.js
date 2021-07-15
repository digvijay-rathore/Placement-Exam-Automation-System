var express = require('express');
const router = express.Router();
const Company = require('../models/company');

var default_companyid = "companyID";

var default_company = {
	  companyid: "companyID",
	  companyname: "companyname"
	};
	
router.get('/new', isLoggedIn, function(req, res) {
	res.render('companys/new', { title: 'Add New company', company: default_company});
});

router.post('/create', isLoggedIn, function(req, res) {
	var company = {
	  companyid: req.body.companyid,
	  companyname: req.body.companyname
	};
	var companyid = req.body.companyid;

	Company.getBycompanyid(companyid, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
		res.redirect('/companys/new');
		else{
		Company.create(company, function(err, doc) {
			if(err)
				res.send("Some error occured");
			else
				res.redirect('/companys/new');
		})	}
	})
});

router.get('/get_companyid_edit', isLoggedIn, function(req, res) {
	res.render('companys/get_companyid_edit', { title: "Get company ID", companyid: default_companyid});
});

router.get('/edit', isLoggedIn, function(req,res) {
	var companyid = req.query.companyid;
    Company.getBycompanyid(companyid, function(err,doc) {
		if(err)
			res.send("Some error occured");
		else
		{
			if(doc)
			res.render('companys/edit', {title: 'Edit company', company: doc});
			else
			res.render('companys/get_companyid_edit', { title: "Get company ID", companyid: default_companyid});
		}
	});
});

router.post('/update', isLoggedIn, function(req, res) {
	var company = {
	  companyid: req.body.companyid,
	  companyname: req.body.companyname
	};
	var prevcompanyid = req.body.companyid;
	Company.update(prevcompanyid, company, function(err, doc) {
			if(err)
				res.render('companys/edit', { title: 'Edit company', company: doc});
			else
				res.redirect('/admin/home');
		});
});

router.get('/get_companyid_delete', isLoggedIn, function(req, res) {
	var default_companyid = "User Name";
	res.render('companys/get_companyid_delete', { title: "Get company ID", companyid: default_companyid});
});


router.post('/delete', isLoggedIn, function(req, res) {
	var companyid = req.body.companyid;
	Company.getBycompanyid(companyid, function(err,doc) {
	if(err)
		res.send("Some error occured");
	else if(doc)
	{
	Company.remove(companyid, function(err, doc) {
		if(err)
			res.send("Some error occured");
		else
			res.redirect('/admin/home');
	})}
	else
		res.render('companys/get_companyid_delete', { title: "Get company ID", companyid: default_companyid});	
	})
});

module.exports = router;

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='admin')
        {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}