const mongoose = require('mongose')
const objectId = mongoose.SchemaTypes.ObjectId

const postSchema = new mongoose.schema({
    userId:{
        type:[objectId],
        ref:User
    },
    post:{
        type:String,
        require:true,
        unique:true
    },
    comment:{
        type:[objectId],
        ref:Comment
    },
    totalComment:{
        type:Number,
        default:0
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isReply:{
        type:Boolean,
        default:false
    },{timestamp:true})

module.exports = mongoose.model('Post',postSchema)