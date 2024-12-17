const {getDb}=require('../config/db');
const {ObjectId}=require('mongodb');

exports.getAllBlogs=async(req,res)=>{
     let blogs=[]; 
     try{
         let db=getDb(); 
         blogs=await db.collection('blogs').find({}).toArray(); 
     }catch(err){
         console.error(err); 
         return res.status(500).json({error:'Internal Server Error'}); 
     }
     return res.status(200).json(blogs); 
}

exports.getBlogById=async(req,res)=>{
     let blog=null; 
     try{
         let id=req.params.id; 
         let query={_id:ObjectId(id)}; 

         blog=await db.collection('blogs').findOne(query); 

     }catch(err){
         console.error(err); 
         return res.status(500).json({error:'Internal Server Error'}); 
     }
     return res.status(200).json(blog); 
}
