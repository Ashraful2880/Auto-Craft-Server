const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if using OAuth or other auth methods.
    role: { type: String, default: "User" }, // Can be 'Admin' or 'User'
});

module.exports = mongoose.model("User", userSchema);
