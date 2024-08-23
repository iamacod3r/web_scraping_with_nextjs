import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  currency : { type: String, required: true },
  images : [
    {
        url : {type: String, required: true},
        width: {type: Number},
        height: {type: Number},
    }
  ],
  title: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  currentFraction: { type: Number, required: false },
  originalPrice: { type: Number, required: true },
  priceHistory: [
    {
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  lowestPrice: { type: Number, required: true },
  highestPrice: { type: Number, required: true },
  averagePrice: { type: Number, required: true },
  discountRate: { type: Number },
  description: { type: String },
  category: { type: String },
  reviewsCount: { type: Number },
  stars: { type: Number },
  isOutOfStock: { type: Boolean, default: false },
  users:[
    {
        email : {type: String, required: true},
    }
  ]

}, {timestamps:true});


const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;