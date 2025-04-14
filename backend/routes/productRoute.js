import express from 'express'
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
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';

const productRouter = express.Router();

// Admin routes
productRouter.post('/add', adminAuth, upload.fields([
  {name:'image1', maxCount:1},
  {name:'image2', maxCount:1},
  {name:'image3', maxCount:1},
  {name:'image4', maxCount:1}
]), addProduct);

productRouter.post('/update', adminAuth, upload.fields([
  {name:'image1', maxCount:1},
  {name:'image2', maxCount:1},
  {name:'image3', maxCount:1},
  {name:'image4', maxCount:1}
]), updateProduct);

productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/update-stock', adminAuth, updateStock);

// Public routes
productRouter.get('/list', listProducts);
productRouter.post('/single', singleProduct);
productRouter.get('/related', relatedProducts);
productRouter.get('/categories', getCategories);

// User routes
productRouter.post('/rating', userAuth, addRating);

export default productRouter