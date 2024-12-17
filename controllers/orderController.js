const { getDb } = require("../config/db");
const { ObjectId } = require("mongodb");

exports.makeOrder = async (req, res) => {
    const db = getDb();
    const newOrder = req.body;
    
    const result = await db.collection("allOrders").insertOne(newOrder);
    res.json(result);
};

exports.getAllOrders = async (req, res) => {
    const db = getDb();
    
    const allOrders = await db.collection("allOrders").find({}).toArray();
    res.json(allOrders);
};

exports.getUserOrders = async (req, res) => {
    const db = getDb();
    
    const userEmail = req.params.email;
    
    const myOrdersCursor = db.collection("allOrders").find({ email: userEmail });
    
    const myOrdersList= await myOrdersCursor.toArray();
    
   res.json(myOrdersList);
};

exports.deleteOrder= async (req, res) => {
   const db= getDb();
   
   const id= req.params.id;
   
   const result= await db.collection('allOrders').deleteOne({_id:ObjectId(id)});
   
   res.json(result);
}
