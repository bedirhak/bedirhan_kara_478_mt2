const db = require('./db');



function decreaseStock (id) {
    let boughtItemIndex;
    
    db.products.foreach((product, index) => product.id == id && (boughtItemIndex = index));

    db.products[boughtItemIndex].stock -= 1;

    console.log(db);
} 


function putStock () {
    
} 