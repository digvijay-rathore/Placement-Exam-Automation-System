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

    register: function(username, course_code, cb) {
        students_collection.update(
           { username: username },
           { $addToSet: { course_list: { $each: [ course_code] } } }, cb);
        },
        
        deregister: function(username, course_code, cb) 
        {
        students_collection.update(
            {username: username},
            { $pull: {  course_list: course_code } },cb);
        },
        
        getBycourseid: function(username,course_code, cb) {
          students_collection.findOne({username: username, course_list :course_code}, {}, cb);
        }
        
        
};