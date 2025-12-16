import { v2 as cloudinary } from "cloudinary"
import fs from 'fs/promises'
import fsSync from 'fs'
import productModel from "../models/productModel.js"
import mongoose from "mongoose"
import logger from "../config/logger.js"

// function for add product (supports both direct Cloudinary uploads via JSON and server-side uploads via multipart)
const addProduct = async (req, res) => {
    try {
        logger.info('Add product request body:', req.body);
        logger.info('Add product request files:', req.files ? Object.keys(req.files) : 'none');
        
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
            tags,
            image,
            images
        } = req.body

        // Try to use client-supplied image URLs first (from direct Cloudinary uploads)
        let imagesUrl = images || image || []
        
        logger.info('Extracted images field:', images);
        logger.info('Extracted image field:', image);
        logger.info('Initial imagesUrl:', imagesUrl, 'Type:', typeof imagesUrl);

        // If no URLs provided, try server-side upload from multipart files
        if (!imagesUrl || (Array.isArray(imagesUrl) && imagesUrl.length === 0)) {
            logger.info('No image URLs provided, checking for multipart files...');
            logger.info('req.files exists:', !!req.files, 'Type:', Array.isArray(req.files) ? 'array' : typeof req.files);
            
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                // When using upload.any(), files come as an array with 'fieldname' property
                logger.info('Total files in req.files:', req.files.length);
                
                // Log details of each file
                req.files.forEach((f, idx) => {
                    logger.info(`File ${idx}: fieldname=${f.fieldname}, filename=${f.filename}, mimetype=${f.mimetype}, path=${f.path}, size=${f.size}`);
                });
                
                const imageFiles = req.files.filter(f => f.fieldname && (f.fieldname.startsWith('image') || f.fieldname === 'mainImage'));
                logger.info('Found image files from multipart:', imageFiles.length);

                if (imageFiles.length > 0) {
                    try {
                        imagesUrl = await Promise.all(
                            imageFiles.map(async (file) => {
                                try {
                                    const filePath = file.path || '';
                                    logger.info(`[FILE] Fieldname: ${file.fieldname}`);
                                    logger.info(`[FILE] Filename: ${file.filename}`);
                                    logger.info(`[FILE] Path: ${filePath}`);
                                    logger.info(`[FILE] Size: ${file.size}`);
                                    logger.info(`[FILE] Mimetype: ${file.mimetype}`);
                                    
                                    // Check if file exists before uploading
                                    if (!filePath) {
                                        throw new Error('No file path provided');
                                    }
                                    
                                    // Check if file actually exists on disk
                                    const fileExists = fsSync.existsSync(filePath);
                                    logger.info(`[FILE] Exists on disk: ${fileExists}`);
                                    
                                    if (!fileExists) {
                                        throw new Error(`File not found on disk at: ${filePath}`);
                                    }
                                    
                                    logger.info(`[UPLOAD] Starting Cloudinary upload for: ${filePath}`);
                                    const result = await cloudinary.uploader.upload(filePath, { resource_type: 'image' });
                                    logger.info(`[UPLOAD] Success - Public ID: ${result.public_id}`);
                                    logger.info(`[UPLOAD] Success - URL: ${result.secure_url}`);
                                    
                                    // remove temporary file after uploading to Cloudinary
                                    try {
                                        await fs.unlink(filePath)
                                        logger.info(`[CLEANUP] Temp file deleted: ${filePath}`);
                                    } catch (err) {
                                        logger.error(`[CLEANUP] Failed to remove temp file: ${filePath} - ${err.message}`)
                                    }
                                    return result.secure_url
                                } catch (uploadErr) {
                                    logger.error(`[ERROR] Field: ${file.fieldname}`);
                                    logger.error(`[ERROR] Filename: ${file.filename}`);
                                    logger.error(`[ERROR] Message: ${uploadErr.message}`);
                                    logger.error(`[ERROR] Stack: ${uploadErr.stack}`);
                                    throw uploadErr;
                                }
                            })
                        )
                        logger.info('All files uploaded to Cloudinary successfully:', imagesUrl.length);
                    } catch (uploadErr) {
                        logger.error('Error uploading files to Cloudinary:', uploadErr.message);
                        return res.status(500).json({ success: false, message: "Failed to upload images to Cloudinary: " + uploadErr.message })
                    }
                }
            }
        }

        // Ensure imagesUrl is an array
        if (!Array.isArray(imagesUrl)) {
            imagesUrl = typeof imagesUrl === 'string' ? JSON.parse(imagesUrl) : []
        }
        
        logger.info('Final imagesUrl array:', imagesUrl, 'Length:', imagesUrl.length);
        
        if (imagesUrl.length > 0) {
            imagesUrl.forEach((url, idx) => {
                logger.info(`  Image ${idx}: ${url}`);
            });
        }

        if (imagesUrl.length === 0) {
            return res.status(400).json({ success: false, message: "At least one product image is required (upload via form or provide image URLs)" })
        }

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
        
        logger.info('Product saved successfully:', {
            id: product._id,
            name: product.name,
            images: product.image.length
        });

        res.json({ success: true, message: "Product Added Successfully", product })

    } catch (error) {
        logger.error('Add product error:', error.message);
        logger.error('Add product error stack:', error.stack);
        console.error('Add product error:', error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" })
    }
}

// function for updating a product (expects JSON payload with image URLs)
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
            tags,
            image,
            images
        } = req.body

        // Validate if product exists
        const existingProduct = await productModel.findById(id)
        if (!existingProduct) {
            return res.json({ success: false, message: "Product not found" })
        }

        // Process images from client (use provided URLs or keep existing)
        let imagesUrl = existingProduct.image
        if (images || image) {
            const provided = images || image
            imagesUrl = Array.isArray(provided) ? provided : (typeof provided === 'string' ? JSON.parse(provided) : existingProduct.image)
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
        logger.error('Update product error:', error.message);
        logger.error('Update product error stack:', error.stack);
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" })
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

        logger.info("listProducts called with query params:", req.query);

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

        logger.info("MongoDB query object:", query);

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

        logger.info("Sort option:", sortOption, "Page:", page, "Limit:", limit);

        // Pagination
        const pageNum = Number(page)
        const limitNum = Number(limit)
        const skip = (pageNum - 1) * limitNum

        let products = []

        products = await productModel
            .find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)

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
        logger.error("Error in listProducts:", error.stack);
        res.status(500).json({ success: false, message: error.message });
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.params
        
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