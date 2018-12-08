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

function findUserID(email){

  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
      // return users[userId].;
    }
  }
  return false;
}

function isPasswordCorrect(email){


  for (const userId in users){
    if (users[userId].email === email){
      return users[userId].password;
    }

  }
  return false

}



// function findUserInfoByEmail(email){

//   for (const userId in users){
//     if(users[userID].email === email)
//   }


// }


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

// var urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

var urlDatabase = {
  "b2xVn2": {
    longURL :"http://www.lighthouselabs.ca",
    id: 0
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    id: 0
  }
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
   user_id:req.cookies["user_id"]
  };
  res.render("urls_index", templateVars);
});

//make new urls
app.get("/urls/new", (req, res) => {
  let templateVars = {
  user_id:req.cookies["user_id"],
  };

  if(!templateVars.user_id){
    res.render("urls_login", templateVars);
  } else {
    res.render("urls_new", templateVars);
  }

});


app.get("/urls/register",(req,res) => {
  let templateVars = { urls: urlDatabase,
   user_id:req.cookies["user_id"]
  };
  res.render("urls_register", templateVars)
});

app.get("/urls/login", (req, res) =>{

let templateVars = { urls: urlDatabase,
   user_id:req.cookies["user_id"]
  };


  res.render("urls_login", templateVars);

})


//making new urls
app.post("/urls", (req, res) => {



  var shortKey = generateRandomString();





  urlDatabase[shortKey] = {
    longURL: req.body.longURL,
    id: req.cookies.user_id
  };

console.log(urlDatabase)


  res.redirect('http://localhost:8080/urls/' + shortKey);
});

// loaded url edit page
app.get("/urls/:id", (req, res) => {
  let shortKey = req.params.id;
  let longURL = urlDatabase[shortKey].longURL
  let templateVars = { shortKey ,
    longURL,
    user_id:req.cookies["user_id"]
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// goes to link short url points to
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

// deletes resource
app.post("/urls/:id/delete",(req,res) => {
 var shortKey = req.params.id;
 delete  urlDatabase[shortKey]; // let shortKey = urlDatabase[req.params.id]
 res.redirect("/urls")
});

// edit url
app.post("/urls/:id", (req,res) => {
  const ID = req.params.id;
  const LongURL = req.body.longURL;

   urlDatabase[ID] = LongURL

  res.redirect("/urls")
});

app.post("/login", (req,res) =>{

const email = req.body.email;
const password = req.body.password;

if ( !isUserEmailPresent(email)){
  res.send("Error 403 - User Not found")
} else {
  let checkpassword = isPasswordCorrect(email);
  if (checkpassword !== password){
    res.send("Error 403 - Password Incorrect");
  } else {
    user_id = findUserID(email);
    res.cookie("user_id", user_id)
    res.redirect("/urls");
  }
}

})

app.post("/logout", (req,res) =>{



  const user_id = req.body.login
  res.cookie("user_id", user_id);
  res.clearCookie("user_id")
  res.redirect("/urls");


})

app.post("/register", (req,res) =>{

const email = req.body.email;
const password = req.body.password;

let user_id = generateRandomString();


res.cookie("user_id", user_id)


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
     users[user_id] = userObject;
     res.redirect("/urls");
    }


  console.log(users)
})





