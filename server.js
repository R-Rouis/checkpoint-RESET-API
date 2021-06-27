const express = require ('express');
const mongoose = require ('mongoose');
const bodyParser = require ('body-parser');
const User = require('./modals/User')
require("dotenv").config()

const app = express();

//DB Connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Connected Database Successfully");
});

//Body-Parser
app.use(bodyParser.json());

//GET All Users
app.get('/register', (req, res, next) => {
    User.find()
      .then(user => res.status(200).json(user))
      .catch(error => res.status(400).json({ error }));
  });

//POST new User
app.post('/register', (req, res) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    user
    .save()
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      console.log(err);
      res.status(501).json({
        error: err
      });
    });
});

// GET by ID
app.put("/register/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, (err) => {
        if (err) throw err;
        User.findById(req.params.id)
            .then((el) => res.json(el))
            .catch((err) => console.log(err));
    });
});

// DELETE A User
app.delete("/register/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json({ msg: "User deleted." }))
        .catch((err) => console.log(err));
});

//Port Listen 5000
app.listen(5000,function(req,res){
    console.log("Server is started on port 5000");
    });