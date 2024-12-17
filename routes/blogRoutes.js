const express=require('express');
const {
     getAllBlogs,
     getBlogById 
}  = require('../controllers/blogController');

const router=express.Router();

router.get('/',getAllBlogs); // Get All Blogs 
router.get('/:id',getBlogById); // Get Blog By ID 

module.exports=router;
