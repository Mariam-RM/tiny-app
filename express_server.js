var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')

app.use(cookieParser())


function generateRandomString() {
 let randomString = Math.random().toString(36).replace('0.', "")

 let shorturl = randomString.substring(0,6);
 return shorturl
}

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
   username:req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
  username:req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/register",(req,res) => {
  let templateVars = { urls: urlDatabase,
   username:req.cookies["username"]
  };
  res.render("urls_register", templateVars)
});


app.post("/urls", (req, res) => {


  console.log(req.body);
  var shortKey = generateRandomString();

  urlDatabase[shortKey] = req.body.longURL;



  res.redirect('http://localhost:8080/urls/' + shortKey);
});


app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL]
  let templateVars = { shortURL ,
    longURL,
    username:req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls/:id/delete",(req,res) => {
 var shortKey = req.params.id;
 delete  urlDatabase[shortKey]; // let shortKey = urlDatabase[req.params.id]
 res.redirect("/urls")
});

app.post("/urls/:id", (req,res) => {
  const ID = req.params.id;
  const LongURL = req.body.longURL;

   urlDatabase[ID] = LongURL

  res.redirect("/urls")
});

app.post("/login", (req,res) =>{



  const name = req.body.login
  res.cookie("username",name);
  res.redirect("/urls");


})

app.post("/logout", (req,res) =>{



  const name = req.body.login
  res.cookie("username",name);
  res.clearCookie("username")
  res.redirect("/urls");


})

app.post("/register", (req,res) =>{


  res.redirect("/urls");
})