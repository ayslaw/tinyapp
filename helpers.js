
const bcrypt = require('bcryptjs');


const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
};

const getEmail = function(obj, str) {
  for (const id in obj) {
    if (obj[id].email === str) {
      return true; 
    }
  }
};



const emailPwdMatch = function(obj, email, pwd) {
  for (const id in obj) {
    if ((obj[id].email === email) && (bcrypt.compareSync(pwd, obj[id].password))) {
      return true; 
    }
  }
};

const getUserID = function(userObj, email) {
  let user_id;
  for (let user in userObj) {
    let emails = userObj[user].email;
    if (emails === email) {
      user_id = userObj[user].id;
    }
  }
  return user_id;
};

const urlsForUser = function(userID, databaseObj) {
  let newUserObj = {};

  
  for (const shortURL in databaseObj) {
    let databaseUserID = databaseObj[shortURL].userID;
    
    if (userID === databaseUserID) {
      newUserObj[shortURL] = databaseObj[shortURL];
    }
  }
  return newUserObj; 
};

module.exports = { generateRandomString, getEmail, emailPwdMatch, getUserID, urlsForUser };
