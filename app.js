const express = require('express');
const path = require('path');
const jade = require('jade');
const bodyParser = require('body-parser');
const passport = require('passport');

const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));

require('./config/passport')(passport);

app.use(cookieParser());
app.use(session({secret: 'my_app_secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var index = require('./controllers/index');
var students = require('./controllers/student');
var faculty = require('./controllers/faculties');
var courses = require('./controllers/courses');
var admin = require('./controllers/admin');
var login = require('./controllers/login_controller');

app.use('/', index);
app.use('/students', students);
app.use('/faculties', faculty);
app.use('/courses', courses);
app.use('/admin', admin);
app.use('/login', login);


app.listen(3000, () => {
    console.log('Server running on port 3000!');
});