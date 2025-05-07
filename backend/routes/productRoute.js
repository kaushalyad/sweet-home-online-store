import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import { 
  listProducts, 
  addProduct, 
  updateProduct, 
  removeProduct, 
  singleProduct, 
  relatedProducts,
  addRating, 
  getCategories,
  updateStock
} from '../controllers/productController.js'
import { upload } from '../middleware/uploadMiddleware.js'
import userAuth from '../middleware/userAuth.js'

const productRouter = express.Router()

// Public routes
productRouter.get('/list', listProducts)
productRouter.get('/single/:id', singleProduct)
productRouter.get('/related/:id', relatedProducts)
productRouter.get('/categories', getCategories)

// Protected admin routes
productRouter.use(protect, admin)
productRouter.post('/add', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), addProduct)

productRouter.put('/:id', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), updateProduct)

productRouter.delete('/:id', removeProduct)
productRouter.put('/:id/stock', updateStock)

// User routes
productRouter.post('/rating', userAuth, addRating)

export default productRouter