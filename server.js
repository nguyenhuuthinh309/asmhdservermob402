const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { engine } = require('express-handlebars');

const userModel = require('./routes/User');

const templatePath = path.join(__dirname,'../views');
const  bodyParser = require('body-parser')
const alert = require('alert'); 




const url = "mongodb+srv://thinh309:thinh3092003@cluster0.adfcye6.mongodb.net/asm?retryWrites=true&w=majority";

const app = express();

app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(bodyParser.json());
app.engine('handlebars', engine({
    helpers: {
        sum: (a, b) =>a+b,

    },
}));


app.set('view engine', 'handlebars');



app.set('views',templatePath);
app.use(express.json());

mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
    console.log("kết nối thành công");
})


app.use('/',userModel);

app.listen(8000,()=>{
    console.log("đang chạy server");
})