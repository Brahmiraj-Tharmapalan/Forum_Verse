require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const user = require('./routes/user');
const post = require('./routes/post');
const comment = require('./routes/comment');
const cors = require('cors');



const mongoString = process.env.DATABASE_URL;

const app = express();

app.use(express.json());
app.use(cors());

 
app.use('/api',user);
app.use('/api',post);
app.use('/api',comment);


//connecting database
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on('error',(err) => console.log(err));

database.on('connected',() => console.log('Database connected'));


//listening on port
app.listen(5000, ()=>{
    console.log('listening on port 5000')
})