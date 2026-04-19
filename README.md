# White Hat Coffee ☕

Full-stack web application for ordering specialty coffee online. Built with React 18 + Django 6.0 + Supabase PostgreSQL for Software Design 2.

**Production-Ready Features:**
- ✅ User authentication with JWT tokens
- ✅ Product ordering and checkout system
- ✅ Admin dashboard with product management and image uploads
- ✅ Real-time order status tracking (admin view & customer history)
- ✅ Admin order management (view, update status, cancel orders)
- ✅ Customer order history with color-coded status badges
- ✅ Product image uploads with FormData multipart
- ✅ **AI-Powered Sentiment Analysis** - Two-stage SVM classifier for feedback
- ✅ Admin analytics dashboard with sentiment visualization
- ✅ Responsive UI with Tailwind CSS
- ✅ Cloud PostgreSQL database (Supabase) with automatic backups
- ✅ Production-ready CORS and security configuration

---

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** (free tier) - [Sign up](https://supabase.com)

---

## Installation

### 0. Supabase Setup (Cloud PostgreSQL)

**Quick Setup (2-5 minutes):**

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up with GitHub or Email
   - Create new project named `white-hat-coffee`
   - Choose region closest to you
   - Set a strong database password (save it!)

2. **Get Connection Details:**
   - In project settings, go to **Database → Connection**
   - Copy the **PostgreSQL** connection string (transaction pooler recommended)
   - You'll need: **Password**, **Host**, **Port (6543)**

3. **Create `.env` file in `server/` folder:**
   ```env
   # Supabase PostgreSQL Configuration
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=postgres
   DB_USER=postgres.YOUR_PROJECT_ID
   DB_PASSWORD=YOUR_SUPABASE_PASSWORD
   DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
   DB_PORT=6543
   
   # Django Settings
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3002
   ```

   **To generate SECRET_KEY:**
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

### 1. Backend Setup (Django)

#### ⚙️ FIRST TIME SETUP ONLY (Run Once)

```bash
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1   # Windows PowerShell
# or: source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations (creates tables in Supabase)
python manage.py migrate
# Note: Only run once during initial setup, unless you modify Django models

# Create a superuser (admin account)
python manage.py createsuperuser
# Enter email: admin@test.com
# Enter password: admin123
```

#### 🚀 REGULAR DEVELOPMENT (Run Every Time)

```bash
cd server

# Activate virtual environment
.\venv\Scripts\Activate.ps1   # Windows PowerShell
# or: source venv/bin/activate  # macOS/Linux

# Start development server
python manage.py runserver
```

### 2. Frontend Setup (React)

#### ⚙️ FIRST TIME SETUP ONLY (Run Once)

```bash
cd client

# Install dependencies
npm install
```

#### 🚀 REGULAR DEVELOPMENT (Run Every Time)

```bash
cd client

# Start development server
npm run dev
```

---

## Running the Application

After initial setup, you only need to run the development servers:

### Start Backend (Terminal 1)

```bash
cd server
.\venv\Scripts\Activate.ps1   # Windows PowerShell
python manage.py runserver
```

Backend runs on: `http://127.0.0.1:8000` (connected to Supabase PostgreSQL)

### Start Frontend (Terminal 2)

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:3001` (or `http://localhost:3002` if port 3001 is busy)

### Access the Application

- **Landing Page:** http://localhost:3001
- **Admin Dashboard:** http://localhost:3001/admin
- **API Documentation:** http://127.0.0.1:8000/api/

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
- Customers submit feedback with 1-5 star ratings at `/feedback`
- **Two-Stage SVM Classifier** analyzes sentiment:
  - **Stage 1:** Detects positive feedback (confidence: 0-100%)
  - **Stage 2:** Classifies negative vs neutral feedback (confidence: 0-100%)
  - Result: Positive, Negative, or Neutral sentiment
- Admin dashboard (`/admin` → Sentiment Analysis tab) displays:
  - Sentiment distribution charts (% positive/negative/neutral)
  - Total feedback count and average rating
  - Recent feedback table with confidence scores
  - Real-time sentiment tracking
- Built with scikit-learn SVM classifiers + TfidfVectorizer

---

## Project Structure

```
white-hat-coffee/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/              # Reusable UI components (Button, Header, etc.)
│   │   ├── contexts/                # AuthContext & CartContext for state
│   │   ├── pages/                   # Routes: Landing, Login, Menu, Admin, Orders, Feedback
│   │   ├── services/                # API client with axios & JWT interceptor
│   │   ├── App.jsx                  # React Router v6 configuration
│   │   └── index.jsx                # Entry point
│   ├── public/                      # Static files (images, logos)
│   ├── package.json
│   ├── vite.config.js               # Vite build configuration
│   └── .env                         # API URL (http://127.0.0.1:8000)
│
├── server/                          # Django Backend (REST API)
│   ├── manage.py
│   ├── settings.py                  # Django config: JWT, CORS, Supabase PostgreSQL
│   ├── urls.py                      # API route definitions
│   ├── .env                         # Supabase credentials (DATABASE_URL, SECRET_KEY, etc.)
│   ├── users/                       # CustomUser authentication (JWT)
│   ├── products/                    # Product CRUD with image uploads
│   ├── orders/                      # Order management with status tracking
│   ├── feedback/                    # Feedback & two-stage sentiment analysis
│   ├── sentiment/                   # ML models (SVM classifiers, TfidfVectorizer)
│   ├── requirements.txt             # Python dependencies
│   └── venv/                        # Python virtual environment
│
├── .env.example                     # Template for environment variables
├── SUPABASE_SETUP.md                # Supabase quick setup guide
├── SUPABASE_ACTION_PLAN.md          # Step-by-step Supabase checklist
├── POSTGRESQL_MIGRATION.md          # Cloud & local PostgreSQL options
├── README.md                        # This file
└── CURRENT_STATUS.md                # Feature completeness tracker
```

**Database:** Supabase PostgreSQL (cloud-hosted with automatic backups)

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
<<<<<<< HEAD
=======

### Feedback & Sentiment Analysis
- `POST /api/feedback/` - Submit feedback with rating and message
- `GET /api/feedback/` - Get feedback (user's feedback or all for admin)
- `GET /api/feedback/analytics/` - Get sentiment analytics (admin only)
- `GET /api/feedback/recent/` - Get 20 most recent feedback items (admin only)
- `POST /api/feedback/check_model/` - Check sentiment model status (admin only)
>>>>>>> supabase-migration

### Customer Profile
- `GET /api/customer/profile/` - Get user profile
- `POST /api/customer/profile/` - Update user profile/address

Full API documentation available at: `http://127.0.0.1:8000/api/`

---

## Troubleshooting

### Database Connection Issues
- **"could not translate host name"** → Check Supabase host in `.env` (should be `aws-1-ap-northeast-1.pooler.supabase.com`)
- **"password authentication failed"** → Verify password in `.env` matches Supabase exactly
- **"database 'postgres' does not exist"** → Keep `DB_NAME=postgres` (Supabase default)
- Verify Supabase project is running: https://supabase.com/dashboard

### Backend won't start
- Ensure Python is in your PATH: `python --version`
- Verify virtual environment is activated
- Check if port 8000 is available: `netstat -an | grep 8000`
- Run `python manage.py check` to diagnose configuration issues
- Verify `.env` file exists in `server/` folder with Supabase credentials

### Frontend won't start
- Ensure Node.js is installed: `node --version`
- Clear cache: `npm run build && npm install`
- Check if port 3001/3002 is available
- Verify `server/settings.py` has correct CORS origins for your port

### Login fails
- Verify Django backend is running: `http://127.0.0.1:8000/api/`
- Check admin account exists: `python manage.py shell`
  ```python
  from django.contrib.auth import get_user_model
  User = get_user_model()
  User.objects.filter(email='admin@test.com').exists()
  ```
- Reset password: `python manage.py changepassword admin@test.com`

### CORS errors (in browser console)
- Ensure `CORS_ALLOWED_ORIGINS` in `.env` includes your frontend URL
- For port 3002: Add `http://localhost:3002,http://127.0.0.1:3002` to `.env`
- Restart Django backend after `.env` changes
- Check `server/settings.py` has `corsheaders` in INSTALLED_APPS and MIDDLEWARE

### Migrations not applying
- Verify PostgreSQL/Supabase connection works
- Check migration files exist in `*/migrations/`
- Run: `python manage.py migrate --verbosity 2` for detailed output
- For clean slate: `python manage.py migrate zero` (careful with production!)

### Sentiment Analysis not working
- Check model files exist: `server/sentiment/models/`
  - `svm_model.joblib` (TfidfVectorizer)
  - `model_stage1.joblib` (Positive detector)
  - `model_stage2.joblib` (Negative/Neutral classifier)
- Test with: `python manage.py shell`
  ```python
  from sentiment.processor import analyze_sentiment
  result = analyze_sentiment("This coffee is amazing!")
  print(result)
  ```

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Vite** - Build tool (fast development & production builds)
- **Tailwind CSS** - Styling
- **Axios** - HTTP client with JWT interceptor
- **Context API** - State management (Auth, Cart)

### Backend
- **Django 6.0.4** - Web framework
- **Django REST Framework 3.17.1** - REST API
- **Supabase PostgreSQL** - Cloud database (automatic backups, SSL)
- **psycopg2-binary** - PostgreSQL adapter
- **scikit-learn 1.8.0** - Machine learning (SVM classifiers)
- **joblib 1.5.1** - Model serialization
- **python-decouple** - Environment configuration
- **django-cors-headers** - CORS handling

### Machine Learning
- **Two-Stage SVM Classifier** (scikit-learn)
  - Stage 1: Positive feedback detection
  - Stage 2: Negative vs Neutral classification
- **TfidfVectorizer** - Text preprocessing & feature extraction
- **LinearSVC** - Linear Support Vector Classifier

### Infrastructure
- **Supabase** - Cloud PostgreSQL hosting
  - Free tier: 500MB storage
  - Automatic daily backups
  - SSL/HTTPS security by default
  - Transaction pooler for connection efficiency

---

## Deployment Guide

### Production Environment Variables

Update `.env` for production:

```env
# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres.YOUR_PROJECT_ID
DB_PASSWORD=YOUR_STRONG_PASSWORD
DB_HOST=YOUR_SUPABASE_HOST
DB_PORT=6543

# Django Security
SECRET_KEY=your-secure-secret-key-here
DEBUG=False

# Allowed Hosts (replace with your domain)
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# CORS Origins (replace with your domain)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Deploy Backend

**Option 1: Heroku**
```bash
cd server
heroku create white-hat-coffee
heroku addons:create heroku-postgresql:standard-0
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

**Option 2: Railway, Render, or Fly.io**
- Connect your GitHub repository
- Set environment variables in dashboard
- Deploy automatically on git push

### Deploy Frontend

**Option 1: Vercel**
```bash
npm install -g vercel
vercel --prod
```

**Option 2: Netlify, GitHub Pages, or AWS S3**
```bash
npm run build
# Upload dist/ folder to your hosting
```

### Monitoring & Maintenance

- **Supabase Dashboard:** Monitor database usage and backups
- **Logs:** Check Django error logs on your hosting platform
- **Uptime Monitoring:** Use Uptime Robot or similar service
- **Performance:** Use Django Debug Toolbar in development only

---

## Contributing

1. Create a feature branch: `git checkout -b feature-name`
2. Make changes and test locally
3. Commit with clear messages: `git commit -m "Add feature description"`
4. Push to GitHub: `git push origin feature-name`
5. Create a Pull Request

---

## License

This project is part of the Software Design 2 course.

---

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for database setup
- Check [CURRENT_STATUS.md](./CURRENT_STATUS.md) for feature status
- See [API Endpoints](#api-endpoints) for endpoint documentation

---

**Last Updated:** April 2026
**Status:** ✅ Production Ready
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
