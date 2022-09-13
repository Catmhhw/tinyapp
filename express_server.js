const cookieParser = require('cookie-parser')
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const userDatabase = {
  1: {
    username: "Cat",
    name: "Catherine",
    email: "example@email.com",
    password: "testpass"
  },

  2: {
    username: "Vic",
    name: "Victoria",
    email: "example1@email.com",
    password: "testpass"
  }

};

app.use(express.urlencoded({ extended: true }));



//ROUTES - links
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  if (longURL) {
    res.redirect(longURL);
  } else {
    return res.send("ERROR 404: PAGE NOT FOUND");
  }
});

app.get("/urls", (req, res) => {
  const username = req.cookies["username"]
  const templateVars = { urls: urlDatabase, username: username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const username = req.cookies["username"]
  const templateVars = { urls: urlDatabase, username: username };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const username = req.cookies["username"]
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: username};
  res.render("urls_show", templateVars);
});

// app.get("/login", (req, res) => {
//   res.cookie("user_id", "user_name")
//   req.send("test")
// })



//POST
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
  const idFromForm = req.body.username;
  for(let key in userDatabase) {
    if(userDatabase[key].username === idFromForm) {
          res.cookie("username", userDatabase[key].username);
          res.redirect("/urls");
          return
    }
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect("/urls");
});





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