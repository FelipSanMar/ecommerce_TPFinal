const {faker} = require("@faker-js/faker"); 

 function product() {
    
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        img: "Sin Imagen",
        code: faker.commerce.isbn(),
        stock: parseInt(faker.string.numeric()),
        category: faker.commerce.department(),
        status: true,
         
    }
}



function generateProducts(cantidad){

    let products = [];

    for(let i=0 ; i < cantidad; i++){
        products.push(product());
    }

    return products;
}

module.exports = {generateProducts};