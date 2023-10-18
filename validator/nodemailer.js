const nodemailer = require('nodemailer')
const mailgen = require('mailgen')


module.exports={

  sendmail : async(req,res) => { 
   try{ 
 transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'karthikbrototype@gmail.com',
      pass: 'belj vqwu rxtc bmjr',
    },
  })

  const info = await transporter.sendMail({
    from:'"Fred Foo 👻" <foo@example.com>',
    to:"karthikpp100@gmail.com",
    subject:"greetings",
    text:"hai how are you"
    
});

console.log("Message sent: %s",info.messageId);


   }catch(error) {
    res.send("error in sending email")
   }
}}

