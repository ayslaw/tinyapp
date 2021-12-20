
const express = require("express");
const app = express();
const PORT = 8080; 
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());



const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};


const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
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


const getEmail = function(obj, str) {
  for (const id in obj) {
    if (obj[id].email === str) {
      
      return true; 
    }
  }
};


const checkUserPresence = function(obj, email, pwd) {
  for (const id in obj) {
    if ((obj[id].email === email) && (obj[id].password === pwd)) {
      
      return true; 
    }
  }
};




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies["user"], userID: req.cookies["user_id"]};
  res.render("urls_index", templateVars);
});




app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies["user"], userID: req.cookies["user_id"]};
  res.render("urls_register", templateVars);
});


app.post("/register", (req, res) => {
  const randomUserID = generateRandomString();
  const userEmail = req.body.email; 

  
  
  let evaluation = (getEmail(users, userEmail));
  if (evaluation === true) {
    res.status(400).send(`Error: 400. Email is already in use`);
  }

  
  if ((!req.body.email) || (!req.body.password)) {
    res.status(400).send(`Error: 400. Invalid email or password`);
  }

  
  
  users[randomUserID] = {
    id: randomUserID,
    email: req.body.email,
    password: req.body.password
  };

  
  const userObj = users[randomUserID]; 
  res.cookie("user", userObj); 
  res.redirect("/urls"); 
});


app.get("/login", (req, res) => {
  const templateVars = {user: req.cookies["user"], userID: req.cookies["user_id"]};
  res.render("urls_login", templateVars); 
  res.redirect("/urls"); 
});


app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userPresence = checkUserPresence(users, userEmail, userPassword);

  
  
  if ((!userEmail) || (!userPassword)) {
    res.status(403).send(`Error: 403. Invalid email or password`);
  }

  
  if (userPresence !== true) {
    res.status(403).send(`Error: 403. Incorrect input`);
  }

  
  res.cookie("user", req.body); 
  res.redirect("/urls");
});


app.get("/logout", (req, res) => {
  const templateVars = {user: req.cookies["user"], userID: req.cookies["user_id"]};
  res.render("urls_show", templateVars); 
  res.redirect("/urls");
});


app.post("/logout", (req, res) => {
  
  res.clearCookie("user"); 
  res.redirect("/urls"); 




app.get("/urls/new", (req, res) => {
  const templateVars = {urls: urlDatabase, user: req.cookies["user"], user: req.cookies["user"], userID: req.cookies["user_id"]};

  
  if (req.cookies.user) {
    res.render("urls_new", templateVars)
  } else {
    res.redirect("/urls")
  }
});


app.post("/urls", (req, res) => {
  
  const randomStr = generateRandomString();

  urlDatabase[randomStr] = {longURL: req.body.longURL, userID: req.cookies["user_id"].id}; 
  
  res.redirect(`/urls/${randomStr}`);
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, long_URL: urlDatabase[req.params.shortURL].longURL, user: req.cookies["user"], userID: req.cookies["user_id"]};
  res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.post("/urls/:shortURL", (req, res) => {

  
  urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;

  res.redirect(`/urls/${req.params.shortURL}`);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.body); 
  delete urlDatabase[req.params.shortURL], req.params.shortURL; 
  res.redirect("/urls"); 
  
});
