const nodemailer = require('nodemailer')
const OTP = require('../model/otpmodel')
const flash = require('express-flash')

//generate otp
module.exports = {
    generateOTP:() => {
        const otp = Math.floor(1000+Math.random() *9000).toString()
        return otp;
    },

    sendOTP: async(req,res,email,otpToBeSent) => {
        try {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'karthikbrototype@gmail.com',
              pass: 'belj vqwu rxtc bmjr',
            },
          })
          console.log(email,"hereeeee");
          duration = 5
          const newOTP = new OTP({
            email:email,
            otp:otpToBeSent,
            createdAt:Date.now(),
            expiresAt:Date.now()+duration*60000
          })

          const createdOtp = await newOTP.save()

          ///otp sending
          const maildata = {
            from:'karthikbrototype@gmail.com',
            to:email,
            subject:"OTP FROM BIZPRO",
            html: `<p>otp from bizpro</p> <p style="color:tomato; font-size:25px; letter-spacing:3px"><b>${otpToBeSent}</b></p>`
          }

            setTimeout(async() => {
              try{
                await OTP.deleteOne({email:email})
                console.log(`otp of ${email} deleeted succesfully`);
              }catch(error) {
                console.log(`error deleting in ${email}`);
              }
            }, .5*60*1000);

          transporter.sendMail(maildata,(error,info) => {
            if(error) {
              console.log(email,"haiiiiiii");
                return console.log(error);
            }
            console.log("otp sent");
          })

          res.redirect('/emailverification')
    }catch(error) {
        console.log(error);
        req.flash('error',"error sending OTP")
        res.redirect('/signup')
    }
    },
    
    forgotOTP: async(req,res,email,otpToBeSent) => {
      try {
      transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'karthikbrototype@gmail.com',
            pass: 'belj vqwu rxtc bmjr',
          },
        })
        console.log(email,"hereeeee");
        duration = 5
        const newOTP = new OTP({
          email:email,
          otp:otpToBeSent,
          createdAt:Date.now(),
          expiresAt:Date.now()+duration*60000
        })

        const createdOtp = await newOTP.save()

        ///otp sending
        const maildata = {
          from:'karthikbrototype@gmail.com',
          to:email,
          subject:"OTP FROM BIZPRO FOR RESETTING PASSWORD",
          html: `<p>otp from bizpro</p> <p style="color:tomato; font-size:25px; letter-spacing:3px"><b>${otpToBeSent}</b></p>`
        }

          setTimeout(async() => {
            try{
              await OTP.deleteOne({email:email})
              console.log(`otp of ${email} deleeted succesfully`);
            }catch(error) {
              console.log(`error deleting in ${email}`);
            }
          }, .5*60*1000);

        transporter.sendMail(maildata,(error,info) => {
          if(error) {
              return console.log(error);
          }
          console.log("otp sent");
        })
        res.redirect('/forgototp')
  }catch(error) {
      console.log(error);
      req.flash('error',"error sending OTP")
      res.redirect('/forgotpassword')
  }
  }   
}
