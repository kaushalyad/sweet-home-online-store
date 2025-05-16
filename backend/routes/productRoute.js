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

// Protected user routes
productRouter.post('/rate', protect, addRating)

// Protected admin routes
productRouter.use(protect, admin)
productRouter.post('/add', upload.array('images', 5), addProduct)
productRouter.put('/update/:id', upload.array('images', 5), updateProduct)
productRouter.delete('/remove/:id', removeProduct)
productRouter.put('/stock/:id', updateStock)

export default productRouter