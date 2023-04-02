const postModel=require('../models/postModel')
const { uploadFile } = require('../Middleware/aws')
const commentModel=require('../models/commentModel')
const mongoose=require('mongoose')
const userModel = require('../models/userModel')


const createComment= async function(req,res){
    let data= req.body
    let postId=req.body.postId
    // const file = req.files
    if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})

    
    if(!postId)return res.status(400).send({status:false,message:"post Id missing"})
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).send({ status: false, message: "invalid postId" })
    let post=await postModel.findOne({_id:postId,isDeleted:false}).populate('comment')
    if(!post) return res.status(404).send({status:false,message:"post not found"})

    if(!data.userId)return res.status(400).send({status:false,message:"userId missing"})
    if (!mongoose.Types.ObjectId.isValid(data.userId)) return res.status(400).send({ status: false, message: "invalid userId" })
    let user= await userModel.findOne({_id:data.userId})
    if(!user) return res.status(404).send({status:false,message:"user not found"})

    if(!data.message)return res.status(400).send({status:false,message:"message is required"})
    // data.postId=postId

    if(data.replyTo){
        if (!mongoose.Types.ObjectId.isValid(data.replyTo)) return res.status(400).send({ status: false, message: "comment id is not valid for reply" })
        data.isReply=true
    }
    if(!data.replyTo)delete data.replyTo

    const saveComment= await commentModel.create(data)
    res.status(201).send({status:true,message:"successfully created",data:saveComment})

    let comment= post.comment
    comment.push(saveComment._id)
    let count=0
    for(let i=0;i<comment.length;i++){
        if(comment[i].isDeleted==false)count++
    }
    await postModel.findByIdAndUpdate(postId,{comment:comment,totalComment:count})    
}

const editComment =async function(req,res){
    const postId=req.body.postId
    const commentId=req.body.commentId
    const msg=req.body.message
    if(!postId)return res.status(400).send({status:false,message:"post id is required"})
    if(!commentId)return res.status(400).send({status:false,message:"post id is required"})

    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).send({ status: false, message: "invalid commentId" })
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).send({ status: false, message: "invalid postId" })

    const post =await postModel.findOne({_id:postId,isDeleted:false})
    if(!post)return res.status(404).send({status:false,message:"post not found"})

    if(!commentId)return res.status(400).send({status:false,message:"comment id is required"})
    const comment= await commentModel.findOne({_id:commentId,isDeleted:false})
    if(!comment)return res.status(400).send({status:false,message:"there is no any comment with this id"})

    if(!msg)return res.status(400).send({status:false,message:"msg is required"})
    if(req.userId!=comment.userId)return res.status(403).send({status:false,message:"you are not authorised edit this comment"})

    const updatedComment= await commentModel.findByIdAndUpdate(commentId,{message:msg},{new:true})
    res.status(200).send({status:true,message:"updated successfully",data:updatedComment})

}
const deleteComment= async function(req,res){
    const postId= req.body.postId
    const commentId=req.body.commentId

    if(!postId)return res.status(400).send({status:false,message:"post id is required"})
    if(!commentId)return res.status(400).send({status:false,message:"post id is required"})
    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).send({ status: false, message: "invalid commentId" })
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).send({ status: false, message: "invalid postId" })

    const post=await postModel.findOne({_id:postId,isDeleted:false})
    if(!post)return res.status(404).send({status:false,message:"post not found"})

    if(!commentId)return res.status(400).send({status:false,message:"comment id is required"})
    const comment= await commentModel.findOne({_id:commentId,isDeleted:false})
    if(!comment)return res.status(400).send({status:false,message:"there is no any comment with this id"})

    if(req.userId!=comment.userId)return res.status(403).send({status:false,message:"you are not authorised delete this comment"})

    await commentModel.findByIdAndUpdate(commentId,{isDeleted:true})

    res.status(200).send({status:true,message:"comment deleted successfully"})

    let count = post.totalComment
    await postModel.findByIdAndUpdate(postId,{totalComment:count-1})


}


module.exports={createComment, deleteComment, editComment}