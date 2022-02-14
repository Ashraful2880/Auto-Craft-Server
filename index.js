const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors');
const fileUpload=require('express-fileupload');
const SSLCommerzPayment = require('sslcommerz');

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));


//<------------- Database Code Here ---------->

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxp8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    async function run() {
      try {
        await client.connect();

        //<------------ Database All Collections ------------->
        const database = client.db("carCollections");
        const carCollections = database.collection("allCars");
        const blogCollections = database.collection("blogs");
        const ratingCollections = database.collection("userRatings");
        const userCollections = database.collection("users");
        const OrderCollections = database.collection("allOrders");

        //<------------ Get All Cars From Database ------------->

        app.get('/allCars',async(req,res)=>{
          const getCars=await carCollections.find({}).toArray();
          res.send(getCars)
        }); 

        //<------------ Get Blogs Data From Database ------------->

        app.get('/blogs',async(req,res)=>{
          const getBlogs=await blogCollections.find({}).toArray();
          res.send(getBlogs)
        }); 
        //<------------ Get User Rating Data From Database ------------->

        app.get('/userRating',async(req,res)=>{
          const getUserRatings=await ratingCollections.find({}).toArray();
          res.send(getUserRatings)
        }); 

          //<------------ Post User Rating By User ------------->

        app.post('/addRating',async(req,res)=>{
          const name=req.body.name;
          const rating=req.body.rating;
          const comment=req.body.comment;
          const pic=req.files.image;
          const picData=pic.data;
          const encodedPic=picData.toString('base64');
          const imageBuffer=Buffer.from(encodedPic,'base64');
          const newRating={
            name,
            comment,
            start:rating,
            url:imageBuffer
          }
          const result=await ratingCollections.insertOne(newRating);
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
          const showOrder=await carCollections.findOne(query);
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
          res.json(remove)
        });

        //<------------Add New Product to Database ------------>

        app.post('/addProduct',async(req,res)=>{
          const addProduct=req.body;
          const result=await carCollections.insertOne(addProduct);
          res.json(result); 
          
        })

        //<------------ Delete a Product From DB By Admin ------------>

        app.delete('/deleteProduct/:id',async(req,res)=>{
          const id=req.params.id;
          const query={_id:ObjectId(id)}
          const remove=await carCollections.deleteOne(query);
          res.json(remove)
        });

        //<----------- SSL Commerz API----------->

        app.post('/init', async (req, res) => {
          console.log("hitting")
          const productInfo = {
              total_amount: req.body.total_amount,
              currency: 'BDT',
              tran_id: uuidv4(),
              success_url: 'http://localhost:5000/success',
              fail_url: 'http://localhost:5000/failure',
              cancel_url: 'http://localhost:5000/cancel',
              ipn_url: 'http://localhost:5000/ipn',
              paymentStatus: 'pending',
              shipping_method: 'Courier',
              product_name: req.body.product_name,
              product_category: 'Electronic',
              product_profile: req.body.product_profile,
              product_image: req.body.product_image,
              cus_name: req.body.cus_name,
              cus_email: req.body.cus_email,
              cus_add1: 'Dhaka',
              cus_add2: 'Dhaka',
              cus_city: 'Dhaka',
              cus_state: 'Dhaka',
              cus_postcode: '1000',
              cus_country: 'Bangladesh',
              cus_phone: '01711111111',
              cus_fax: '01711111111',
              ship_name: req.body.cus_name,
              ship_add1: 'Dhaka',
              ship_add2: 'Dhaka',
              ship_city: 'Dhaka',
              ship_state: 'Dhaka',
              ship_postcode: 1000,
              ship_country: 'Bangladesh',
              multi_card_name: 'mastercard',
              value_a: 'ref001_A',
              value_b: 'ref002_B',
              value_c: 'ref003_C',
              value_d: 'ref004_D'
          };
          const sslcommer = new SSLCommerzPayment(process.env.STORE_ID,process.env.STORE_PASSWORD,false)
          sslcommer.init(productInfo).then(data => {
            const info = { ...productInfo, ...data }
            console.log(info);
            if (info.GatewayPageURL) {
                res.json(info.GatewayPageURL)
            }
            else {
                return res.status(400).json({
                    message: "Payment Session Was Not Successful"
                })
            }
        });
      });

          //<-------- SSLCommerz Success API------------>

      app.post('/success', (req,res)=>{
        res.status(200).redirect(`http://localhost:3000/dashboard/success`);
      })

         //<-------- SSLCommerz Fail API------------>

      app.post('/fail', (req,res)=>{
        res.status(400).redirect(`http://localhost:3000/dashboard/myOrders`);
      })

        //<-------- SSLCommerz Cancel API------------>

      app.post('/cancel', (req,res)=>{
        res.status(200).redirect(`http://localhost:3000/dashboard/myOrders`);
      })
        
      } finally {
        // await client.close();
      }
    }
    run().catch(console.dir);
    
    app.get('/',(req,res)=>{
      res.send('Running Mr.Automotive Server')
    });


app.listen(port,()=>{
    console.log("Running Server Port is",port);
});