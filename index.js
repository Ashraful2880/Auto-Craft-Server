const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors');

app.use(cors());
app.use(express.json());


//<------------- Database Code Here ---------->

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxp8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    async function run() {
      try {
        await client.connect();

        //<------------ Database All Collections ------------->
        const database = client.db("carCollections");
        const getAllCars = database.collection("allCars");
        const getAllBlogs = database.collection("blogs");
        const getRatings = database.collection("userRatings");
        const userCollections = database.collection("users");
        const OrderCollections = database.collection("allOrders");

        //<------------ Get All Cars From Database ------------->

        app.get('/allCars',async(req,res)=>{
          const getCars=await getAllCars.find({}).toArray();
          res.send(getCars)
        }); 

        //<------------ Get Blogs Data From Database ------------->

        app.get('/blogs',async(req,res)=>{
          const getBlogs=await getAllBlogs.find({}).toArray();
          res.send(getBlogs)
        }); 
        //<------------ Get User Rating Data From Database ------------->

        app.get('/userRating',async(req,res)=>{
          const getUserRatings=await getRatings.find({}).toArray();
          res.send(getUserRatings)
        }); 

          //<------------ Post User Rating By User ------------->

        app.post('/addRating',async(req,res)=>{
          const receiveRating=req.body;
          const result=await getRatings.insertOne(receiveRating);
          res.json(result); 
          
        })

      //<--------------- Send Orders Data to Database ----------------->

        app.post('/purchaseConfirm', async(req,res)=>{
          const newOrder=req.body;
          const result=await OrderCollections.insertOne(newOrder);
          res.json(result);
        }); 

        //---------> Get Order Information From DB---------->

        app.get('/order/:id',async(req,res)=>{
          const id=req.params.id;
          const query={_id:ObjectId(id)};
          const showOrder=await getAllCars.findOne(query);
          res.json(showOrder);          
        })
        
         //<----------- Get Data By Emil From DB ------------>

         app.get('/myOrders/:email',async(req,res)=>{
          const userEmail=req.params.email;
          const cursor= OrderCollections.find({email:userEmail});
          const myOrder=await cursor.toArray();
          res.json(myOrder);
        });

        //<-------- Delete an Order From My Order Page --------->

        app.delete('/deleteOrder/:id',async(req,res)=>{
          const id=req.params.id;
          const query={_id:ObjectId(id)}
          const remove=await OrderCollections.deleteOne(query);
          res.json(remove)
        }); 

        //<--------------- Send register User info to Database----------------->

        app.post('/users', async(req,res)=>{
          const newUsers=req.body;
          const result=await userCollections.insertOne(newUsers);
          res.json(result);
        }); 

        //<--------------- Update Google Sign User info to Database----------------->

        app.put('/users', async(req,res)=>{
          const newUser=req.body;
          const filter={email:newUser.email}
          const options={upsert: true};
          const updateUser={$set:newUser}
          const result=await userCollections.updateOne(filter,updateUser,options);
          res.json(result);
        }); 

        //<--------------- Update Admin Role to Database----------------->

        app.put('/users/admin', async(req,res)=>{
          const user=req.body;
          const filter={email:user.email}
          const updateAdmin={$set:{role:'admin'}}
          const result=await userCollections.updateOne(filter,updateAdmin);
          res.json(result);
        }); 

         //<------------ Get Admin Data From Database ------------->

         app.get('/user/:email',async(req,res)=>{
           const email=req.params.email;
           const query={email:email};
          const getAdmin=await userCollections.findOne(query);
          let isAdmin=false
          if(getAdmin?.role === 'admin'){
            isAdmin=true;
          }
          res.json({admin:isAdmin})
        }); 


        // Get All Orders From database

        app.get('/manageOrders',async(req,res)=>{
          const allOrders=await OrderCollections.find({}).toArray();
          res.json(allOrders)
        });

        //<------------ Delete Order From Manage Order By Admin ------------>

        app.delete('/deleteOrder/:id',async(req,res)=>{
          const id=req.params.id;
          const query={_id:ObjectId(id)}
          const remove=await OrderCollections.deleteOne(query);
          console.log(remove);
          res.json(remove)
        });

 //<------------ Product Add to Database ------------>

        app.post('/addProduct',async(req,res)=>{
          const addProduct=req.body;
          const result=await getAllCars.insertOne(addProduct);
          res.json(result); 
          
        })









      } finally {
        // await client.close();
      }
    }
    run().catch(console.dir);
    
    app.get('/',(req,res)=>{
      res.send('Running AI Auto Cars Server')
    });


app.listen(port,()=>{
    console.log("Running Server Port is",port);
});