const mongoose = require('mongoose');
const {Schema,ObjectId} = mongoose
// Define the Product Schema
const productSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Display:{
    type:String,
    required:true,
  },
  Price: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  BrandName:{
    type:Schema.Types.ObjectId,
    required:true,
  },
  tags:{
    type:Array,
  },
  imageUrl: {
    type: Array,
    
  },
  AvailableQuantity:{
    type:Number,
    required:true
  },
  DiscountAmount:{
    type:Number,
  },
  Status:{
    type:String,
    required:true
  },
  variation:{
    type:String,
  },
  UpdatedOn:{
    type:String
  },
 
  specification1:{
    type:String
  },
  specification2:{
    type:String
  },
  specification3:{
    type:String
  },
  deletedAt:{
    type:Date
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
