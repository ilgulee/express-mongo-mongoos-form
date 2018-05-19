const express = require('express');
const path=require('path');
const bodyParser=require('body-parser');

//port
const port=3000;
//Init app
const app=express();

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//static folder
app.use(express.static(path.join(__dirname,'public')));

//ejs view setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get('/',(req, res)=>{
    res.render('index');
});

app.listen(port,()=>{
    console.log(`Server running on port `+port);
})
