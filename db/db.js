const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("db connected succesfully");
})
.catch((err) => {
  console.log(err);
})







