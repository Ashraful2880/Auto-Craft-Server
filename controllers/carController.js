const { getDb } = require("../config/db");
const { ObjectId } = require("mongodb");

exports.getAllCars = async (req, res) => {
    const db = getDb();
    const cars = await db.collection("allCars").find({}).toArray();
    res.send(cars);
};

exports.getCarsWithPagination = async (req, res) => {
    const db = getDb();
    const limit = 6;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * limit;
    
    const totalCars = await db.collection("allCars").countDocuments();
    const totalPages = Math.ceil(totalCars / limit);
    
    const cars = await db.collection("allCars")
        .find({})
        .skip(startIndex)
        .limit(limit)
        .toArray();
        
    res.send({ cars, currentPage: page, totalPages, totalCars });
};

exports.getCarById = async (req, res) => {
    const db = getDb();
    const id = req.params.id;
    const car = await db.collection("allCars").findOne({ _id: ObjectId(id) });
    res.json(car);
};

exports.addProduct = async (req, res) => {
    const db = getDb();
    const newProduct = req.body;
    const result = await db.collection("allCars").insertOne(newProduct);
    res.json(result);
};

exports.updateProduct = async (req, res) => {
    const db = getDb();
    const id = req.params.id;
    const updateReq = req.body;
    
    const result = await db.collection("allCars").updateOne(
        { _id: ObjectId(id) },
        { $set: updateReq },
        { upsert: true }
    );
    
    res.json(result);
};

exports.deleteProduct = async (req, res) => {
    const db = getDb();
    const id = req.params.id;
    
    const result = await db.collection("allCars").deleteOne({ _id: ObjectId(id) });
    res.json(result);
};
