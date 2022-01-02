const express = require('express')
const bcrypt = require('bcrypt')
const userModel = require('../db/adminauth')
const admin = require('../routes/admin')



const isAuth = (req,res,next)=>{
    if(req.session.isAuth){
        next()
    }
    else{
        res.redirect('/login')
    }
}
const router = express.Router();
router.get('/register',(req,res)=>{
    res.render('register')
})
router.get('/login',(req,res)=>{
    res.render('login')
})
router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            res.send("error")
        }
        else{
            res.redirect('/')
        }
    })
})



router.post('/register',async (req,res)=>{
    const {username,password}=req.body;
    let user =  await userModel.findOne({username})
    if(user){
        return res.redirect('/login')
    }
    const hashpsw = await bcrypt.hash(password,12)
    user = new userModel({
        username,
        password:hashpsw
    })
    await user.save();
    res.redirect('/login')
})

router.use(admin)

router.post('/login',async (req,res)=>{
    const {username,password}=req.body;
    let user = await userModel.findOne({username})
    if(!user){
        return res.redirect('/register')
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.redirect('/login')
    }
    req.session.isAuth = true;
    res.redirect('/admin')
})





module.exports = router