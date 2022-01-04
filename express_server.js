
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { generateRandomString, getEmail, emailPwdMatch, getUserID, urlsForUser } = require("./helpers");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  
  maxAge: 24 * 60 * 60 * 1000 
}));


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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  "test1": {
    id: "test1",
    email: "test1@example.com",
    password: bcrypt.hashSync("1", 10)
  },
  "test2": {
    id: "test2",
    email: "test2@example.com",
    password: bcrypt.hashSync("2", 10)
  }
};




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.session.user, userID: req.session.user_id};
  
  if (!req.session.user) {
    res.render("urls_landing", templateVars);
  }
  res.redirect("/urls");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.session.user, userID: req.session.user_id};
  if (!req.session.user) {
    res.redirect("/");
  }
  res.render("urls_index", templateVars);
});




app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.session.user, userID: req.session.user_id};
  if (!req.session.user) {
    res.render("urls_register", templateVars);
  }
  res.render("urls_index", templateVars);

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
    password: bcrypt.hashSync(req.body.password, 10)
  };


  
  const userObj = users[randomUserID];
   req.session.user = userObj;
  const foundUserID = getUserID(users, req.body.email);
  req.session.user_id = foundUserID;
  res.redirect("/urls");
});


app.get("/login", (req, res) => {
  const templateVars = {user: req.session.user, userID: req.session.user_id, urls: urlDatabase};

  if (!req.session.user) {
    res.render("urls_login", templateVars);
    res.redirect("/urls");
  }
  res.redirect("/urls");
});


app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userPresence = emailPwdMatch(users, userEmail, userPassword);
  const foundUserID = getUserID(users, req.body.email);

  
  if ((!userEmail) || (!userPassword)) {
    res.status(403).send(`Error: 403. Invalid email or password`);
  }

  
  if (userPresence !== true) {
    res.status(403).send(`Error: 403. Incorrect login credentials`);
  }

  
  req.session.user = req.body; 
  req.session.user_id = foundUserID;
  res.redirect("/urls");
});


app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});




app.get("/urls/new", (req, res) => {
  const templateVars = {urls: urlDatabase, user: req.session.user, userID: req.session.user_id};

  
  if (req.session.user) {
    res.render("urls_new", templateVars);
  }
  res.redirect("/");
});


app.post("/urls", (req, res) => {
  const randomStr = generateRandomString();
  const userID = req.session.user_id;
  urlsForUser(urlDatabase, userID); 
  urlDatabase[randomStr] = {longURL: req.body.longURL, userID: req.session.user_id}; 

  res.redirect(`/urls/${randomStr}`); 
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, long_URL: urlDatabase[req.params.shortURL].longURL, user: req.session.user, userID: req.session.user_id};
  const longURL = urlDatabase[req.params.shortURL];

   if (longURL.userID === req.session.user_id) {
     res.render("urls_show", templateVars);
   }
   res.redirect("/urls");
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL.userID === req.session.user_id) {
    res.redirect(longURL.longURL);
  }
  res.redirect("/urls");
});


app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  
  urlsForUser(urlDatabase, userID);
  urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;

  res.redirect(`/urls/${req.params.shortURL}`);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  const longURL = urlDatabase[req.params.shortURL];
  urlsForUser(urlDatabase, userID); 

  if (longURL.userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL], req.params.shortURL;
    res.redirect("/urls");
  }
  res.redirect("/urls");
});