const authmiddleware = (req,res,next) => {
    if(req.session.adminAuth) {
        next()
    }else{
        res.redirect('/admin/adminlogin')
    }
}

const adminexist = (req,res,next) => {
    if(req.session.adminAuth) {
        res.redirect('/admin/adminshowproduct')
    }else{
        next()
    }
}

module.exports = {authmiddleware,adminexist}