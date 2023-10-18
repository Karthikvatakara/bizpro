const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = path.extname(file.originalname)
      cb(null, Date.now()+ uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload