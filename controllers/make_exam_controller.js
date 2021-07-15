var express = require('express')
  , router = express.Router()
  , Exam = require('../models/exam')
  , company = require('../models/students')
  , hr = require('../models/hr')

router.get('/new', isLoggedInAshr, function(req, res) {
	var default_exam = {
	  exam_name: "Exam Name",
	  exam_code: "Exam Code",
	  duration_hours:1,
	  duration_minutes:0,
	  company_code: "company Code",
	  hr_username:"hr User Name"
	};
	res.render('exams/new', { title: 'Make New Exam', exam: default_exam});
});


router.post('/create', isLoggedInAshr, function(req, res) {
	var exam = {
	  exam_name: req.body.exam_name,
	  exam_code: req.body.exam_code,
	  duration_hours: req.body.duration_hours,
	  duration_minutes: req.body.duration_minutes,
	  company_code: req.body.company_code,
	  hr_username: req.user.username,
	  cutoff_marks: req.body.cutoff_marks
	};
	var exam_code =  req.body.exam_code;
	var company_code =  req.body.company_code;
	var hr_username =  req.user.username;
	Exam.getByExamCode(exam_code, function(err,doc) 
	{
		if(err)
			res.send("Some error occured");
		else if(doc)
			{res.redirect('/make_exam/new');}
		else
		{
			hr.getBycompanyid(hr_username, company_code, function(err, doc) 
					{
						if(err)
							res.send("Some error occured");
						else if(doc)
						{
							Exam.create(exam, function(err, doc)
							{
								if(err)
									res.send("Some error occured");
								else if(doc)
									{res.render('exams/question_list', {exam:exam})};

							})	
						}	
						else	
						{res.redirect('/make_exam/new');}					
					})					
		}

	})
});

router.get('/question_list', isLoggedInAshr, function(req, res) {
    Exam.getByExamCode(req.body.exam_code, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        res.render('exams/question_list', {exam: docs});
    });
});

router.get('/add_question', isLoggedInAshr, function(req,res) {
	var exam_code = req.body.exam_code;
	var default_question_full = {
	  question: "Question",
	  optionA: "option A",
	  optionB: "option B",
	  optionC: "option C",
	  optionD: "option D",
	  key: "Key",
	  marks: "Marks"
	};
	res.render('exams/new_question', { title: 'Add New Question', question_full: default_question_full, 
	exam_code: exam_code});
});

router.post('/add_question', isLoggedInAshr, function(req,res) {
	var exam_code = req.body.exam_code;
	var default_question_full = {
	  question: "Question",
	  optionA: "option A",
	  optionB: "option B",
	  optionC: "option C",
	  optionD: "option D",
	  key: "Key",
	  marks: "Marks"
	};
	res.render('exams/new_question', { title: 'Add New Question', question_full: default_question_full, 
	exam_code: exam_code});
});




router.post('/create_question', isLoggedInAshr, function(req, res) {
   
    var question_full = {
	  question: req.body.question,
	  optionA: req.body.optionA,
	  optionB: req.body.optionB,
	  optionC: req.body.optionC,
	  optionD: req.body.optionD,
	  key: req.body.key,
	  marks: req.body.marks
	};
    
    var exam_code = req.body.exam_code;
    
    Exam.addQuestion(exam_code, question_full, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        {
        	Exam.getByExamCode(exam_code, function(err,docs){
        	if(err)
        	res.send("some error occured");
        	else
        	res.render('exams/question_list', {exam: docs});
    		});	}
    });
});


router.get('/submit', isLoggedInAshr, function(req, res) {
   res.send("exam successfully created"); 
});

router.get('/list', isLoggedInAshr, function(req, res) {
    Exam.getByExamCode(req.query.exam_code, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        res.json(docs);
    });
});

router.get('/results', isLoggedInAshr, function(req, res) {

    res.render('exams/results', {title: "Enter Exam Code"});
});

router.post('/results_view', isLoggedInAshr, function(req, res){

	var exam_code = req.body.exam_code;

	Exam.getResultsByExamCode(exam_code, function(err, docs)
	{
		if(err)
			res.send("Some error occured!");
		else
		{
			Exam.getByExamCode(exam_code, function(err, doc)
			{
				if(err)
					res.send("Some error occured!");
				else
				{
					var results_arr = [];

					docs.forEach(item => {
						if(item.result[0] >= doc.cutoff_marks)
							results_arr.push(item);
					});

					results_arr.sort((a, b) => {
						return parseInt(b.result[0]) - parseInt(a.result[0]);
					});

					res.render('exams/view_results', {docs : results_arr, exam_code : exam_code});
				}
			});
		}
	});
});


module.exports = router;

function isLoggedInAshr(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='hr')
        {return next();}

    // if they aren't redirect them to the home page
    res.redirect('/');
}
