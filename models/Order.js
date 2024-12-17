const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" },
    totalAmount: { type: Number, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
