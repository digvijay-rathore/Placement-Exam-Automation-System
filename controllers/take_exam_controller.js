var express = require('express')
  , router = express.Router()
  , Exam = require('../models/exam')
  , Student = require('../models/students')

router.get('/', isLoggedInAsStudent, function(req, res) {

    res.render('exams/take_exam_code_entry', {title: "Enter Exam Code", username: req.user.username});

});

router.post('/exam', isLoggedInAsStudent, function(req, res) {
	var exam_code = req.body.exam_code;
	var username = req.body.username;

    if(exam_code == '101')
    {
        Exam.getByExamCode(exam_code, function(err,doc1) 
        {
            if(err)
                res.send("Some error occured");
            else if(doc1)
            {
                Student.getBycompanyid(username, doc1.company_code, function(err,doc)
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
    }
    else if(exam_code == '102')
    {
        Exam.getResponseByExamCode('101', username, function(err, docs){
            if(err)
                res.send("Some error occured!");
            else if(!docs)
                res.render('exams/not_attempted', {exam_code : 101});
            else
            {
                var result = docs.result[0];

                Exam.getByExamCode('101', function(err, doc2){
                    if(err)
                        res.send("Some error occured!");
                    else if(result >= doc2.cutoff_marks)
                    {
                        Exam.getByExamCode(exam_code, function(err,doc1) 
                        {
                            if(err)
                                res.send("Some error occured");
                            else if(doc1)
                            {
                                Student.getBycompanyid(username, doc1.company_code, function(err,doc)
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
                        });
                    }
                    else
                        res.render('exams/disqualified');
                });
            }
        });
    }
    else if(exam_code == '103')
    {
        Exam.getResponseByExamCode('102', username, function(err, docs){
            if(err)
                res.send("Some error occured!");
            else if(!docs)
                res.render('exams/not_attempted', {exam_code : 102});
            else
            {
                var result = docs.result[0];

                Exam.getByExamCode('102', function(err, doc2){
                    if(err)
                        res.send("Some error occured!");
                    else if(result >= doc2.cutoff_marks)
                    {
                        Exam.getByExamCode(exam_code, function(err,doc1) 
                        {
                            if(err)
                                res.send("Some error occured");
                            else if(doc1)
                            {
                                Student.getBycompanyid(username, doc1.company_code, function(err,doc)
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
                        });
                    }
                    else
                        res.render('exams/disqualified');
                });
            }
        });
    }
    else if(exam_code == '104')
    {
        Exam.getResponseByExamCode('103', username, function(err, docs){
            if(err)
                res.send("Some error occured!");
            else if(!docs)
                res.render('exams/not_attempted', {exam_code : 103});
            else
            {
                var result = docs.result[0];

                Exam.getByExamCode('103', function(err, doc2){
                    if(err)
                        res.send("Some error occured!");
                    else if(result >= doc2.cutoff_marks)
                    {
                        Exam.getByExamCode(exam_code, function(err,doc1) 
                        {
                            if(err)
                                res.send("Some error occured");
                            else if(doc1)
                            {
                                Student.getBycompanyid(username, doc1.company_code, function(err,doc)
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
                        });
                    }
                    else
                        res.render('exams/disqualified');
                });
            }
        });
    }
    else if(exam_code == '105')
    {
        Exam.getResponseByExamCode('104', username, function(err, docs){
            if(err)
                res.send("Some error occured!");
            else if(!docs)
                res.render('exams/not_attempted', {exam_code : 104});
            else
            {
                var result = docs.result[0];

                Exam.getByExamCode('104', function(err, doc2){
                    if(err)
                        res.send("Some error occured!");
                    else if(result >= doc2.cutoff_marks)
                    {
                        Exam.getByExamCode(exam_code, function(err,doc1) 
                        {
                            if(err)
                                res.send("Some error occured");
                            else if(doc1)
                            {
                                Student.getBycompanyid(username, doc1.company_code, function(err,doc)
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
                        });
                    }
                    else
                        res.render('exams/disqualified');
                });
            }
        });
    }
});

router.get('/list', isLoggedInAsStudent, function(req, res) {

    Exam.getByExamCode(req.query.exam_code, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        res.json(docs);
    });
});


router.post('/submit', isLoggedInAsStudent, function(req, res) {
    
    var username=req.body.username;
    var exam_code=req.body.exam_code;

    var object=req.body
    var response = [];

    for(var key in object) {
    response.push(object[key]);
	}
	response.pop();
	response.pop();

    Exam.addResponses(username, exam_code, response, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        {
            Exam.getByExamCode(exam_code, function(err,docs){
                if(err)
                res.send("some error occured");
                else
                {
                    var exam_obj = docs.question_list;
        
                    Exam.getResponseByExamCode(exam_code, username, function(err, docs){
                        if(err)
                            res.send("some error occured");
                        else
                        {
                            var response_obj = docs.response;
                            var total_questions = 0;
                            var attempted = 0;
                            var correct = 0;
        
                            for(var temp in exam_obj) {
        
                                if(response_obj[total_questions] != ' ')
                                    attempted++;
                                if(exam_obj[total_questions].key == response_obj[total_questions])
                                    correct += parseInt(exam_obj[total_questions].marks);
                                total_questions++;
                            }

                            var marks = correct;
                            Exam.addMarks(username, exam_code, marks);
                        }
                    });
                }
            });
            
            res.render('exams/exam_submit', { title: 'Response Submitted Successfully', response: response, username: username, exam_code: exam_code});
        }
    });

});

router.get('/performance', isLoggedInAsStudent, function(req, res) {

    res.render('exams/view_performance_code_entry', {title: "Enter Exam Code", username: req.user.username});

});

router.post('/performance_view', isLoggedInAsStudent, function(req, res) {

    var username=req.body.username;
    var exam_code=req.body.exam_code;

    Exam.checkResponse(username, exam_code, function(err, doc) 
                    {
                        if(err)
                            res.send("Some error occured");
                        else if(doc)
                            {
                        

    Exam.getByExamCode(exam_code, function(err,docs){
        if(err)
        res.send("some error occured");
        else
        {
           var exam_obj = docs.question_list;

            Exam.getResponseByExamCode(exam_code, username, function(err, docs){
                if(err)
                    res.send("some error occured");
                else
                {
                    var response_obj = docs.response;
                    var total_questions = 0;
                    var attempted = 0;
                    var correct = 0;
                    var result = 0;

                    for(var temp in exam_obj) {

                        if(response_obj[total_questions] != ' ')
                            attempted++;
                        if(exam_obj[total_questions].key == response_obj[total_questions])
                        {
                            result += parseInt(exam_obj[total_questions].marks);
                            correct++;
                        }
                        total_questions++;
                    }

                    res.render('exams/performance',{title: 'Result', total_questions: total_questions, attempted: attempted, correct: correct, result: result});
                }
            });
        }
    })}
    else
    {
        res.render('exams/view_performance_code_entry', {title: "Enter Exam Code", username: req.user.username});
    }                       
    })
});


module.exports = router;


function isLoggedInAsStudent(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()&&req.user.usertype=='student')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}