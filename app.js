const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.static(path.join(__dirname, "js")));

app.set("view engine", ejs);
const loginRouter=require('./routes/login');
const newRouter=require('./routes/new');



// testingv 

// Rest of your Express app configuration


app.get("/", (req, res) => {
  res.render("about.ejs");
});

// app.get("/login", (req, res) => {
//   res.render("login.ejs");
// });



app.use('/login',loginRouter);
app.use('/new-view',newRouter);


app.listen(3000, () => {
  console.log("port connected");
});




