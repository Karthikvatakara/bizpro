const usermodel = require('../model/usermodel')

const authmiddleware = async(req,res,next) => {
    if(req.session.userAuth) {
        const user = await usermodel.findOne({_id:req.session.user._id})
        if(user.Status === 'Active') {
        res.redirect('/home')
    }else {
        next()
    }
}
else{
    next()
}
}

const userexist = async(req,res,next) => {
    if(req.session.userAuth) {
    const user = await usermodel.findOne({_id:req.session.user._id})
    if(user.Status =='Blocked') {
        req.session.user = null;
        req.session.userAuth = false
        next()
    }
    else {
        next()
    }
} else {
    req.session.user = null
    req.session.userAuth = false
    next()
}
}

module.exports = {authmiddleware,userexist}