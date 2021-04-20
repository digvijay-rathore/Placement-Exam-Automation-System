var express = require('express')
  , router = express.Router()
  , Exam = require('../models/exam')
  , Student = require('../models/students')

router.get('/', function(req, res) {

    res.render('exams/take_exam_code_entry', {title: "Enter Exam Code", username: req.user.username});

});

router.post('/exam', function(req, res) {
	var exam_code = req.body.exam_code;
	var username = req.body.username;
    console.log(exam_code);
    console.log(username);
    Exam.getByExamCode(exam_code, function(err,doc1) 
    {
        if(err)
            res.send("Some error occured");
        else if(doc1)
        {
            Student.getBycourseid(username, doc1.course_code, function(err,doc)
            {
                if(err)
                    res.send("Some error occured");
                else if(doc)
                {
                    Exam.checkResponse(username, exam_code, function(err, doc) 
                    {
                        if(err)
                            res.send("Some error occured");
                        else if(doc)
                            res.redirect('/take_exam');
                        else
                        {
                            res.render('exams/take_exam', { title: 'Take Exam', exam_code: exam_code, username: username}); 
                        }                       
                    })
                }
                else
                    res.redirect('/take_exam');
                    
            })
        }
        else
            res.redirect('/take_exam');

        
    })
});




module.exports = router;

