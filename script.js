const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { log } = require("console");
const port = process.env.PORT || 8000;

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

app.post("/delete/:filename", function (req, res) {
  const filename = req.params.filename;
  fs.unlink(`./file/${filename}`, function (err) {
    if (err) return res.send("Error deleting file: " + err);
    res.redirect("/");
  });
}
);


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


app.get("/show/:filename", function (req, res) {
  const filename = req.params.filename;
  
  // Add check for file existence
  if (!fs.existsSync(`./file/${filename}`)) {
    console.error('File not found:', filename);
    return res.render("show", { 
      filename: null, 
      filedata: null 
    });
  }

  fs.readFile(`./file/${filename}`, "utf-8", function (err, data) {
    if (err) {
      console.error('Error reading file:', err);
      return res.render("show", { 
        filename: null, 
        filedata: null 
      });
    }
    res.render("show", { 
      filename: filename,
      filedata: data 
    });
  });
});

app.get("/download/:filename", function (req, res) {
const filename= req.params.filename;
const filePath=path.join(__dirname,'file',filename);
// Check if the file exists before attempting to download it
if (!fs.existsSync(filePath)) {
  return res.status(404).send('File not found');
}
res.download(filePath,function(err){
  if(err){
    console.error('Error in downloading the file',err);
  }
  }
  );  
}
);


app.listen(port);
