const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const shipAddressSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    AddressLane: {
        type: String,
        required: true,
    },
    City: {
        type: String,
        required: true,
    },
    Pincode: {
        type: Number,
        required: true,
    },
    State: {
        type: String,
        required: true,
    },
    Mobile: {
        type: Number,
        required: true
    }
});

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    Status: {
        type: String,
        default: "Order Placed"
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        Quantity: {
            type: Number
        }
    }],
    PaymentMethod: {
        type: String
    },
    OrderDate: {
        type: Date,
        default: Date.now  // Set default value to the current date
    },
    TotalPrice: {
        type: Number
    },
    PaymentStatus: {
        type: String,
        default: "pending"
    },
    CouponId: {
        type: Schema.Types.ObjectId
    },
    Address: {
        type: shipAddressSchema,
        required: true
    },
    ExpectedDeliveryDate: {
        type: Date // Adjusted to Date type for better handling
    },
    returnReason:{
        type: String
    }
});

const Order = model('Order', orderSchema); // Changed the model name to singular 'Order' for consistency

module.exports = Order;
