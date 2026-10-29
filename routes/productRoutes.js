const express = require("express");
const { body, validationResult } = require("express-validator");
const Product = require("../models/product");

const router = express.Router();

// POST: Create a product
router.post(
    "/",
    [
        body("name")
            .isString()
            .withMessage("Product name must be text")
            .trim()
            .notEmpty()
            .withMessage("Product name is required"),

        body("price")
            .isFloat({ min: 0 })
            .withMessage("Price must be 0 or greater"),

        body("quantity")
            .isInt({ min: 0 })
            .withMessage("Quantity must be a whole number 0 or greater")
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array().map(error => ({
                        field: error.path,
                        message: error.msg
                    }))
                });
            }

            const product = await Product.create({
                name: req.body.name,
                price: Number(req.body.price),
                quantity: Number(req.body.quantity)
            });

            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                product
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to create product"
            });
        }
    }
);

 
 
// GET: Fetch all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
});


 
// GET: Fetch a single product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        // Check if product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Send the product
        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        // Handle invalid MongoDB IDs
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
});
 



module.exports = router;
