// const express = require('express');

const monk = require('monk');
const url = 'localhost:27017/placement';

db = monk(url);
hr_collection = db.get('hr');

module.exports = {
// MAKE VALIDATION FUNCTIONS HERE
// Create new student in the database
create: function(hr, cb) {
  hr_collection.insert(hr, cb);
},
getByUserName: function(username, cb) {
  hr_collection.findOne({username: username}, {}, cb);
},
findByUserName: function(username, cb) {
  hr_collection.findOne({username: username}, {}, cb);
},

// Update an existing hr by username
update: function(prevusername, hr, cb) {
  hr_collection.update({username: prevusername},
  { $set: {username: hr.username, password: hr.password,
  name: hr.name} },
  cb);
},

// Remove an existing hr by username
remove: function(username, cb) {
  hr_collection.remove({username: username}, cb);
},

assign: function(username, company_code, cb) {
  hr_collection.update(
     { username: username },
     { $addToSet: { company_list: { $each: [ company_code] } } }, cb);
  },
  
  unassign: function(username, company_code, cb) 
  {
  hr_collection.update(
    {username: username},
    { $pull: {  company_list: company_code } },cb);
  },
  
  getBycompanyid: function(username,company_code, cb) {
    hr_collection.findOne({username: username, company_list :company_code}, {}, cb);
  }
  
  

};

