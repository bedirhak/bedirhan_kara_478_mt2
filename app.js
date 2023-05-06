const express = require('express');
const socket = require('socket.io');
const path = require("path");
const hbs = require("hbs");
const db = require('./db'); // add db.js data to app.js



const app = express();
const server = app.listen(8080);

app.use(express.static('public'));


hbs.registerPartials(path.join(__dirname, "/views/partials"));


app.set("views", path.join(__dirname,"views"));
app.set("view options", {layout: "layout/base"});
app.set("view engine", "hbs");


app.get("/test", (req, res) => {
    // Get input from post, get, url params
    // Process data, (insert into db)
 
    db.products.categoryNames = (db.category);
   
    // Output: (html, json)
   res.render("mainUserTable", { 
     title: "Bedirhan Kara Mt2",
     products: db.products,
     // cssFile : "test.css",
     //layout: false   // to stop default layout
     //layout: "layout/base2"   // to use a different base
   })    
 });