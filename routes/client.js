const express = require('express')
const addBlogmodel = require('../db/addblog')
const router = express.Router();

router.get('/',(req,res)=>{
    // var limit = 3;
    addBlogmodel.find((err,items)=>{
        if(err){
            res.send("sory we have some issuse")
        }
        else
        {
            res.render('index',{items:items.reverse()})
        }
    })
})

router.get('/fullarticle/:id',(req,res)=>{
    
    addBlogmodel.findById(req.params.id,(err,items)=>{
        if(err){
            res.send("sory we have some issuse")
        }
        else
        {
            res.render('fullarticle',{items:items})
        }
    })
})

module.exports = router