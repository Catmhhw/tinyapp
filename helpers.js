// generates a 6 character random string
function generateRandomString() {
    let randomString = '';
    let characters = '012345679abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 6; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

//gets urls that belows to user in database
function urlsForUser(id, urlDatabase) {
  let userURL = {}
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURL[shortURL] = urlDatabase[shortURL]
    }
  }
  return userURL
}

// gets the user by email
const getUserByEmail = function(email, users) {
  for (const key in users) {
    if (email === users[key].email) {
      return key
    }
  }
  return false;
};

module.exports = { generateRandomString, urlsForUser, getUserByEmail };