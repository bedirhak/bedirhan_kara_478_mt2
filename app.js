const express = require('express');
const socket = require('socket.io');
const path = require("path");
const hbs = require("hbs");
const db = require('./db'); // add db.js data to app.js
const stocks = require('./routes/stocks.js');
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


hbs.registerHelper("section", function(name, options) { 
    // "this" shows the main context object.
       this[name] = options.fn(this); 
       //console.log(this);
       return null;
 }); 

app.get("/test", (req, res) => {
    // Get input from post, get, url params
    // Process data, (insert into db)
 
    const products = db.products;
    products.categoryNames = db.category;
   
    // Output: (html, json)
   res.render("mainUserTable", { 
     title: "Products",
     products: products,
     categoryNames: db.category,
     cssFile : "mainUsers.css",
     //layout: false   // to stop default layout
     //layout: "layout/base2"   // to use a different base
   })    
 });



// Socket.io bağlantısı
io.on('connection', function(socket) {
    console.log('Socket.io client connected');

    // Stok azaltma olayını dinleme
    socket.on('reduceStock', function(productId) {
    const product = db.products.find(p => p.id == productId);
    if (product && product.stock > 0) {
        product.stock--;
        io.emit('updateStock', product);
    }
    // server.js
    
    const http = require("http");
    const socketIo = require("socket.io");
    
    const server = http.createServer(app);
    const io = socketIo(server);
    });
});


app.get("/test", (req, res) => {
  res.render("index", { products: db.products });
});

io.on("connection", (socket) => {
  console.log("A client has connected.");

  socket.on("stock-update", (productId) => {
    console.log(productId)
    // Find the product in the database
    const productIndex = db.products.findIndex((p) => p.id === productId);
    const product = db.products[productIndex];
    console.log(product);

    // Update the product's stock and save the changes
    if (product) {
      product.stock--;
      db.products[productIndex] = product;
      console.log(product);

      console.log(`Product ${product.id} stock has been updated to ${product.stock}`);

        fs.writeFile('./db.js', (product), (err) => {
        if (err) throw err;
        console.log('Data updated!');
        });

      // Emit a "stock-updated" event to all connected clients
      io.emit("stock-decrease", product);
    }
  });
});



server.listen(8090, () => {
  console.log("Server is running on http://localhost:8090");
});


