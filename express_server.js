var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')

app.use(cookieParser())


function generateRandomString() {
 let randomString = Math.random().toString(36).replace('0.', "")

 let shorturl = randomString.substring(0,6);
 return shorturl
};

function isUserEmailPresent(email){

  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return false;
}

function isUserIDPresent(email){

  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId].id;
    }
  }
  return false;
}


// function findIDforEmail(email){
//   for (userID in users){
//     if(users[userID].email === email){
//       let user_ID = users[userID]
//       return user_ID;
//     }
//   }
//   return false;
// }





app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
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
  res.cookie("user_ID", users);
  res.clearCookie("user_ID")
  res.redirect("/urls");


})

app.post("/register", (req,res) =>{

const email = req.body.email;
const password = req.body.password;

let user_id = generateRandomString();
// let user_ID = isUserIDPresent(email)

res.cookie("user_id", user_id)

 // const email = req.body.email;
 // const password = req.body.password;
 // const USER_ID = findIDforEmail(email)
 // res.cookie("user_id", users[userID])

// res.cookie("email",email);
// res.cookie("password",password);
// var object = users[user_id]



  if ( email === "" || password === ""){
    res.send("error : 400 - Bad Request Error - invalid field entry");
  } else if (isUserEmailPresent(email)){
    res.send("error : 400 - Bad Request Error - email already registered")
  } else {
      let userObject = {
      id : user_id,
      email : email,
      password: password
      }
      users[user_id] = userObject
     res.redirect("/urls");
    }


  console.log(users)
})






// function isUserEmailPresent(email){

//   for (const userId in users) {
//     if (users[userId].email === email) {
//       return users[userId];
//     }
//   }
//   return false;
// }

// function isUserIDPresent(email){

//   for (const userId in users) {
//     if (users[userId].email === email) {
//       return users[userId].id;
//     }
//   }
//   return false;
// }


// app.post("/registration", (req, res) => {
//  let templateVars = {
//    aCookie: req.cookies['aCookie'],
//    db: urlDatabase,
//  };
//  // add error check for duplicate email signup and response with 400 status

//  if (duplicateEmailCheck((req.body.email).trim())){
//    console.log(duplicateEmailCheck((req.body.email).trim()))
//    res.status(400).send('400 Duplicate Email');
//  }
//  else {
//    let tempID = uuidv4()
//    users[tempID] = {
//    id: tempID,
//    email: (req.body.email).trim(),
//    password: req.body.Password
//  }
//  res.cookie('aCookie', tempID);
//  res.redirect('/urls');
//  }
// });

// If the e-mail or password are empty strings, send back a response with the 400 status code.

// If someone tries to register with an existing user's email, send back a response with the 400 status code.

// Note: Storing users' passwords like this is very, very bad. Don't worry though, we'll fix this issue in a later exercise!