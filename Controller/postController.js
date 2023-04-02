const postModel=require('../models/postModel')
const { uploadFile } = require('../Middleware/aws')
const userModel=require('../models/userModel')
const mongoose=require('mongoose')

const createPost= async function(req,res){
    let data= req.body
    const file = req.files
    if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})

    if(!data.userId)return res.status(400).send({status:false,message:"userId is required"})
    if (!mongoose.Types.ObjectId.isValid(data.userId)) return res.status(400).send({ status: false, message: "invalid userId" })
    let user=await userModel.findById(data.userId)
    if(!user) return res.status(404).send({status:false,message:"user not found"})

    if (file.length == 0) return res.status(400).send({ status: false, message: "postImage is mandatory" })
    const imageUrl = await uploadFile(file[0])
    data.postImage = imageUrl

    const savePost= await postModel.create(data)
    res.status(201).send({status:true,message:"successfully created",data:savePost})

    let posts= user.posts
    posts.push(savePost._id)
    await userModel.findByIdAndUpdate(data.userId,{posts:posts})

    
}
const deletePost= async function(req,res){
    const postId= req.body.postId
    console.log(postId)
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).send({ status: false, message: "invalid post id" })
    const post= await postModel.findOne({_id:postId,isDeleted:false})
    if(!post)return res.status(400).send({status:false,message:"there is no any post with this id"})

    if(req.userId!=post.userId)return res.status(403).send({status:false,message:"you are not authorised delete this post"})

    await postModel.findByIdAndUpdate(postId,{isDeleted:true})
    
    return res.status(200).send({status:true,message:"post deleted successfully"})
}

const getPosts=async function(req,res){
    const data = await postModel.find({isDeleted:false}).populate(["userId","comment"])
    res.status(200).send({status:true,message:"data fetch successfully",data:data})
    
}

const getPostById =async function(req,res){
    const postId= req.body.postId
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).send({ status: false, message: "invalid post id" })
    const post= await postModel.findOne({_id:postId,isDeleted:false}).populate(['userId','comment']).populate({path:'comment',populate:['userId']})
    if(!post)return res.status(400).send({status:false,message:"there is no any post with this id"})

    return res.status(200).send({status:true,message:"post by id",data:post})

}


module.exports={createPost,deletePost,getPosts,getPostById}
