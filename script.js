const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { log } = require("console");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  fs.readdir(`./file`, function (err, file) {
    res.render("index", { file: file });
  });
});

app.post("/create", function (req, res) {
  fs.writeFile(
    `./file/${req.body.title.split(" ").join("")}.txt`,
    req.body.description,
    function (err) {
      res.redirect("/");
    }
  );
});


app.get('/edit/:filename', function(req, res) {
  fs.readFile(
    `./file/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading file');
      }
      res.render("edit", { 
        filename: req.params.filename, 
        filedata: filedata 
      });
    }
  );
});


app.post("/edit/:filename", function (req, res) {
  const previousName = req.body.previous;
  const newName = req.body.newname;

  if (!newName) {
    return res.send("New file name cannot be empty.");
  }

  const oldPath = `./file/${previousName}`;
  const newPath = `./file/${newName}.txt`;

  fs.rename(oldPath, newPath, function (err) {
    if (err) return res.send("Error renaming file: " + err);
    res.redirect("/");
  });
});


app.listen(3000);
