const {getDb}  = require('../config/db');
const {ObjectId}=require('mongodb');

exports.saveUser=async(req,res)=>{
    const db=getDb();
    const newUser=req.body;

    const result=await db.collection('users').insertOne(newUser);

    res.json(result);
}

exports.updateUser=async(req,res)=>{
    const db=getDb();
    const updatedUser=req.body;

    const filter={email:updatedUser.email};
    const options={upsert:true};
    const result=await db.collection('users').updateOne(filter,{ $set: updatedUser }, options);

    res.json(result);
}

exports.getUsers=async(req,res)=>{
    const db=getDb();

    const usersList=await db.collection('users').find({}).toArray();

    res.json(usersList);
}

exports.updateAdminRole=async(req,res)=>{
    const db=getDb();
    const user=req.body;

    const filter={email:user.email};
    const updateAdmin={$set:{role:'Admin'}};

    await db.collection('users').updateOne(filter,updateAdmin);

    res.json({message:'Role Updated to Admin'});
}

exports.checkAdminStatus=async(req,res)=>{
      let isAdmin=false; 
      const email=req.params.email; 
      
      const query={email:email}; 
      
      const adminData=await db.collection('users').findOne(query); 

      if(adminData?.role==='Admin'){
         isAdmin=true; 
      }

      res.json({admin:isAdmin}); 
}
