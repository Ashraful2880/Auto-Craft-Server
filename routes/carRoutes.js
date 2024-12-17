const express = require("express");
const {
    getAllCars,
    getCarsWithPagination,
    getCarById,
    addProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/carController");

const router = express.Router();

router.get("/", getAllCars);
router.get("/pagination", getCarsWithPagination);
router.get("/:id", getCarById);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
