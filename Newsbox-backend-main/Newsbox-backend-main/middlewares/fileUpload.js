const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination :(req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
      cb(null,'./uploads/images')
    }else if(file.mimetype.startsWith('video/')){
      cb(null,'./uploads/videos')
    }else{
      cb(new Error('File type not supported...'),false)
    }
  },

  filename :(req,file,cb)=>{
    const ext = path.extname(file.originalname)
    cb(null,Date.now()+'-'+file.fieldname+ext)
  }
})

const fileFilter = (req,file, cb)=>{
  if(file.mimetype.startsWith('image/')){
    cb(null,true)
  }else if(file.mimetype.startsWith('video/')){
    cb(null,true)
  }else{
    cb(new Error('Invalid file type...'))
  }
}

const fileUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = fileUpload;