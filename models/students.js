const monk = require('monk');

const url = 'localhost:27017/placement'; 
db = monk(url);

students_collection = db.get('students');

module.exports = {
    create: function(student, cb) {
        students_collection.insert(student, cb);
    },

    getByUserName: function(username, cb) {
        students_collection.findOne({username: username}, {}, cb);
    },

    update: function(prevusername, student, cb) {
        students_collection.update({username: prevusername},
        { $set: {username: student.username, password: student.password,
        name: student.name, rollno: student.rollno} },
        cb);
    },

    remove: function(username, cb) {
        students_collection.remove({username: username}, cb);
    },

    register: function(username, company_code, cb) {
        students_collection.update(
           { username: username },
           { $addToSet: { company_list: { $each: [ company_code] } } }, cb);
    },
    
    deregister: function(username, company_code, cb) 
    {
    students_collection.update(
        {username: username},
        { $pull: {  company_list: company_code } },cb);
    },
    
    getBycompanyid: function(username,company_code, cb) {
        students_collection.findOne({username: username, company_list :company_code}, {}, cb);
    }
        
        
};