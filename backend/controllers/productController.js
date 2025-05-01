import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import mongoose from "mongoose"

// function for add product
const addProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            discountPrice,
            category, 
            subCategory,
            stock,
            bestseller,
            featured,
            newArrival,
            ingredients,
            nutrition,
            weight,
            shelfLife,
            storage,
            tags
        } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            image: imagesUrl,
            ...(discountPrice && { discountPrice: Number(discountPrice) }),
            ...(stock && { stock: Number(stock) }),
            bestseller: bestseller === "true" || bestseller === true ? true : false,
            featured: featured === "true" || featured === true ? true : false,
            newArrival: newArrival === "true" || newArrival === true ? true : false,
            ...(ingredients && { ingredients }),
            ...(nutrition && { nutrition }),
            ...(weight && { weight }),
            ...(shelfLife && { shelfLife }),
            ...(storage && { storage }),
            tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : []
        }

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added Successfully", product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for updating a product
const updateProduct = async (req, res) => {
    try {
        const { 
            id,
            name, 
            description, 
            price, 
            discountPrice,
            category, 
            subCategory,
            stock,
            bestseller,
            featured,
            newArrival,
            ingredients,
            nutrition,
            weight,
            shelfLife,
            storage,
            tags
        } = req.body

        // Validate if product exists
        const existingProduct = await productModel.findById(id)
        if (!existingProduct) {
            return res.json({ success: false, message: "Product not found" })
        }

        // Process images if uploaded
        let imagesUrl = existingProduct.image

        if (req.files) {
            const image1 = req.files.image1 && req.files.image1[0]
            const image2 = req.files.image2 && req.files.image2[0]
            const image3 = req.files.image3 && req.files.image3[0]
            const image4 = req.files.image4 && req.files.image4[0]

            const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

            if (images.length > 0) {
                imagesUrl = await Promise.all(
                    images.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                        return result.secure_url
                    })
                )
            }
        }

        const updatedProductData = {
            ...(name && { name }),
            ...(description && { description }),
            ...(price && { price: Number(price) }),
            ...(category && { category }),
            ...(subCategory && { subCategory }),
            image: imagesUrl,
            ...(discountPrice && { discountPrice: Number(discountPrice) }),
            ...(stock && { stock: Number(stock) }),
            ...(bestseller !== undefined && { bestseller: bestseller === "true" || bestseller === true ? true : false }),
            ...(featured !== undefined && { featured: featured === "true" || featured === true ? true : false }),
            ...(newArrival !== undefined && { newArrival: newArrival === "true" || newArrival === true ? true : false }),
            ...(ingredients && { ingredients }),
            ...(nutrition && { nutrition }),
            ...(weight && { weight }),
            ...(shelfLife && { shelfLife }),
            ...(storage && { storage }),
            ...(tags && { tags: typeof tags === 'string' ? JSON.parse(tags) : tags })
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            id, 
            updatedProductData,
            { new: true }
        )

        res.json({ success: true, message: "Product Updated Successfully", product: updatedProduct })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product with advanced filtering
const listProducts = async (req, res) => {
    try {
        const { 
            category, 
            subCategory, 
            search, 
            minPrice, 
            maxPrice, 
            sort, 
            bestseller, 
            featured, 
            newArrival,
            page = 1,
            limit = 20,
            tags
        } = req.query

        console.log("listProducts called with query params:", req.query);

        // Build query object
        let query = {}

        // Category filter
        if (category && category !== 'all') {
            query.category = category
        }

        // Sub-category filter
        if (subCategory && subCategory !== 'all') {
            query.subCategory = subCategory
        }

        // Search in name and description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        // Price range
        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice && !isNaN(minPrice)) query.price.$gte = Number(minPrice)
            if (maxPrice && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice)
        }

        // Product flags
        if (bestseller === 'true') query.bestseller = true
        if (featured === 'true') query.featured = true
        if (newArrival === 'true') query.newArrival = true

        // Tags filter
        if (tags && tags.trim() !== '') {
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
            if (tagsArray.length > 0) {
                query.tags = { $in: tagsArray }
            }
        }

        console.log("MongoDB query object:", query);

        // Count total before pagination
        const total = await productModel.countDocuments(query)

        // Build sort option
        let sortOption = { createdAt: -1 } // Default sort by createdAt, newest first
        if (sort) {
            switch (sort) {
                case 'price-asc':
                    sortOption = { price: 1 }
                    break
                case 'price-desc':
                    sortOption = { price: -1 }
                    break
                case 'name-asc':
                    sortOption = { name: 1 }
                    break
                case 'name-desc':
                    sortOption = { name: -1 }
                    break
                case 'bestselling':
                    sortOption = { totalSold: -1 }
                    break
            }
        }

        console.log("Sort option:", sortOption, "Page:", page, "Limit:", limit);

        // Pagination
        const pageNum = Number(page)
        const limitNum = Number(limit)
        const skip = (pageNum - 1) * limitNum

        let products = []
        let total = 0

        try {
            total = await productModel.countDocuments(query)
            products = await productModel
                .find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(limitNum)
        } catch (dbError) {
            console.error("Database query error in listProducts:", dbError.stack)
            // Return empty results on DB error to avoid 500
            return res.json({
                success: false,
                message: "Database query error",
                products: [],
                pagination: {
                    total: 0,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: 0
                }
            })
        }

        res.json({
            success: true, 
            products,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        })

    } catch (error) {
        console.error("Error in listProducts:", error.stack);
        res.status(500).json({ success: false, message: error.message });
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body
        
        if (!id) {
            return res.json({ success: false, message: "Product ID is required" })
        }
        
        const product = await productModel.findByIdAndDelete(id)
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }
        
        res.json({ success: true, message: "Product Removed Successfully" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        
        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" })
        }
        
        const product = await productModel.findById(productId)
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }
        
        res.json({ success: true, product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to get related products
const relatedProducts = async (req, res) => {
    try {
        const { productId, category, limit = 4 } = req.query
        
        if (!productId && !category) {
            return res.json({ success: false, message: "Product ID or category is required" })
        }
        
        let query = {}
        
        if (productId) {
            // Get the product's category
            const product = await productModel.findById(productId)
            if (!product) {
                return res.json({ success: false, message: "Product not found" })
            }
            
            query = { 
                category: product.category,
                _id: { $ne: productId } // Exclude the current product
            }
        } else if (category) {
            query = { category }
        }
        
        const products = await productModel
            .find(query)
            .limit(Number(limit))
            .sort({ totalSold: -1 }) // Sort by most sold
        
        res.json({ success: true, products })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to add product rating
const addRating = async (req, res) => {
    try {
        const { productId, rating, review } = req.body
        const userId = req.user._id
        
        if (!productId || !rating) {
            return res.json({ success: false, message: "Product ID and rating are required" })
        }
        
        const product = await productModel.findById(productId)
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }
        
        // Check if user already rated this product
        const existingRatingIndex = product.ratings.findIndex(
            r => r.userId.toString() === userId.toString()
        )
        
        if (existingRatingIndex !== -1) {
            // Update existing rating
            product.ratings[existingRatingIndex] = {
                userId,
                rating: Number(rating),
                review,
                date: Date.now()
            }
        } else {
            // Add new rating
            product.ratings.push({
                userId,
                rating: Number(rating),
                review,
                date: Date.now()
            })
        }
        
        await product.save()
        
        res.json({ success: true, message: "Rating added successfully", product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to get product categories with counts
const getCategories = async (req, res) => {
    try {
        const categories = await productModel.aggregate([
            { $group: { 
                _id: "$category", 
                count: { $sum: 1 },
                subCategories: { $addToSet: "$subCategory" }
            }},
            { $sort: { _id: 1 } }
        ])
        
        res.json({ success: true, categories })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Function to update product stock
const updateStock = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        
        if (!productId || quantity === undefined) {
            return res.json({ success: false, message: "Product ID and quantity are required" })
        }
        
        const product = await productModel.findById(productId)
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }
        
        product.stock = Math.max(0, product.stock - Number(quantity))
        product.totalSold = (product.totalSold || 0) + Number(quantity)
        
        await product.save()
        
        res.json({ success: true, message: "Stock updated successfully", product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { 
    listProducts, 
    addProduct, 
    updateProduct, 
    removeProduct, 
    singleProduct, 
    relatedProducts,
    addRating,
    getCategories,
    updateStock
}