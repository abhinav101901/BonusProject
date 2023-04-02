const express=require("express")
const router=express.Router()
const {createUser,login} =require("../controllers/userController")
const {createPost,deletePost,getPosts,getPostById} =require("../controllers/postController")
const {authentication, userAuthorization} =require('../middlewares/auth')
const {createComment, deleteComment, editComment} =require('../controllers/commentController')

router.get("/",function(req,res){
    res.send({message:"succsessfull"})
})


router.post("/createUser",createUser)
router.post("/login",login)


router.post('/createPost',authentication,createPost)
router.delete("/deletePost",authentication,deletePost)
router.get("/getposts",authentication,getPosts)
router.post("/getPostById",authentication,getPostById)

router.post('/createComment',authentication,createComment)
router.put('/editComment',authentication,editComment)
router.delete('/deleteComment',authentication,deleteComment)

moduel.exports=router