const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const TodoSchema=new Schema({
    text:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

mongoose.model('todos',TodoSchema);