const express = require('express');
const path = require('path');
const jade = require('jade');
const bodyParser = require('body-parser');
var students = require('./controllers/student');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));

app.use('/students', students);

app.get('', (req, res) => {
    res.render('admin/home', { title: 'Options'});
});



app.listen(3000, () => {
    console.log('Server running on port 3000!');
});