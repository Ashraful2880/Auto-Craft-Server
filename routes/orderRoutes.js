const express = require("express");
const {
    makeOrder,
    getAllOrders,
    getUserOrders,
    deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", makeOrder); // Make an Order
router.get("/", getAllOrders); // Get All Orders
router.get("/myOrders/:email", getUserOrders); // Get Specific User Orders By Email
router.delete("/:id", deleteOrder); // Delete an Order

module.exports = router;
