const express = require('express');
const socket = require('socket.io');
const path = require("path");
const hbs = require("hbs");
const db = require('./db'); // add db.js data to app.js
const stocks = require('./routes/stocks.js');
const fs = require("fs");
const dbPath = './db.js';
// db.js dosyasını okuyalım

// //socket.io
// const http = require("http");
// const serverSocket = http.createServer();

// const { Server } = require("socket.io");
// const io = new Server(serverSocket, {
//     cors: { origin: "*" },
// });


// server.js

const app = express();

app.use(express.static('public'));


hbs.registerPartials(path.join(__dirname, "/views/partials"));


app.set("views", path.join(__dirname,"views"));
app.set("view options", {layout: "layout/base"});
app.set("view engine", "hbs");

const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server);

const myDb = db;


hbs.registerHelper("section", function(name, options) { 
    // "this" shows the main context object.
       this[name] = options.fn(this); 
       //console.log(this);
       return null;
 }); 

app.get("/", (req, res) => {
    // Get input from post, get, url params
    // Process data, (insert into db)
 
    const products = myDb.products;
    products.categoryNames = myDb.category;
   
    // Output: (html, json)
   res.render("mainUserTable", { 
     title: "Products",
     products: products,
     categoryNames: myDb.category,
     cssFile : "mainUsers.css",
     //layout: false   // to stop default layout
     //layout: "layout/base2"   // to use a different base
   })    
 });


 app.get("/stock/:id/:newStock", (req, res) => {

    var products = myDb.products;
    var productIndex;
    products.forEach((p, index) => {
        if (p.id == req.params.id) {
            products[index].stock > 0 && (products[index].stock = req.params.newStock);
            productIndex = index;
        } 
    });
    myDb.products = products;
    
    res.redirect('/');
 
 });

 


io.on("connection", (socket) => {
  console.log("A client has connected.");




  socket.on("stock-update", async (productId) => {
    // Find the product in the database

    var products = myDb.products;
    var productIndex;
    products.forEach((p, index) => {
        if (p.id == productId) {
            products[index].stock > 0 && (products[index].stock -= 1);
            productIndex = index;
        } 
    });

    // Update the product's stock and save the changes
    if (products) {



        myDb.products = products;
        
        //console.log(myDb)

      // Emit a "stock-updated" event to all connected clients
     // io.emit("stock-decrease", products);
    }

    socket.emit("hello", myDb.products[productIndex]);


  });
});



server.listen(8090, () => {
  console.log("Server is running on http://localhost:8090");
});


