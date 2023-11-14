const Razorpay = require('razorpay')

var instance = new Razorpay({
  key_id: 'rzp_test_mzVcxquSaxgXW5',
  key_secret: 'kI2Wwrnm0R3qsx0GbvgrErXm',
});

module.exports = {
    createRazorpayOrder:(order) => {
        // console.log(order.receipt);
        return new Promise((resolve,reject) => {
            const options = {
                amount:order.amount*100,
                currency:'INR',
                receipt: order.receipt,
            };
        instance.orders.create(options,(err,razorpayOrder) =>{
            if(err) {
                reject(err);
            } else {
                resolve(razorpayOrder);
            }
        })
        })
    }
};




