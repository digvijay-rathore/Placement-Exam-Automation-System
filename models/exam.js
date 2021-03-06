var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/placement');
var exam_collection = db.get('exams');
var student_collection = db.get('students');
var response_collection = db.get('responses');


module.exports = {
// MAKE VALIDATION FUNCTIONS HERE
// Create new student in the database
create: function(exam, cb) {
  exam_collection.insert(exam, cb);
},

getByExamCode: function(exam_code, cb) {
  exam_collection.findOne({exam_code: exam_code}, cb);
},

getResponseByExamCode: function(exam_code, username, cb) {
  response_collection.findOne({exam_code: exam_code, username: username}, cb);
},

getResultsByExamCode: function(exam_code, cb) {
  response_collection.find({exam_code: exam_code}, cb);
},

addQuestion: function(exam_code, question_full, cb) {
exam_collection.update(
   { exam_code: exam_code },
   { $push: { question_list: { $each: [ 
     {question: question_full.question,
     optionA: question_full.optionA,
     optionB: question_full.optionB,
     optionC: question_full.optionC,
     optionD: question_full.optionD,
     key: question_full.key,
     marks: question_full.marks
    } ] } } }, cb);
},

// Submit Responses
addResponses: function(username, exam_code, response, cb) {

  var temp_response = 
  {
      username: username,
      exam_code: exam_code,
      response: response
  };
  response_collection.insert(temp_response, cb);
},

addMarks: function(username, exam_code, marks){

  response_collection.update(
    { username: username,
      exam_code: exam_code
    },
    { $push: {result: marks}});
},

checkResponse: function(username, exam_code, cb) {
  response_collection.findOne({username:username, exam_code: exam_code}, cb);
}

};