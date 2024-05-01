const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

// Middleware para population 
cartSchema.pre('findOne', function() {
 
    this.populate('products.product','_id title price');
   
  });

const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;
