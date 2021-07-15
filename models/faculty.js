// const express = require('express');

const monk = require('monk');
const url = 'localhost:27017/placement';

db = monk(url);
faculty_collection = db.get('faculties');

module.exports = {
// MAKE VALIDATION FUNCTIONS HERE
// Create new student in the database
create: function(faculty, cb) {
  faculty_collection.insert(faculty, cb);
},
getByUserName: function(username, cb) {
  faculty_collection.findOne({username: username}, {}, cb);
},
findByUserName: function(username, cb) {
  faculty_collection.findOne({username: username}, {}, cb);
},

// Update an existing faculty by username
update: function(prevusername, faculty, cb) {
  faculty_collection.update({username: prevusername},
  { $set: {username: faculty.username, password: faculty.password,
  name: faculty.name} },
  cb);
},

// Remove an existing faculty by username
remove: function(username, cb) {
  faculty_collection.remove({username: username}, cb);
},

assign: function(username, company_code, cb) {
  faculty_collection.update(
     { username: username },
     { $addToSet: { company_list: { $each: [ company_code] } } }, cb);
  },
  
  unassign: function(username, company_code, cb) 
  {
  faculty_collection.update(
    {username: username},
    { $pull: {  company_list: company_code } },cb);
  },
  
  getBycompanyid: function(username,company_code, cb) {
    faculty_collection.findOne({username: username, company_list :company_code}, {}, cb);
  }
  
  

};

