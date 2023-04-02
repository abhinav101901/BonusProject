const userModel = require("../Model/userModel")
conat validator = require('validator')
const jwt=require('jsonwebtoken')

const indianPhoneNumberRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
const createUser =async function(req,res){
    let data= req.body
    if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})

    if(!data.name) return res.status(400).send({status:false,message:"name is required"})

    if(!data.email) return res.status(400).send({status:false,message:"Email is required"})
    if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, message: "please enter valid email address!" })
    const isEmailExist= await userModel.findOne({email:data.email})
    if(isEmailExist) return res.status(400).send({status:false,message:"email alredy exist"})

    if(!data.phone) return res.status(400).send({status:false,message:"phone is required"})
    if (!indianPhoneNumberRegex.test(phone)) return res.status(400).send({status:false,message:"phone is Invalid"})
    const isPhoneExist= await userModel.findOne({phone:data.phone})
    if(isPhoneExist) return res.status(400).send({status:false,message:"Phone alredy exist"})

    if(!data.password) return res.status(400).send({status:false,message:"password is required"})
    if(!validator.isStrongPassword(data.password)) return res.status(400).send({status:false,message:"Please enter some Upper case,Lower Case,and spaceal Characters"})

    const saveData =await userModel.create(data)
    res.status(201).send({status:true,message:"user created successfully",data:saveData})
}

const login =async function(req,res){
    let data= req.body
    if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})

    if(!data.email) return res.status(400).send({status:false,message:"name is required"})
    if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, message: "please enter valid email address!" })

    if(!data.password) return res.status(400).send({status:false,message:"name is required"})
    if(!validator.isStrongPassword(data.password)) return res.status(400).send({status:false,message:"Please enter some Upper case,Lower Case,and spaceal Characters"})

    let user= await userModel.findOne({email:data.email,password:data.password})
    if(!user) return res.status(401).send({status:false,message:"email id or password is worng"})

    let token= jwt.sign({userId:user._id},"Abhinav",{expiresIn: '24h'})
    return res.status(200).send({status:true,message:"success",userId:user._id,token:token})
}

module.exports={createUser,login}
