const express = require("express");
const app = express();
const PORT = 8080; 
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


const urlDatabase = { 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


function generateRandomString() { 
  return Math.random().toString(36).slice(2, 8);
}




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
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});


app.post("/urls", (req, res) => {
  console.log(req.body); 
  const randomStr = generateRandomString();
  urlDatabase[randomStr] = req.body.longURL; 
  res.redirect(`/urls/${randomStr}`); 
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.body); 
  delete urlDatabase[req.params.shortURL], req.params.shortURL; 
  res.redirect("/urls"); 
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newLongURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});


app.get("/login", (req, res) => {
  res.redirect("/urls")
});


app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_register", templateVars);



});

app.post("/register", (req, res) => {

  res.redirect("/urls"); 
});




app.post("/login", (req, res) => {
  console.log(req.body); 

  res.cookie("username", req.body.username); 

  res.redirect("/urls"); 
});


app.get("/logout", (req, res) => {
  res.redirect("/urls")
});


app.post("/logout", (req, res) => {
  console.log(req.body); 
  res.clearCookie("username"); 
  res.redirect("/urls"); 
});