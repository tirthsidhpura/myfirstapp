const express = require('express')
const addBlogmodel = require('../db/addblog')
const path = require('path')
const fs = require('fs')
const router = express.Router();
const multer = require('multer')



const isAuth = (req,res,next)=>{
    if(req.session.isAuth){
        next()
    }
    else{
        res.redirect('/login')
    }
}
const storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+".jpg")
    }
})

var upload = multer({storage:storage}).single('image')

router.get('/admin',(req,res)=>{
    res.render('admin')
})

router.post('/addblog', upload,async (req,res)=>{
    var filename = await req.file.filename
    var addBlogdetails = new addBlogmodel({
        title : req.body.title,
        description : req.body.description,
        image : filename
    })
    addBlogdetails.save((err)=>{
        if(err){
            res.send("err saved data")
        }
        else{
            res.redirect('/admin')
        }
    })
})


router.get('/edit',(req,res)=>{
    addBlogmodel.find((err,items)=>{
        if(err){
            res.send("sory we have some issuse")
        }
        else
        {
            res.render('edit',{items:items.reverse()})
        }
    })
})
router.get('/editreq/:id',(req,res)=>{
    addBlogmodel.findById(req.params.id,(err,items)=>{
        if(err){
            res.send("sory we have some issuse")
        }
        else
        {
            res.render('editreq',{items:items})
        }
    })
})
router.get('/delete/:id',isAuth,async (req,res)=>{
    await  addBlogmodel.findByIdAndRemove(req.params.id,(err,items)=>{
        if(err){
            res.send("sory we have some issuse")
        }
        else
        {
            const path = './public/uploads/'+items.image
            try {
                fs.unlinkSync(path)
                res.redirect('/edit')
                //file removed
              } catch(err) {
                console.error(err)
              }
        }
    })
    
})
router.post('/editreq/:id',isAuth,upload,async  (req,res)=>{
     if (req.file){
        var imageFile = req.file.filename; 
        var userdetails = ({
            name : req.body.name,
            image : imageFile
        })
    }
    else {
        var userdetails = ({
            title : req.body.title,
            description : req.body.description,
        })
    }
    addBlogmodel.findByIdAndUpdate(req.params.id,userdetails,(err,items)=>{
        if(err){
            res.send(err)
        }
        else
        {
            res.redirect('/admin')
        }
    })
})

// only view 
router.get('/view',(req,res)=>{
    addBlogmodel.find((err,items)=>{
        if(err){
            res.send("sory we have some issuse")
        }
        else
        {
            res.render('view',{items:items.reverse()})
        }
    })
})
router.get('/viewfull/:id',(req,res)=>{
    addBlogmodel.findById(req.params.id,(err,items)=>{
        if(err){
            res.send("sory we have some issuse")
        }
        else
        {
            res.render('viewfull',{items:items})
        }
    })
})



module.exports = router
