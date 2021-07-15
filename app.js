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
var companys = require('./controllers/companys');
var admin = require('./controllers/admin');
var make_exam = require('./controllers/make_exam_controller');
var take_exam = require('./controllers/take_exam_controller');
var login = require('./controllers/login_controller');

app.use('/', index);
app.use('/students', students);
app.use('/faculties', faculty);
app.use('/companys', companys);
app.use('/admin', admin);
app.use('/make_exam', make_exam);
app.use('/take_exam', take_exam);
app.use('/login', login);


app.listen(3000, () => {
    console.log('Server running on port 3000!');
});