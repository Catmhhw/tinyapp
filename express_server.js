const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

//POSTS - create
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const id = generateRandomString()
  urlDatabase[id] = req.body.longURL
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id]
    res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls");
});


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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


//
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