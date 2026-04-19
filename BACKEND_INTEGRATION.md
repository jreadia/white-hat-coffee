# Backend Integration Guide

This document outlines what has been prepared for backend integration and what needs to be implemented.

## Current State

The frontend application is **fully UI-ready** for backend integration. All pages have been updated with:

✅ **Context APIs for State Management:**
- `AuthContext` - User authentication state (login, signup, logout)
- `CartContext` - Shopping cart state (add/remove items, persistence)

✅ **Centralized API Service:**
- `services/api.js` - Axios instance with interceptors for:
  - Automatic JWT token injection in headers
  - 401 error handling (auto-logout on unauthorized)
  - Centralized error handling

✅ **API Endpoints Defined:**
- Auth APIs: `login`, `signup`, `logout`
- Product APIs: `getAll`, `getById`, `create`, `update`, `delete`
- Order APIs: `getAll`, `getById`, `create`, `updateStatus`
- Feedback APIs: `submit`, `getAll`
- Customer APIs: `getProfile`, `updateProfile`
- Sentiment APIs: `getAnalysis`, `getTrends`

✅ **Pages Prepared for API Integration:**
1. **Login.jsx** - Ready to call `authAPI.login()`
2. **SignUp.jsx** - Ready to call `authAPI.signup()`
3. **Menu.jsx** - Ready to fetch products via `productAPI.getAll()`, uses CartContext
4. **Checkout.jsx** - Ready to fetch customer profile via `customerAPI.getProfile()` and submit orders via `orderAPI.create()`
5. **Feedback.jsx** - Ready to call `feedbackAPI.submit()`
6. **AdminDashboard.jsx** - Ready to manage products and orders via respective APIs
7. **App.jsx** - Configured with `AuthProvider` and `CartProvider` wrappers

## What Needs to Be Implemented

### 1. Backend API Server (Django)

Create REST API endpoints matching the service definitions in `services/api.js`:

```
POST   /api/auth/login              - User login
POST   /api/auth/signup             - User registration
GET    /api/products                - List all products
POST   /api/products                - Create product
PUT    /api/products/{id}           - Update product
DELETE /api/products/{id}           - Delete product
GET    /api/orders                  - List all orders
POST   /api/orders                  - Create order
PATCH  /api/orders/{id}/status      - Update order status
POST   /api/feedback                - Submit feedback
GET    /api/feedback                - Get all feedback
GET    /api/customers/profile       - Get customer profile
PUT    /api/customers/profile       - Update customer profile
GET    /api/sentiment/analysis      - Get sentiment analysis
GET    /api/sentiment/trends        - Get sentiment trends
```

### 2. Database Schema

Create PostgreSQL tables:

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_price DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items (many-to-many between orders and products)
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Feedback
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  sentiment_score FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Environment Configuration

Create `.env` file in the client directory:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

Update the URL to match your backend server.

### 4. Authentication Implementation

Uncomment and test these code sections:

**In Login.jsx:**
```javascript
const result = await login(email, password);
if (result.success) {
  navigate('/menu');
} else {
  setError(result.error);
}
```

**In SignUp.jsx:**
```javascript
const result = await signup(formData);
if (result.success) {
  alert(result.message);
  navigate('/login');
} else {
  setErrors({ submit: result.error });
}
```

### 5. Product Loading Implementation

Uncomment in **Menu.jsx**:
```javascript
const response = await productAPI.getAll();
setProducts(response.data);
```

### 6. Order Management Implementation

Uncomment in **AdminDashboard.jsx**:
```javascript
const productsResponse = await productAPI.getAll();
const ordersResponse = await orderAPI.getAll();
```

Uncomment in **Checkout.jsx**:
```javascript
const orderData = {
  items: cartItems,
  totalPrice: sumTotal,
  paymentMethod: selectedPayment,
  customerId: customer.id,
};
const response = await orderAPI.create(orderData);
clearCart();
```

### 7. Protected Routes

Create a ProtectedRoute component:

```javascript
// src/components/ProtectedRoute.jsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
```

Use in **App.jsx**:
```javascript
<Route path="/menu" element={<ProtectedRoute element={<Menu />} />} />
<Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
<Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
```

### 8. Sentiment Analysis Integration

Once ML models are trained, implement:

1. **Backend sentiment analysis:**
   - Train SVM, k-NN, Naive Bayes models
   - Create inference endpoint
   - Process feedback through models
   - Store sentiment scores

2. **Update Sentiment Analysis Tab:**
   ```javascript
   useEffect(() => {
     const loadAnalysis = async () => {
       const analysis = await sentimentAPI.getAnalysis();
       const trends = await sentimentAPI.getTrends();
       // Update sentiment data
     };
     loadAnalysis();
   }, []);
   ```

## Testing Checklist

- [ ] Backend server running on `http://localhost:8000`
- [ ] CORS configured to allow requests from `http://localhost:3000`
- [ ] Login/Signup API working
- [ ] Product list loading
- [ ] Cart persisting in localStorage
- [ ] Order creation working
- [ ] Admin dashboard fetching products and orders
- [ ] Feedback submission working
- [ ] Sentiment analysis endpoints responding
- [ ] JWT token expiration handling

## API Response Formats (Expected)

### Login Response
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Juan",
    "lastName": "Dela Cruz"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Products Response
```json
[
  {
    "id": 1,
    "name": "Matcha Frappuccino",
    "price": 160.00,
    "available": true,
    "imageUrl": "/assets/products/matcha.jpg"
  }
]
```

### Order Creation Response
```json
{
  "id": 1,
  "totalPrice": 450.00,
  "status": "pending",
  "paymentMethod": "Cash On Delivery",
  "createdAt": "2026-04-19T10:30:00Z"
}
```

## Notes

- All API calls are prepared in `services/api.js`
- JWT tokens are automatically managed via interceptors
- Sample data is used for testing until backend is ready
- Cart data persists in localStorage for offline capability
- All forms have validation in place
- Error handling is prepared with try-catch blocks

## Next Steps

1. Set up Django backend with DRF
2. Configure PostgreSQL database
3. Implement authentication (JWT)
4. Create REST API endpoints
5. Test each endpoint with Postman
6. Uncomment API calls in React components
7. Test full end-to-end flow
