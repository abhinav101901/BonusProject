const mongoose = require('mongose')
const objectId = mongoose.SchemaTypes.ObjectId

const commentSchema = new mongoose.schema({
    userId:{
        type:objectId,
        ref:User
    },
    postId:{
        type:objectId,
        ref:User
    },
    commentString,
    isReply:{
        type:Boolean,
        default:false
    },
    reply:String,
    message:String,
    replyTo:{      
        type:objectId,
        ref:'comment'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
    ,{timestamp:true})

module.exports = mongoose.model('Comment',commentSchema)