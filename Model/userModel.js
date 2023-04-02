const mongoose = require('mongose')

const userSchema = new mongoose.schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    phone:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        unique:true
    },
    posts:{
        type:[objectId],
        ref:'post'
    },
    {timestamp:true})

module.exports = mongoose.model('User',userSchema)