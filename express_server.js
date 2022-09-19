const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  },
  a1b2c3: {
    longURL: "https://www.instagram.com",
    userID: "klbcw7"
  }
};

const users = {
  aJ48lW: {
    userId: "aJ48lW",
    email: "example@email.com",
    password: "test"
  },
  klbcw7: {
    userId: "klbcw7",
    email: "test@email.com",
    password: "test"
  }
};

app.use(express.urlencoded({ extended: true }));

///////////////////////////////////////////////////////////
///////////////////////// ROUTES - links
///////////////////////////////////////////////////////////

app.get("/u/:id", (req, res) => {
  const id = req.params.id
  const longURL = urlDatabase[id].longURL;

  if (longURL) {
    res.redirect(longURL);
    return;
  }
    return res.send("ERROR 404: PAGE NOT FOUND");
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const userURLS = urlsForUser(userId, urlDatabase)
  
  if (!user) {
    return res.send("Please login or register")
  }

  if (user) {
    const templateVars = { urls: userURLS, user};
    res.render("urls_index", templateVars);
  } 
});


app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]
  const user = users[userId]
  const templateVars = { urls: urlDatabase, user};

  if (!user) {
    return res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"]
  const userID = urlDatabase[req.params.id].userID
  const user = users[userId]
  const longURL = urlDatabase[req.params.id].longURL
  const templateVars = { id: req.params.id, urls: urlDatabase, user, longURL};

  if (!user) {
    return res.send("Please login or register")
  }

  if (userId !== userID) {
    res.status(403).send('NO ACCESS');
  }

  res.render("urls_show", templateVars);
});


app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  if (user) {
   return res.redirect("/urls");
  }
  res.render("user_registration");
})


app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {urls: urlDatabase, user }
  if (user) {
   return res.redirect("/urls");
  }
  res.render("user_login", templateVars);
})

///////////////////////////////////////////////////////////
///////////////////////// POST
///////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  // const user = users[userId]
  const id = generateRandomString();
  const longURL = req.body.longURL
  const url = { userID, longURL}

  urlDatabase[id] = url

  // if (!user) {
  //   return res.send("User is not Logged in.");
  // }
 
   console.log(req.body);
 
  // urlDatabase[id] = {
  //     longURL: req.body.longURL,
  //     userID: user
  //   }

  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId]
  const userID = urlDatabase[req.params.id].userID
  if (!user) {
    return res.status(403).send("Please login or register")
  }
  if (userId !== userID) {
    return res.status(403).send("NO ACCESS. Not owner.");
  }
  res.redirect("/urls");
});

//DELETE
app.post("/urls/:id/delete", (req, res) => {
  const userId = req.cookies["user_id"]
  const user = users[userId]
  const userID = urlDatabase[req.params.id].userID
  // const shortURL = req.params.id

  if (!user) {
    return res.status(403).send("Please login or register")
  }
  if (userId !== userID) {
    return res.status(403).send("You do not have have access to this short URL.")
  }

  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//EDIT
app.post("/urls/:id/edit", (req, res) => {
  const userId = req.cookies["user_id"]
  const user = users[userId]
  urlDatabase[req.params.id].longURL = req.body.longURL;

  if (!user) {
    return res.status(403).send("Please login or register")
  }
  if (userId !== userID) {
    return res.status(403).send("You do not have have access to this short URL.")
  }

  res.redirect("/urls");
});

//LOGIN
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (email === "" && password === "") {
    return res.status(400).send("ERROR 400")
  }
  console.log(email, password);
  for (let key in users) {
    if (users[key].email === email) {
      if (users[key].password === password) {
          res.cookie("user_id", users[key].userId);
          res.redirect("/urls");
          return;
      } else {
        return res.status(403).send("Credentials do not match. Please try again.");
      }
    }
  }
  return res.status(403).send("ERROR 403: email cannot be found.");
});

//LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

//REGISTER
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email === "" && password === "") {
    return res.status(400).send("Please enter Details.");
  }

  for (const key in users) {
    if (Object.hasOwnProperty.call(users, key)) {
      const dbUser = users[key];
      console.log('dbUser:', dbUser)
      if (dbUser.email === email) {
        return res.status(400).send("Email is already taken");
      }
    }
  }

  const id = generateRandomString();
  
  const user = {
      userId: id,
      email,
      password
  }

  users[id] = user;
  res.cookie("user_id", id);
  res.redirect("/urls");
});


//LISTEN
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

///////////////////////////////////////////////////////////
///////////////////////// FUNCTIONS
///////////////////////////////////////////////////////////

// generates a 6 character random string
function generateRandomString() {
    let randomString = '';
    let characters = '012345679abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 6; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

function urlsForUser(id, urlDatabase) {
  let userURL = {}
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURL[shortURL] = urlDatabase[shortURL]
    }
  }
  return userURL
}

//... : spreads out the object, makes it one level less  ==> users = {...users, user}
//validation, read, check, add, respond
//req.body is attached to name
//render paint page
//redirect takes to other page