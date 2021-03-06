const express = require("express");
const mongoose = require('mongoose');
const users = require("./routes/api/users")
const tweets = require("./routes/api/tweets")
const app = express()
const passport = require('passport')
const db = require('./config/keys').mongoURI
const bodyParser = require('body-parser')

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.use(passport.initialize());
require('./config/passport')(passport);



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());   
app.use("/api/users", users);
app.use("/api/tweets",tweets);


app.get("/", (req,res) => res.send("WOW NODEMON SO KEWL"));

//run on port 5000
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));


