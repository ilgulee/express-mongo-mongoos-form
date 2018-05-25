const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
//port
const port = 3000;
//Init app
const app = express();

mongoose.connect('mongodb://localhost:27017/todoapp')
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

require('./models/Todo');
const Todo = mongoose.model('todos');

// MongoClient 
//const MongoClient = require('mongodb').MongoClient;
//const ObjectID = require('mongodb').ObjectID;
//const url = 'mongodb://localhost:27017/todoapp';

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(methodOverride('_method'));

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//ejs view setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//connect to mongodb
// MongoClient.connect(url, (err, database) => {
//     console.log('MongoDB connected...');
//     if (err) throw err;

//     let db = database;
//     Todos = db.collection('todos');
//     app.listen(port, () => {
//         console.log(`Server running on port ` + port);
//     });
// });

app.get('/todo/all', (req, res, next) => {


    // Todo.find({}).toArray((err, todos) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log(todos);
    //     console.log('open index at get request');
    //     // res.render('index', {
    //     //     todos: todos
    //     // });
    //      res.json(todos);
    // });

});

app.get('/', (req, res, next) => {
    Todo.find({})
        .sort({
            date: 'desc'
        })
        .then(todos => {
            res.render('index', {
                todos: todos
            });
        });
});


app.post('/todo/add', (req, res, next) => {
    let errors = [];
    if (!req.body.text) {
        errors.push({
            errorMessage: 'Please add a name'
        });
    }
    if (!req.body.body) {
        errors.push({
            errorMessage: 'Please add a body'
        });
    }
    if (errors.length > 0) {
        Todo.find({})
            .sort({
                date: 'desc'
            })
            .then(todos => {
                res.render('index', {
                    todos: todos,
                    errors: errors,
                    text: req.body.text,
                    body: req.body.body
                });
            });
    } else {
        //res.send('passed');
        const newTodo = {
            text: req.body.text,
            body: req.body.body
        };
        new Todo(newTodo)
            .save()
            .then(todo => {
                console.log(todo);
                res.redirect('/');
            })
    }
    //console.log(req.body);
    //res.send('ok');
    // const todo = {
    //     text: req.body.text,
    //     body: req.body.body
    // }
    // Todos.insert(todo, (err, result) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log('Todo Added at post router');
    //     res.redirect('/');
    //     // res.json(todo);
    // });
});

app.delete('/delete/:id', (req, res, next) => {
    Todo.remove({
        _id: req.params.id
    }).then(() => {
        res.redirect('/');
    });
    // const query = {
    //     _id: ObjectID(req.params.id)
    // }
    // Todos.deleteOne(query, (err, response) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log('Todo Removed');
    //     res.sendStatus(200);
    // });
});

app.get('/edit/:id', (req, res, next) => {
    const query = {
        _id: req.params.id
    };
    Todo.findOne(query)
        .then((todo) => {
            res.render('edit', {
                todo: todo
            });
        });
    // const query = {
    //     _id: ObjectID(req.params.id)
    // }
    // Todos.find(query).next((err, todo) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     res.render('edit', {
    //         todo: todo
    //     });
    // });
});

app.put('/edit/:id', (req, res, next) => {
    Todo.findOne({
            _id: req.params.id
        })
        .then(todo => {
            todo.text = req.body.text;
            todo.body = req.body.body;
            todo.save()
                .then(todo => {
                    res.redirect('/');
                })
        });

    // const query = {
    //     _id: ObjectID(req.params.id)
    // }
    // const todo = {
    //     text: req.body.text,
    //     body: req.body.body
    // }
    // Todos.updateOne(query, {
    //     $set: todo
    // }, (err, result) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log('Todo Upated...');
    //     res.redirect('/');
    // });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});