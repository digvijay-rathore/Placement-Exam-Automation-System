const express = require('express');
const path = require('path');
const jade = require('jade');
const bodyParser = require('body-parser');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));

var index = require('./controllers/index');
var students = require('./controllers/student');
var faculty = require('./controllers/faculties');
var courses = require('./controllers/courses');
var admin = require('./controllers/admin');

app.use('/', index);
app.use('/students', students);
app.use('/faculties', faculty);
app.use('/courses', courses);
app.use('/admin', admin);




app.listen(3000, () => {
    console.log('Server running on port 3000!');
});