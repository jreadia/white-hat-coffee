# White Hat Coffee ☕

Full-stack web application for ordering specialty coffee online. Built with React 18 + Django 6.0 + Supabase PostgreSQL for Software Design 2.

## 🚀 Quick Start for Team Members

**✅ Already Set Up (You can skip these):**
- Supabase PostgreSQL database - fully configured
- Admin account created (`admin@test.com` / `admin123`)
- Supabase Storage for images - ready to use
- All backend migrations - already applied
- All dependencies - listed in `requirements.txt` and `package.json`

**⚙️ What YOU need to do:**
1. Copy the `.env` file from the shared location (ask the team lead)
2. Place it in the `server/` folder
3. Run `pip install -r requirements.txt` (backend, ONCE only on first setup)
4. Run `npm install` (frontend, ONCE only on first setup)
5. Run `python manage.py runserver` (backend every time you code)
6. Run `npm run dev` (frontend every time you code)

That's it! You don't need to set up Supabase, create databases, or run migrations.

---

**Production-Ready Features:**
- ✅ User authentication with JWT tokens
- ✅ Product ordering and checkout system
- ✅ Admin dashboard with product management and image uploads to cloud
- ✅ Real-time order status tracking (admin view & customer history)
- ✅ Admin order management (view, update status, cancel, delete orders)
- ✅ Customer order history with color-coded status badges
- ✅ **Cloud Image Storage** - Images stored in Supabase (no local files needed)
- ✅ **AI-Powered Sentiment Analysis** - Two-stage SVM classifier for feedback
- ✅ Admin analytics dashboard with sentiment visualization
- ✅ Responsive UI with Tailwind CSS
- ✅ Cloud PostgreSQL database (Supabase) with automatic backups
- ✅ Production-ready CORS and security configuration

---

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.13.9 or higher) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** (free tier, already set up) - [Dashboard](https://supabase.com/dashboard)

---

## Installation

### ℹ️ For Team Members (Teammates)

**You only need the Quick Start above!** Skip all of Section 0, 1, and 2 below.

Just copy the `.env` file from the team lead and follow the Quick Start instructions.

---

### 📝 For Project Lead / Initial Setup (Skip if you're a teammate)

The sections below are for the person who sets up the project for the first time. If you've already done this, your teammates don't need to repeat it.

### 0. Supabase Setup (Cloud PostgreSQL + Image Storage)

**Quick Setup (5-10 minutes):**

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

3. **Create Storage Bucket for Images:**
   - Go to **Storage → Files** in Supabase dashboard
   - Click **"New bucket"**
   - Name: `white-hat-coffee`
   - Toggle **"Public bucket"** ON
   - Click **Create bucket**
   - Go to **Policies** tab
   - Click **"New Policy"** → **"For full customization"**
   - Name: `Allow public read`
   - Operation: Check **SELECT**
   - Policy definition: `bucket_id = 'white-hat-coffee'`
   - Target roles: **Public (default)**
   - Click **Save**

4. **Create Storage Access Keys:**
   - Still in Storage settings
   - Scroll to **"Access keys"**
   - Click **"+ New access key"**
   - Copy the **Access Key ID** and **Secret Access Key**

5. **Create `.env` file in `server/` folder:**
   ```env
   # Supabase PostgreSQL Configuration (Pooler - recommended for Django)
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=postgres
   DB_USER=postgres.YOUR_PROJECT_REF
   DB_PASSWORD=YOUR_SUPABASE_PASSWORD
   DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
   DB_PORT=6543
   
   # Django Settings
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=localhost,127.0.0.1
   
   # CORS for Frontend (port 3001 or 3002 depending on availability)
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:3002,http://127.0.0.1:3002
   
   # Supabase Storage Configuration (S3-compatible)
   USE_SUPABASE_STORAGE=True
   SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   AWS_STORAGE_BUCKET_NAME=white-hat-coffee
   AWS_S3_REGION_NAME=ap-northeast-1
   AWS_S3_ENDPOINT_URL=https://YOUR_PROJECT_REF.supabase.co/storage/v1/s3
   AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
   ```

   **To generate SECRET_KEY:**
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

### 1. Backend Setup (Django)

#### ⚙️ FIRST TIME SETUP ONLY (Run Once - Then Never Again!)

```bash
cd server

# Create virtual environment
python -3.13.9 -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1   # Windows PowerShell
# or: source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations (creates tables in Supabase)
python manage.py migrate
# ⚠️ WARNING: Only run this ONCE during initial setup
# Do NOT run again unless you add new Django models
```

#### ✅ REGULAR DEVELOPMENT (Run Every Time You Code)

```bash
cd server

# Activate virtual environment
.\venv\Scripts\Activate.ps1   # Windows PowerShell
# or: source venv/bin/activate  # macOS/Linux

# Start development server
python manage.py runserver
```

**Note:** Admin account is already created with credentials:
- **Email:** `admin@test.com`
- **Password:** `admin123`
- Do NOT create another superuser unless specifically needed

### 2. Frontend Setup (React)

#### ⚙️ FIRST TIME SETUP ONLY (Run Once - Then Never Again!)

```bash
cd client

# Install dependencies
npm install
# ⚠️ WARNING: Only run this ONCE per machine
# Do NOT run again unless you delete node_modules
```

#### ✅ REGULAR DEVELOPMENT (Run Every Time You Code)

```bash
cd client

# Start development server
npm run dev
```

---

## Running the Application

### ✅ Quick Start (After Initial Setup)

After you've done the one-time setup above, just run these commands in two separate terminals:

**Terminal 1 - Backend:**
```bash
cd server
.\venv\Scripts\Activate.ps1   # Windows PowerShell
python manage.py runserver
```
→ Backend runs on: `http://127.0.0.1:8000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
→ Frontend runs on: `http://localhost:3001` (or `3002` if `3001` is busy)

### Access the Application

- **Landing Page:** http://localhost:3001
- **Admin Dashboard:** http://localhost:3001/admin
- **API:** http://127.0.0.1:8000/api/

---

## Testing the Application

### 🔐 Admin Login
- **Email:** `admin@test.com`
- **Password:** `admin123`
- **Access:** Admin dashboard at `http://localhost:3001/admin`
- **Features:**
  - ✅ Create, edit, delete products (images auto-upload to Supabase Storage)
  - ✅ View all customer orders in real-time
  - ✅ Update order status (Pending → Confirmed → Preparing → Ready → Completed)
  - ✅ Cancel or delete orders
  - ✅ View customer info for each order
  - ✅ Sentiment analysis dashboard for customer feedback

### 👤 Regular User
- Create a new account via the **SIGN UP** button
- Browse products on the Menu page
- Add items to cart and checkout
- View order history and track order status at `/orders`
- Submit feedback with star ratings at `/feedback`
- Receive real-time updates on order status

### 📸 Image Uploads
- Images are automatically uploaded to **Supabase Storage**
- Images are publicly accessible and shared across all team members
- No need to manually sync image files

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
- `DELETE /api/orders/{id}/delete_order/` - Delete order (admin only)
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
- Verify virtual environment is activated: Should show `(venv)` in terminal
- Check if port 8000 is available: `netstat -an | grep 8000`
- Run `python manage.py check` to diagnose configuration issues
- Verify `.env` file exists in `server/` folder with ALL Supabase credentials
- If you get "No such table" errors, check if you ran `python manage.py migrate`

### Frontend won't start
- Ensure Node.js is installed: `node --version`
- Try clearing cache: Delete `node_modules` folder and run `npm install` again
- Check if ports 3001/3002 are available
- Verify `CORS_ALLOWED_ORIGINS` in `.env` matches your frontend port
- Restart Django backend after `.env` changes: Kill and re-run `runserver`

### Login fails
- **Verify backend is running:** Visit `http://127.0.0.1:8000/api/` - should show API response
- **Correct admin credentials:**
  - Email: `admin@test.com`
  - Password: `admin123`
- **Check CORS configuration:** Look at browser Network tab (F12) - look for CORS errors
- **Reset password if needed:**
  ```bash
  cd server
  .\venv\Scripts\Activate.ps1
  python manage.py changepassword admin@test.com
  ```

### Images not showing
- ✅ Verify Supabase Storage bucket `white-hat-coffee` exists and is **Public**
- ✅ Verify public read policy is set: Storage → white-hat-coffee → Policies → "Allow public read"
- ✅ Check `.env` has Supabase Storage credentials:
  - `AWS_STORAGE_BUCKET_NAME=white-hat-coffee`
  - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- ✅ After updating `.env`, restart Django: `python manage.py runserver`
- ✅ Upload a NEW image (old images may still need signatures)

### Customer name shows as "Unknown" in admin orders
- This is normal if using old data before we fixed the API
- When you create NEW orders, customer name will display correctly
- Restart both frontend and backend to ensure fresh data

### CORS errors (in browser console)
- Open browser DevTools (F12) → Network tab → Find failed request
- Look at Response headers for CORS errors
- Update `CORS_ALLOWED_ORIGINS` in `.env` to include your port
- Common fix: Add both `http://localhost:3001` and `http://127.0.0.1:3001`
- Restart Django backend: `python manage.py runserver`

### ⚠️ Do NOT run these again after setup
- ❌ `python manage.py migrate` - Only once during setup
- ❌ `npm install` - Only if you delete node_modules
- ❌ `python manage.py createsuperuser` - Admin account already exists
- ❌ Supabase setup steps - Done once, all databases are shared

### Migrations not applying
- If you DID accidentally run migrations, check Supabase dashboard
- Verify PostgreSQL connection works before running again
- Never run `python manage.py migrate zero` (resets database!)

### Sentiment Analysis not working
- Check model files exist in `server/sentiment/models/`:
  - `svm_model.joblib`
  - `model_stage1.joblib`
  - `model_stage2.joblib`
- These files are pre-trained and included in the repo
- No additional setup needed

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
- **Pillow** - Image processing for product uploads
- **python-decouple** - Environment configuration
- **django-cors-headers** - CORS handling

### Machine Learning
- **scikit-learn 1.7.2** - Two-Stage SVM Classifier
  - Stage 1: Positive feedback detection
  - Stage 2: Negative vs Neutral classification
- **TfidfVectorizer** - Text preprocessing & feature extraction
- **LinearSVC** - Linear Support Vector Classifier
- **joblib 1.5.3** - Model serialization & loading

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

### Key Environment Variables

**Frontend (.env) - Already set up:**
```
VITE_API_URL=http://localhost:8000/api
```
→ No changes needed

**Backend (.env) - Already configured:**
```
# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres.YOUR_PROJECT_REF
DB_PASSWORD=YOUR_SUPABASE_PASSWORD
DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
DB_PORT=6543

# Security
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,...

# Supabase Storage
USE_SUPABASE_STORAGE=True
AWS_STORAGE_BUCKET_NAME=white-hat-coffee
AWS_S3_ENDPOINT_URL=https://YOUR_PROJECT_REF.supabase.co/storage/v1/s3
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
```

⚠️ **Important:** The `.env` file is already set up with team credentials. Do NOT commit it to Git!

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
