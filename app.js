const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//port
const port = 3000;
//Init app
const app = express();

// MongoClient 
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/todoapp';

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//static folder
app.use(express.static(path.join(__dirname, 'public')));

//ejs view setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//connect to mongodb
MongoClient.connect(url, (err,database) => {
    console.log('MongoDB connected...');
    if(err) throw err;

    let db=database;
    Todos=db.collection('todos');
    app.listen(port, () => {
        console.log(`Server running on port ` + port);
    });
});

app.get('/', (req, res, next) => {
    Todos.find({}).toArray((err,todos)=>{
        if(err){
            return console.log(err);
        }
       // console.log(todos);
        res.render('index',{todos:todos});
    });
   
});

