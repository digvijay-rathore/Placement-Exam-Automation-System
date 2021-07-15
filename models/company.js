var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/placement');
var company_collection = db.get('companys');

module.exports = {
// MAKE VALIDATION FUNCTIONS HERE
// Create new company in the database
create: function(company, cb) {
  company_collection.insert(company, cb);
},

// Retrieve company using companyid
getBycompanyid: function(companyid, cb) {
  company_collection.findOne({companyid: companyid}, {}, cb);
},

// Update an existing company by companyid
update: function(prevcompanyid, company, cb) {
  company_collection.update({companyid: prevcompanyid},
  { $set: {companyid: company.companyid, companyname: company.companyname} },
  cb);
},

// Remove an existing company by companyid
remove: function(companyid, cb) {
  console.log(companyid);
  company_collection.remove({companyid: companyid}, cb);
}

};







