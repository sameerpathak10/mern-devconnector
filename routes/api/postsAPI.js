const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/ProfileModel');
const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');
const {check, validationResult} = require('express-validator');

// @route   POST api/posts
// @desc    Add user post
// @access  Public

router.post(
    '/',auth,
    check('text','Text is required').not().isEmpty(), 
    async(req,res)=> {
    try{
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            return res.status(400).json({ errors : validationErrors.array()});
        }
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name : user.name,
            avatar : user.avatar,
            user : req.user.id
        });

        const post = await newPost.save();

        return res.json(post);

    }
    catch(error){
        console.error(err.message);
        return res.status(500).json(`Server Error: ${error.message}`);
    }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  PRivate

router.get('/',auth, async(req,res)=>{
    try{
        const posts= await Post.find().sort({date:-1});
        res.json(posts);
    }
    catch(error){
        console.error(err.message);
        return res
            .status(500)
            .json(`Server Error: ${error.message}`);
    }
});


// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private

router.get('/:postId',auth, async(req,res)=>{
    try{
        const post= await Post.findById(req.params.postId);
        if(!post){
            return res.status(404).json('Post not found');
        }
        res.json(post);
    }
    catch(error){
        console.error(err.message);
  
        return res.status(500).json(`Server Error: ${error.message}`);
    }
});


// @route   DELETE api/posts/:id
// @desc    delete post by id
// @access  Private

router.delete('/:postId',auth, async(req,res)=>{
    try{
        const post= await Post.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
          }
        //Check user
        if(post.user.toString() == req.user.id){
            return res.status(401).json('User not authorised');
        }

        await post.remove();

        res.json({msg: 'Post removed'});
    }
    catch(error){
        console.error(err.message);
        return res.status(500).json(`Server Error: ${error.message}`);
    }
});



// @route   PUT api/posts/like/:postId 
// @desc    Like a post
// @access  Public

router.put('/like/:postId',auth, async(req,res)=> {
    try{
       
        const post = await Post.findById(req.params.postId);
        
        //Check if user already liked the post
        if(post.likes.filter(like=> like.user.toString() == req.user.id).length>0){
            return res.status(400).json('Post already liked');
        }
        post.likes.unshift({ user : req.user.id});
        await post.save();

        return res.json(post.likes);

    }
    catch(error){
        console.error(err.message);
        return res.status(500).json(`Server Error: ${error.message}`);
    }
});


// @route   PUT api/posts/unlike/:id 
// @desc    Unlike a post
// @access  Public

router.put('/unlike/:postId',auth, async(req,res)=> {
    try{
       
        const post = await Post.findById(req.params.postId);
        
        //Check if user already liked the post
        if(post.likes.filter(like=> like.user.toString() == req.user.id).length==0){
            return res.status(400).json({ msg: 'Post has not yet been liked'});
        }
        
        const removeIndex = post.likes.map(like=> like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex,1);

        await post.save();

        return res.json(post.likes);

    }
    catch(error){
        console.error(err.message);
        return res.status(500).json(`Server Error: ${error.message}`);
    }
});


// @route   POST api/posts/comment/:id
// @desc    Add user comment on post
// @access  Public

router.put('/comment/:postId',
    auth,
    check('text','Text is required').not().isEmpty(), 
    async(req,res)=> {
    try{
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            return res.status(400).json({ errors : validationErrors.array()});
        }
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.postId);
        const comment = {
            text: req.body.text,
            name : user.name,
            avatar : user.avatar,
            user : req.user.id
        };
        post.comments.unshift(comment);
        await post.save();

        return res.json(post.comments);

    }
    catch(error){
        console.error(err.message);
        return res.status(500).json(`Server Error: ${error.message}`);
    }
});


// @route   DELETE api/posts/:postId/comment/:commentId
// @desc    Add user comment on post
// @access  Public

router.post('/:postId/comment/:commentId',auth, async(req,res)=> {
    try{
        //Get Post
        const post = await Post.findById(req.params.postId);

        //Make sure post exists
        if(!post){
            return res.status(400).json('Post does not exists.');
        }
        //Pull out comment
        const comment = post.comments.find(comment=> comment.id == req.params.commentId);
        
        //Make sure comment exists
        if(!comment){
            return res.status(400).json('Comment does not exists.');
        }

        //Check if this is user's comment
        if(comment.user.toString() !== req.user.id){
            return res.status(400).json({ user : 'User not authorised.'});
        }

        const removeIndex = post.comments
            .map(comment=>comment.user.toString())
            .indexOf(req.user.id);
        post.comments.splice(removeIndex,1);
        await post.save();

        return res.json(post.comments);

    }
    catch(error){
        console.error(err.message);
        return res.status(500).json(`Server Error: ${error.message}`);
    }
});

module.exports = router;