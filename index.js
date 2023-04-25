const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const SSLCommerzPayment = require("sslcommerz");

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

// Database Code Here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxp8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    // Database All Collections
    const database = client.db("carCollections");
    const carCollections = database.collection("allCars");
    const blogCollections = database.collection("blogs");
    const ratingCollections = database.collection("userRatings");
    const userCollections = database.collection("users");
    const OrderCollections = database.collection("allOrders");
    const branchCollection = database.collection("allDealers");

    // Get All Cars
    app.get("/allCars", async (req, res) => {
      const getCars = await carCollections.find({}).toArray();
      res.send(getCars);
    });

    // Get Cars With Pagination
    app.get("/cars", async (req, res) => {
      const limit = 6;
      const page = parseInt(req.query.page) || 1;
      const startIndex = (page - 1) * limit;
      const totalCars = await carCollections.countDocuments();
      const totalPages = Math.ceil(totalCars / limit);
      const getCars = await carCollections
        .find({})
        .skip(startIndex)
        .limit(limit)
        .toArray();
      res.send({
        cars: getCars,
        currentPage: page,
        totalPages: totalPages,
        totalCars: totalCars,
        totalPaginate: Math.round(totalCars / getCars?.length),
      });
    });

    // Get A Single Car Details
    app.get("/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const showOrder = await carCollections.findOne(query);
      res.json(showOrder);
    });

    // Make an Order Order
    app.post("/makeOrder", async (req, res) => {
      const newOrder = req.body;
      const result = await OrderCollections.insertOne(newOrder);
      res.json(result);
    });

    // Get All Testimonials
    app.get("/testimonials", async (req, res) => {
      const getUserRatings = await ratingCollections.find({}).toArray();
      res.send(getUserRatings);
    });

    // Get All Branches
    app.get("/branches", async (req, res) => {
      const getBranches = await branchCollection.find({}).toArray();
      res.send(getBranches);
    });

    // Get All Blogs
    app.get("/blogs", async (req, res) => {
      const getBlogs = await blogCollections.find({}).toArray();
      res.send(getBlogs);
    });

    // Get Single Blog By ID
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const getBlog = await blogCollections.findOne(query);
      res.json(getBlog);
    });

    // Dashboard All Route Here

    // Get All Orders
    app.get("/orders", async (req, res) => {
      const allOrders = await OrderCollections.find({}).toArray();
      res.json(allOrders);
    });

    // Get Specific User Orders By Email
    app.get("/myOrders/:email", async (req, res) => {
      const userEmail = req.params.email;
      const cursor = OrderCollections.find({ email: userEmail });
      const myOrder = await cursor.toArray();
      res.json(myOrder);
    });

    // View Single Order Details
    /*   app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleOrder = await OrderCollections.findOne(query);
      res.json(singleOrder);
    }); */

    // Find All Order Information For Specific User
    app.post("/findOrder", async (req, res) => {
      const bodyData = req.body;
      const products = await carCollections.find({}).toArray();
      const orderInformation = products?.filter((product) =>
        bodyData?.includes(new ObjectId(product?._id).toString())
      );
      res.json(orderInformation);
    });

    // Delete an Order

    app.delete("/deleteOrder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const remove = await OrderCollections.deleteOne(query);
      res.json(remove);
    });

    // Add New Product

    app.post("/addProduct", async (req, res) => {
      const addProduct = req.body;
      const result = await carCollections.insertOne(addProduct);
      res.json(result);
    });

    // Delete a Product
    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const remove = await carCollections.deleteOne(query);
      res.json(remove);
    });

    // Update a Product
    app.put("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateReq = req.body;
      const result = await carCollections.updateOne(
        query,
        {
          $set: {
            ...updateReq,
          },
        },
        { upsert: true }
      );
      res.json(result);
    });

    // Update Product Status
    app.put("/status/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { id: id };
      const updateStatus = { $set: { status: "Approve" } };
      const result = await OrderCollections.updateOne(filter, updateStatus, {
        upsert: true,
      });
      res.json(result);
    });

    // Post A Rating By User
    app.post("/addRating", async (req, res) => {
      const newRating = req.body;
      const result = await ratingCollections.insertOne(newRating);
      res.json(result);
    });

    // Save register User info
    app.post("/users", async (req, res) => {
      const newUsers = req.body;
      const result = await userCollections.insertOne(newUsers);
      res.json(result);
    });

    // Update Google Signin User info
    app.put("/users", async (req, res) => {
      const newUser = req.body;
      const filter = { email: newUser.email };
      const options = { upsert: true };
      const updateUser = { $set: newUser };
      const result = await userCollections.updateOne(
        filter,
        updateUser,
        options
      );
      res.json(result);
    });

    // Update Admin Role
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateAdmin = { $set: { role: "admin" } };
      const result = await userCollections.updateOne(filter, updateAdmin);
      res.json(result);
    });

    // Get Admin Data By Email
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const getAdmin = await userCollections.findOne(query);
      let isAdmin = false;
      if (getAdmin?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // SSL Commerz API
    /*   app.post("/init", async (req, res) => {
      const productInfo = {
        total_amount: req.body.total_amount,
        currency: "BDT",
        tran_id: uuidv4(),
        success_url: "https://mr-automative-car-center.netlify.app/success",
        fail_url: "https://mr-automative-car-center.netlify.app/home",
        cancel_url: "https://mr-automative-car-center.netlify.app/home",
        ipn_url: "https://mr-automative-car-center.netlify.app/ipn",
        paymentStatus: "pending",
        shipping_method: "Courier",
        product_name: req.body.product_name,
        product_category: "Electronic",
        product_profile: req.body.product_profile,
        product_image: req.body.product_image,
        cus_name: req.body.cus_name,
        cus_email: req.body.cus_email,
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: req.body.cus_name,
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
        multi_card_name: "mastercard",
        value_a: "ref001_A",
        value_b: "ref002_B",
        value_c: "ref003_C",
        value_d: "ref004_D",
      };
      const sslcommer = new SSLCommerzPayment(
        process.env.STORE_ID,
        process.env.STORE_PASSWORD,
        false
      );
      sslcommer.init(productInfo).then((data) => {
        const info = { ...productInfo, ...data };
        if (info.GatewayPageURL) {
          res.json(info.GatewayPageURL);
        } else {
          return res.status(400).json({
            message: "Payment Session Was Not Successful",
          });
        }
      });
    }); */

    // SSLCommerz Success API

    /*  app.post("/success", (req, res) => {
      res
        .status(200)
        .redirect(`https://mr-automative-car-center.netlify.app/success`);
    }); */

    // SSLCommerz Fail API

    /*    app.post("/fail", (req, res) => {
      res
        .status(400)
        .redirect(`https://mr-automative-car-center.netlify.app/home`);
    }); */

    // SSLCommerz Cancel API

    /*   app.post("/cancel", (req, res) => {
      res
        .status(200)
        .redirect(`https://mr-automative-car-center.netlify.app/home`);
    }); */
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Auto Craft");
});

app.listen(port, () => {
  console.log("Running Auto Craft", port);
});
