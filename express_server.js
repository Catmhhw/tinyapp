const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  cat: {
    userId: "cat",
    email: "example@email.com",
    password: "test"
  },

  vic: {
    userId: "vic",
    email: "test@email.com",
    password: "tester"
  }
};

app.use(express.urlencoded({ extended: true }));


/////// ROUTES - links
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  if (longURL) {
    res.redirect(longURL);
  } else {
    return res.send("ERROR 404: PAGE NOT FOUND");
  }
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"]
  const user = users[userId]
  const templateVars = { urls: urlDatabase, user};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]
  const user = users[userId]
  const templateVars = { urls: urlDatabase, user};
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"]
  const user = users[userId]
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user};
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {urls: urlDatabase, user};
  res.render("user_registration", templateVars);
})

app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = {urls: urlDatabase, user };
  res.render("user_login", templateVars);
})



/////// POST
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect("/urls/"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
urlDatabase[req.params.id] = req.body.longURL;
res.redirect("/urls");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (email === "" && password === "") {
    return res.status(400).send("ERROR 400")
  }
  console.log(email, password)
  for (let key in users) {
    if (users[key].email === email) {
      if (users[key].password === password) {
          res.cookie("user_id", users[key].userId);
          res.redirect("/urls");
          return;
      } else {
        return res.status(403).send("Credentials do not match. Please try again.")
      }
    }
  }
  return res.status(403).send("ERROR 403: email cannot be found")
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/register");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (email === "" && password === "") {
    return res.status(400).send("ERROR 400")
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
//... : spreads out the object, makes it one level less  ==> users = {...users, user}
  users[id] = user;
  console.log("USERS:", users)
  res.cookie("user_id", id);
  console.log("USERID:", user);
  res.redirect("/urls");
})

//validation, read, check, add, respond


//LISTEN
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// generates a 6 character random string
function generateRandomString() {
    let randomString = '';
    let characters = '012345679abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 6; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}



//req.body is attached to name
//render paint page
//redirect takes to other page


// app.get("/", (req, res) => {
//     res.send("Hello!");
//   });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });