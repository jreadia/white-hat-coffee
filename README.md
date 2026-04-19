# White Hat Coffee ☕

Full-stack web application for ordering specialty coffee online. Built with React + Django for Software Design 2.

**Features:**
- User authentication with JWT tokens
- Product ordering and checkout
- Admin dashboard with product management and image uploads
- Real-time order status tracking (admin view & customer history)
- Admin order management (view, update status, cancel orders)
- Customer order history with color-coded status badges
- Product image uploads with FormData multipart
- **Sentiment Analysis** - AI-powered customer feedback analysis
- Responsive UI with Tailwind CSS

---

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)

---

## Installation

### 1. Backend Setup (Django)

```bash
cd server

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows PowerShell
# or: source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (admin account)
python manage.py createsuperuser
# Enter email: admin@test.com
# Enter password: admin123
```

### 2. Frontend Setup (React)

```bash
cd client

# Install dependencies
npm install
```

---

## Running the Application

### Start Backend (Terminal 1)

```bash
cd server
.\venv\Scripts\Activate.ps1   # Activate virtual environment
python manage.py runserver
```

Backend runs on: `http://127.0.0.1:8000`

### Start Frontend (Terminal 2)

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:3001`

---

## Testing the Application

### Admin Login
- **Email:** `admin@test.com`
- **Password:** `admin123`
- **Access:** Admin dashboard at `/admin`
- **Features:**
  - Create, edit, delete products with image uploads
  - View all customer orders in real-time
  - Update order status (Pending → Confirmed → Preparing → Ready → Completed)
  - Cancel orders with confirmation dialog

### Regular User
- Create a new account via the **SIGN UP** button
- Browse products on the Menu page
- Add items to cart and checkout
- View order history and track order status at `/orders`
- Submit feedback with star ratings at `/feedback`
- Receive real-time updates on order status changes

### Feedback & Sentiment Analysis
- Customers can submit feedback with 1-5 star ratings
- AI analyzes sentiment (positive/negative/neutral) using two-stage SVM classifier
- Admin dashboard displays real-time sentiment analytics
- View recent feedback with confidence scores

---

## Project Structure

```
white-hat-coffee/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── contexts/                # Auth & Cart state management
│   │   ├── pages/                   # Route pages (Login, Menu, Admin, etc.)
│   │   ├── services/                # API client with axios
│   │   ├── App.jsx                  # Router configuration
│   │   └── index.jsx                # Entry point
│   ├── public/                      # Static files (favicon, images)
│   ├── package.json
│   ├── vite.config.js               # Vite build config
│   └── .env                         # API URL configuration
│
├── server/                          # Django Backend
│   ├── manage.py
│   ├── settings.py                  # Django configuration (JWT, CORS, DB)
│   ├── urls.py                      # API route definitions
│   ├── users/                       # Authentication app
│   ├── products/                    # Product management
│   ├── orders/                      # Order management
│   ├── feedback/                    # Feedback/sentiment analysis
│   ├── db.sqlite3                   # SQLite database
│   ├── requirements.txt
│   └── venv/                        # Python virtual environment
│
└── README.md, CURRENT_STATUS.md
```

---

## API Endpoints

### Authentication
- `POST /api/auth/signup/` - Register new user
- `POST /api/auth/login/` - Login user

### Products
- `GET /api/products/` - List available products
- `GET /api/products/admin_list/` - List all products (admin only)
- `POST /api/products/` - Create product (admin only)
- `PATCH /api/products/{id}/` - Update product (admin only)
- `DELETE /api/products/{id}/` - Delete product (admin only)

### Orders
- `GET /api/orders/` - Get user's orders (or all orders for admin)
- `POST /api/orders/create_from_cart/` - Create order from cart
- `PATCH /api/orders/{id}/update_status/` - Update order status (admin only)
- `POST /api/orders/{id}/cancel_order/` - Cancel order (admin only)

### Feedback & Sentiment Analysis
- `POST /api/feedback/` - Submit feedback with rating and message
- `GET /api/feedback/` - Get feedback (user's feedback or all for admin)
- `GET /api/feedback/analytics/` - Get sentiment analytics (admin only)
- `GET /api/feedback/recent/` - Get 20 most recent feedback items (admin only)
- `POST /api/feedback/check_model/` - Check sentiment model status (admin only)

### Customer Profile
- `GET /api/customer/profile/` - Get user profile
- `POST /api/customer/profile/` - Update user profile/address

Full API documentation available at: `http://127.0.0.1:8000/api/`

---

## Troubleshooting

### Backend won't start
- Ensure Python is in your PATH: `python --version`
- Verify virtual environment is activated
- Check if port 8000 is available

### Frontend won't start
- Ensure Node.js is installed: `node --version`
- Clear node_modules and reinstall: `rm -r node_modules && npm install`
- Check if port 3001 is available

### Login fails
- Verify Django backend is running
- Check that admin account exists in database
- Try resetting password: `python manage.py changepassword admin@test.com`

### CORS errors
- Ensure frontend is running on `localhost:3001`
- Check CORS settings in `server/settings.py`

---

## Development

### Adding a Product (via Admin Dashboard)
1. Log in with admin credentials
2. Navigate to `/admin`
3. Fill in product details (name, price, image)
4. Click "ADD PRODUCT"
5. Product appears for all customers

### Environment Variables

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:8000/api
```

**Backend** (auto-configured in `settings.py`):
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## Technology Stack

**Frontend:**
- React 18
- React Router v6
- Vite (build tool)
- Tailwind CSS
- Axios (HTTP client)
- Context API (state management)

**Backend:**
- Django 6.0.4
- Django REST Framework 3.17.1
- djangorestframework-simplejwt (JWT authentication)
- Pillow (image processing)
- SQLite (development database)

---

## Contributors

- Team: Software Design 2 Project
- Last Updated: April 2026

---

## License

This project is for educational purposes.

---

## Questions?

Refer to `CURRENT_STATUS.md` for detailed feature status and progress tracking.
