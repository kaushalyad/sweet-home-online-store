# Sweet Home Online Store - Technical Implementation Guide

## Part 1: Current System Architecture Diagrams

### Frontend Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend (Vite)                     │
│                        HashRouter Routing                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐   │
│  │   Home.jsx   │      │Collection.jsx│      │Product.jsx   │   │
│  │  (Landing)   │      │(Listing)     │      │(Details)     │   │
│  └──────────────┘      └──────────────┘      └──────────────┘   │
│      ↓                      ↓                       ↓            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              ShopContext (Global State)                  │   │
│  │  Products, User, Cart, Wishlist, Auth Token             │   │
│  └──────────────────────────────────────────────────────────┘   │
│      ↓                      ↓                       ↓            │
│  ┌──────────────┐   ┌──────────────┐    ┌──────────────┐        │
│  │ ProductItem  │   │  SEOHead     │    │  Reviews UI  │        │
│  │ Component    │   │  Component   │    │  Component   │        │
│  └──────────────┘   └──────────────┘    └──────────────┘        │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                     Axios HTTP Client                             │
│             (baseURL: ${backendUrl}/api)                          │
├─────────────────────────────────────────────────────────────────┤
│                  React Helmet for Meta Tags                       │
│         (Dynamic titles, OG tags, Twitter cards)                  │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                     Express.js Server                             │
│                     (Port: 4000)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Route Handlers                              │   │
│  │  /products  /reviews  /orders  /user  /cart  /wishlist   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Controllers                                 │   │
│  │  Product  Review  Order  User  Cart  Upload  Analytics   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Middleware                                  │   │
│  │  auth  errorHandler  trackUserBehavior  multer           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Data Models                                 │   │
│  │  Product  User  Order  Review  Address  Coupon           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              MongoDB Database                            │   │
│  │  Collections: products, users, orders, addresses...      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              External Services                           │   │
│  │  Cloudinary (Images)  Stripe/Razorpay (Payments)        │   │
│  │  Gmail (Email)  Google Maps (GeoCoding)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Product Review Data Flow
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend - Product.jsx                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User clicks "Add Review" → Opens modal                  │
│  2. Sets rating (1-5 stars)                                 │
│  3. Enters comment text                                      │
│  4. Selects images/videos (optional)                        │
│                                                               │
│  5. Click "Submit Review"                                   │
│     ↓                                                        │
│  6. Upload media to Cloudinary                              │
│     - Get signature from backend                            │
│     - Direct upload: POST to Cloudinary API                │
│     - Returns: URL, type, publicId                         │
│     ↓                                                        │
│  7. POST /api/reviews/product/:productId                    │
│     Headers: Authorization: Bearer {token}                 │
│     Body: {rating, comment, media: [{url, type, publicId}]} │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│            Backend - reviewController.addProductReview      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Validate rating (1-5)                                   │
│  2. Check userId: previous review exists? (prevent dup)     │
│  3. Check verified purchase:                                │
│     - Query user's paid orders                             │
│     - Match product ID in order items                      │
│     - Set verifiedPurchase flag                            │
│  4. Add review to product.reviews array                     │
│  5. Call product.recalculateRating()                        │
│     - Sum all review ratings                              │
│     - Calculate average                                     │
│     - Update product.rating & product.totalReviews          │
│  6. Save product document                                   │
│  7. Return: {success: true, message: "Review saved"}        │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│              MongoDB - ProductModel                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  products collection:                                       │
│  {                                                           │
│    _id: ObjectId,                                           │
│    name: "Kaju Katli",                                      │
│    price: 500,                                              │
│    rating: 4.6,          ← Updated                         │
│    totalReviews: 25,     ← Updated                         │
│    reviews: [                                               │
│      {                                                       │
│        userId: ObjectId,                                    │
│        rating: 5,                                           │
│        comment: "Delicious!",                               │
│        media: [{url, type, publicId}],                     │
│        verifiedPurchase: true,                              │
│        createdAt: Date,                                     │
│        updatedAt: Date                                      │
│      },                                                      │
│      ... more reviews                                       │
│    ]                                                         │
│  }                                                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
        │
        └─→ Return updated product to frontend
            ↓
        Frontend updates state and displays new review
```

---

## Part 2: Product Display Data Flow

### Component Hierarchy
```
App.jsx (Routes)
  ├─ Home.jsx
  │   ├─ ImageCarousel
  │   ├─ LatestCollection
  │   │   └─ ProductItem[] (Map products)
  │   ├─ BestSeller
  │   │   └─ ProductItem[]
  │   └─ NewArrivals
  │       └─ ProductItem[]
  │
  ├─ Collection.jsx (ProductListing)
  │   ├─ Filters (Category, Price, Rating)
  │   ├─ Sort options
  │   └─ ProductItem[] (Filtered & sorted)
  │
  └─ Product.jsx (Detail page)
      ├─ ImageCarousel (Product images)
      ├─ ProductInfo (Name, price, ratings)
      ├─ ReviewsList
      │   └─ Review[] (Paginated)
      ├─ ReviewForm (Add review modal)
      └─ RelatedProducts
          └─ ProductItem[]
```

### Product Data Properties
```javascript
// Complete Product Object (from API)
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,
  category: String,
  subCategory: String,
  image: [String],  // Cloudinary URLs
  stock: Number,
  bestseller: Boolean,
  featured: Boolean,
  newArrival: Boolean,
  ingredients: String,
  nutrition: String,
  weight: String,
  shelfLife: String,
  storage: String,
  tags: [String],
  
  // Key fields for display
  rating: Number,        // Average rating (0-5, 2 decimals)
  totalReviews: Number,  // Count of reviews
  reviews: [             // Array of review objects
    {
      userId: ObjectId,
      rating: Number,
      comment: String,
      media: [
        {
          url: String,
          type: 'image'|'video',
          publicId: String
        }
      ],
      verifiedPurchase: Boolean,
      createdAt: Date,
      updatedAt: Date
    }
  ],
  
  totalSold: Number,     // Analytics
  date: Date             // Creation date
}
```

---

## Part 3: API Response Examples

### Review Endpoints

#### Get Reviews (Paginated)
**REQUEST**:
```bash
GET /api/reviews/product/507f1f77bcf86cd799439011?page=1&limit=10
Headers: {
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cC...
}
```

**RESPONSE**:
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439899",
      "rating": 5,
      "comment": "Absolutely delicious! Fresh and incredible taste. Will definitely buy again.",
      "media": [
        {
          "url": "https://res.cloudinary.com/sweethome/image/upload/v123/reviews/img1.jpg",
          "type": "image",
          "publicId": "sweethome/reviews/img1"
        }
      ],
      "verifiedPurchase": true,
      "createdAt": "2026-04-15T10:30:00Z",
      "updatedAt": "2026-04-15T10:30:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439900",
      "rating": 4,
      "comment": "Good quality, packaging could be better",
      "media": [],
      "verifiedPurchase": true,
      "createdAt": "2026-04-14T15:20:00Z",
      "updatedAt": "2026-04-14T15:20:00Z"
    }
  ],
  "rating": 4.5,
  "totalReviews": 24
}
```

#### Add Review
**REQUEST**:
```bash
POST /api/reviews/product/507f1f77bcf86cd799439011
Headers: {
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cC...,
  Content-Type: application/json
}

{
  "rating": 5,
  "comment": "Absolutely delicious sweets! Perfect for gifting.",
  "media": [
    {
      "url": "https://res.cloudinary.com/sweethome/image/upload/v123/reviews/img123.jpg",
      "type": "image",
      "publicId": "sweethome/reviews/img123"
    },
    {
      "url": "https://res.cloudinary.com/sweethome/video/upload/v123/reviews/vid123.mp4",
      "type": "video",
      "publicId": "sweethome/reviews/vid123"
    }
  ]
}
```

**RESPONSE**:
```json
{
  "success": true,
  "message": "Review saved"
}
```

---

## Part 4: Schema.org Implementation Details

### Current Static Product Schema Location
**File**: `/frontend/index.html` (lines 57-93)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Traditional Indian Sweets Gift Box",
  "image": [
    "https://sweethome-store.com/sweets/kaju-katli.jpg",
    "https://sweethome-store.com/sweets/gulab-jamun.jpg"
  ],
  "description": "A premium gift box of authentic Indian sweets including Kaju Katli, Gulab Jamun, and more. Perfect for festivals and celebrations.",
  "sku": "SH-GB-2026",
  "brand": {
    "@type": "Brand",
    "name": "Sweet Home Online Store"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://sweethome-store.com/products/gift-box",
    "priceCurrency": "INR",
    "price": "799.00",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "250"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Priya Sharma"
      },
      "reviewBody": "Absolutely delicious sweets! Perfect for gifting."
    }
  ]
}
</script>
```

### Store/Organization Schema Location
**File**: `/frontend/index.html` (lines 107-197)

**Key Fields**:
- Store information with hours (Mo-Su 09:00-21:00)
- Payment methods accepted
- Aggregate rating (4.8, 250 reviews)
- Categories offered
- Contact: +919931018857

---

## Part 5: Review Collection Workflow

### Step-by-Step Process

```
1. USER NAVIGATION
   Product.jsx loaded
   → State: productId, productData, reviewsData, reviewsStats
   
2. FETCH REVIEWS (useEffect)
   GET /api/reviews/product/:productId?page=1&limit=10
   → Component state updates with reviews data
   
3. COMPUTE STATS
   ratingBreakdown calculated:
   {
     total: 24,
     counts: {1: 2, 2: 1, 3: 3, 4: 6, 5: 12},
     percents: {1: 8%, 2: 4%, 3: 13%, 4: 25%, 5: 50%}
   }
   
4. DISPLAY REVIEWS
   - Render reviews list with pagination
   - Show rating breakdown chart
   - Display verified purchase badges
   - Show media (images/videos)
   
5. USER CLICKS "WRITE REVIEW"
   - Check authentication (required)
   - Open review modal
   
6. FILL REVIEW FORM
   - Select rating (1-5 stars)
   - Enter comment (optional)
   - Select media files (optional, max 6)
   
7. UPLOAD MEDIA (if selected)
   For each file:
   a) Request upload signature
      GET /api/upload/cloudinary/review-signature
      ?productId=:id&resourceType=image|video
      
   b) Get response:
      {
        signature, timestamp, api_key, cloud_name, folder
      }
      
   c) Direct upload to Cloudinary:
      POST https://api.cloudinary.com/v1_1/{cloud_name}/{type}/upload
      With: file, signature, timestamp, api_key, folder
      
   d) Get response with secure_url and public_id
      
   e) Add to media array:
      {url, type, publicId}
   
8. SUBMIT REVIEW
   POST /api/reviews/product/:productId
   Body: {rating, comment, media}
   Headers: Authorization: Bearer {token}
   
9. BACKEND VALIDATION
   - Check rating (1-5)
   - Verify no duplicate review from user
   - Check verified purchase
   - Save to product.reviews array
   - Recalculate product.rating and totalReviews
   
10. SUCCESS
    - Toast notification: "Review saved"
    - Modal closes
    - fetchReviews() called to refresh
    - New review appears in list
```

---

## Part 6: Product Filtering System

### Available Filters (Collection.jsx)

```javascript
// Category Filter
categories = [All available product categories]
selected = category array (can multi-select)

// Price Range
min: 0, max: 1000
selected = [minPrice, maxPrice]

// Rating Filter
stars = [1, 2, 3, 4, 5]
selected = minimumRating (0-5)

// Sorting Options
{
  relavent: Relevance (default)
  low-high: Price ascending
  high-low: Price descending
  rating: By average rating (highest first)
  newest: By date (newest first)
}
```

### Filter Logic
```javascript
let query = {}

// Category filter
if (category && category !== 'all') {
  query.category = category
}

// Price range filter
if (minPrice !== 0 || maxPrice !== 1000) {
  query.price = {
    $gte: minPrice,
    $lte: maxPrice
  }
}

// Search
if (search) {
  query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ]
}

// Rating filter
if (ratingFilter > 0) {
  query.rating = { $gte: ratingFilter }
}

// Apply sorting
switch(sortType) {
  case 'low-high':
    sort = { price: 1 }; break;
  case 'high-low':
    sort = { price: -1 }; break;
  case 'rating':
    sort = { rating: -1 }; break;
  case 'newest':
    sort = { date: -1 }; break;
  default:
    sort = {}; // relevance (no sort)
}

// Backend query
products = db.products.find(query).sort(sort)
```

---

## Part 7: Added Review Analytics

### Review Stats Structure
```javascript
reviewsStats = {
  rating: 4.5,          // Average rating of product
  totalReviews: 24      // Total number of reviews
}

ratingBreakdown = {
  total: 24,
  counts: {
    1: 2,   // How many 1-star reviews
    2: 1,   // How many 2-star reviews
    3: 3,   // How many 3-star reviews
    4: 6,   // How many 4-star reviews
    5: 12   // How many 5-star reviews
  },
  percents: {
    1: 8,   // Percentage each
    2: 4,
    3: 13,
    4: 25,
    5: 50
  }
}
```

### Display Elements
- Star rating: "4.5 out of 5"
- Review count: "264 Reviews"
- Rating breakdown bar chart showing percentages
- Helpful votes option (currently not in system)
- Verified purchase badges

---

## Part 8: Product Categories

**Current Categories** (from Home.jsx):
```
- Sweets
- Namkeen
- Beverages
- Cookies
- Ready To Eat
- Festive Packs/Gift Boxes
```

**Sub-categories** (can be added):
```
Sweets:
  - Milk Sweets (Pedha, Kalakand, etc.)
  - Dry Sweets (Kaju Katli, Barfi, etc.)
  - Liquid Sweets (Gulab Jamun, Rasgulla, etc.)

Namkeen:
  - Salty Snacks
  - Mixture
  - Chakli
  - Chikhalwali

Dry Fruits:
  - Cashews
  - Almonds
  - Pistachios
  - Dry Fruit Boxes
```

---

## Part 9: Performance & Caching

### Frontend Optimization
```javascript
// Lazy load pages
const Product = lazy(() => import('./pages/Product'))
const Collection = lazy(() => import('./pages/Collection'))

// Image optimization
- Loading="lazy" on img tags
- Responsive images
- Cloudinary optimization

// API caching
- Products cached in ShopContext
- Reviews fetched fresh but can be cached

// Code splitting
- Separate vendor chunks (react, UI, utils, analytics)
- Lazy chunk loading
```

### Backend Optimization
```javascript
// Database indexing
productSchema.index({ name: 'text', description: 'text' })
productSchema.index({ category: 1, subcategory: 1 })
productSchema.index({ price: 1 })
productSchema.index({ rating: -1 })

// Query optimization
- Select only needed fields (.select())
- Lean queries on read-only operations (.lean())
- Pagination on review lists
```

---

## Part 10: Security Considerations

### Authentication
```javascript
// JWT tokens
- Stored in localStorage
- Added to all protected requests
- Validated on backend
- 401 responses trigger re-login

// Protected routes
- require token and valid user
- admin routes require role: 'admin'
```

### Verified Purchase Verification
```javascript
// Review submission
1. User must be authenticated (token)
2. Check user's orders (completed/paid)
3. Verify product in order items
4. Set verifiedPurchase flag
5. Badge displayed in review list
```

### Image Upload Security
```javascript
// Cloudinary signature
1. Backend generates signature with:
   - API secret
   - Timestamp
   - Folder path
   
2. Frontend uses signature for upload:
   - Can only upload to specified folder
   - Cannot bypass restrictions
   
3. Signature expires after timestamp
```

---

## Summary: Key File References

| Feature | Frontend | Backend |
|---------|----------|---------|
| **Product Display** | `Product.jsx`, `ProductItem.jsx` | `productController.js`, `productModel.js` |
| **Reviews Collection** | `Product.jsx` (Review section) | `reviewController.js`, `reviewRoute.js` |
| **Review Display** | `Product.jsx` (ReviewsList) | `/api/reviews/product/:id` |
| **Rating Calculation** | Display only | `productModel.recalculateRating()` |
| **SEO/Schema** | `SEOHead.jsx`, `index.html` | N/A |
| **State Management** | `ShopContext.jsx` | N/A |
| **Routing** | `App.jsx` | `server.js` |
| **Authentication** | `Auth.jsx`, `ShopContext.jsx` | `authMiddleware.js`, `userController.js` |

---

*End of Technical Implementation Guide*
