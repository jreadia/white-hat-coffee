# PostgreSQL Migration Guide for White Hat Coffee

**Date:** April 19, 2026  
**Status:** Ready for Migration  
**Prerequisite:** All main features complete and tested

---

## 📋 Pre-Migration Checklist

### Cloud vs Local Decision

| Aspect | Cloud PostgreSQL | Local PostgreSQL |
|--------|------------------|-----------------|
| **Setup Time** | 2-5 minutes | 15-30 minutes |
| **Best For** | Production, Teams, Beginners | Development, Testing |
| **Cost** | Free tier available | Free (self-hosted) |
| **Backups** | Automatic | Manual |
| **Scaling** | Easy (cloud provider handles) | Manual (add hardware) |
| **Maintenance** | Provider handles | You manage |
| **Ideal Use** | Production apps | Local development |

### Cloud PostgreSQL Providers (Recommended)

| Provider | Free Tier | Setup Time | Link |
|----------|-----------|-----------|------|
| **Supabase** | 500MB | 2 min | https://supabase.com |
| **Railway** | $5 credits | 3 min | https://railway.app |
| **Render** | Free (limited) | 4 min | https://render.com |
| **Heroku Postgres** | Hobby tier | 5 min | https://www.heroku.com/postgres |
| **AWS RDS** | Free tier | 10 min | https://aws.amazon.com/rds/ |

### Pre-Migration Checklist

- [x] psycopg2-binary (2.9.11) already installed in requirements.txt
- [x] Django settings.py configured for environment variables
- [x] All migrations created and tracked in git
- [x] Current SQLite database backed up (db.sqlite3)
- [x] Project is production-ready
- [ ] Decide: Cloud or Local PostgreSQL?
- [ ] Create account on cloud provider (if choosing cloud)

---

## 🔧 Step 1: Choose PostgreSQL Option

### Option A: Local Installation (Development)
```bash
# Windows, macOS, Linux
# Follow installation steps below
```

### Option B: Cloud PostgreSQL (Recommended for Production)

Popular cloud PostgreSQL services (free tier available):

1. **Supabase** (Easiest - Free tier 500MB) - https://supabase.com
   - PostgreSQL managed by Supabase
   - Free tier with 500MB storage
   - Simple connection string
   - Built-in backups

2. **Railway** (Simple - Free tier) - https://railway.app
   - PostgreSQL plugin system
   - $5/month free trial credits
   - Auto-generated connection strings
   - Great for small projects

3. **Render** (Easy - Free tier) - https://render.com
   - Free PostgreSQL database (90-day expiration)
   - Paid plans starting $7/month
   - Full-featured PostgreSQL
   - Auto SSL

4. **Heroku Postgres** (Popular) - https://www.heroku.com/postgres
   - Cloud deployment + database
   - Hobby tier (free, limited)
   - Professional tier ($50+)
   - Integrated with Heroku apps

5. **AWS RDS** (Enterprise) - https://aws.amazon.com/rds/
   - Managed PostgreSQL
   - Free tier (12 months)
   - Highly scalable
   - Professional support

6. **Azure Database** (Enterprise) - https://azure.microsoft.com/en-us/products/postgresql/
   - Microsoft Azure managed PostgreSQL
   - Free tier available
   - Global availability

7. **DigitalOcean** (Developer-friendly) - https://www.digitalocean.com/products/managed-databases/
   - $15/month starting
   - Simple interface
   - Good documentation

8. **Google Cloud SQL** (Enterprise) - https://cloud.google.com/sql
   - Google Cloud managed PostgreSQL
   - Free tier available
   - Highly available

---

## ☁️ Cloud PostgreSQL Setup (Recommended)

### Using Supabase (Easiest for Beginners)

**Step 1.1: Create Account**
1. Go to https://supabase.com
2. Sign up (free account)
3. Create a new project

**Step 1.2: Get Connection String**
```
In Supabase Dashboard:
- Settings → Database
- Copy connection string under "JDBC URL" or "PostgreSQL"

Format:
postgresql://user:password@host:port/database
```

**Step 1.3: Add to .env**
```env
# Option 1: Use full connection string
DATABASE_URL=postgresql://user:password@db.example.com:5432/white_hat_coffee

# Option 2: Use individual variables
DB_ENGINE=django.db.backends.postgresql
DB_NAME=white_hat_coffee
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=db.supabase.co
DB_PORT=5432
```

---

### Using Railway (Very Simple)

**Step 1.1: Create Account**
1. Go to https://railway.app
2. Sign up with GitHub/email
3. Create new project

**Step 1.2: Add PostgreSQL Plugin**
1. Click "+ Add" in project
2. Select "PostgreSQL"
3. Click "Provision"
4. Wait for deployment (~1 minute)

**Step 1.3: Get Connection Details**
```
In Railway Dashboard:
- PostgreSQL service
- Variables tab
- Copy DATABASE_URL

Or manually construct:
postgresql://user:password@host:port/database
```

**Step 1.4: Add to .env**
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=<copied_password>
DB_HOST=<copied_host>
DB_PORT=5432
```

---

### Using Render (Free Tier)

**Step 1.1: Create Account**
1. Go to https://render.com
2. Sign up with GitHub
3. Create new project

**Step 1.2: Create PostgreSQL Database**
1. Click "New +"
2. Select "PostgreSQL"
3. Choose "Free" tier
4. Name: white_hat_coffee
5. Click "Create Database"

**Step 1.3: Get Connection String**
```
In Render Dashboard:
- PostgreSQL service
- Info tab
- Copy "External Database URL"

Format:
postgresql://user:password@host:5432/database
```

**Step 1.4: Add to .env**
```env
DATABASE_URL=<copied_external_database_url>

# Or parse it into components:
DB_ENGINE=django.db.backends.postgresql
DB_NAME=<database_name>
DB_USER=<username>
DB_PASSWORD=<password>
DB_HOST=<host>
DB_PORT=5432
```

---

## 🔧 Local Installation (Alternative)

**⏭️ Skip this entire section if using cloud PostgreSQL**

### Windows
```bash
# Option A: Using Chocolatey (if installed)
choco install postgresql

# Option B: Using PostgreSQL Installer
# Download from: https://www.postgresql.org/download/windows/
# Run installer and follow setup wizard
# Remember the postgres user password!
```

### macOS
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Or download installer: https://www.postgresql.org/download/macosx/
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## 🗄️ Step 2: Create PostgreSQL Database & User

### ⏭️ Skip This Step if Using Cloud PostgreSQL

If using **Supabase, Railway, Render, Heroku, AWS RDS, Azure, Google Cloud SQL, or DigitalOcean**, your database and user are already created. Skip to **Step 3**.

### Local PostgreSQL Only

If installing PostgreSQL locally, follow these steps:

```bash
# Connect to PostgreSQL (default user: postgres)
psql -U postgres

# Create database
CREATE DATABASE white_hat_coffee;

# Create user with password
CREATE USER coffee_user WITH PASSWORD 'your_secure_password_here';

# Grant privileges
ALTER ROLE coffee_user SET client_encoding TO 'utf8';
ALTER ROLE coffee_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE coffee_user SET default_transaction_deferrable TO on;
ALTER ROLE coffee_user SET default_transaction_level TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE white_hat_coffee TO coffee_user;

# Exit psql
\q
```

---

## 📝 Step 3: Update Environment Configuration

### Option A: Cloud PostgreSQL Connection (Supabase, Railway, Render, etc.)

**Copy connection string from your cloud provider dashboard:**

```env
# SUPABASE / RENDER / RAILWAY - Full Connection String
DATABASE_URL=postgresql://username:password@db.yourprovider.com:5432/white_hat_coffee

# Or break it down into components:
DB_ENGINE=django.db.backends.postgresql
DB_NAME=white_hat_coffee
DB_USER=postgres
DB_PASSWORD=your_cloud_password
DB_HOST=db.yourprovider.com
DB_PORT=5432

# Django Configuration
SECRET_KEY=your-secret-key-change-in-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3001,http://127.0.0.1:3001
```

### Option B: Local PostgreSQL Connection

**Create `.env` file in server directory with local credentials:**

```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=white_hat_coffee
DB_USER=coffee_user
DB_PASSWORD=your_secure_password_here
DB_HOST=localhost
DB_PORT=5432

# Django Configuration
SECRET_KEY=your-secret-key-change-in-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3001,http://127.0.0.1:3001
```

---

## ⚠️ Important: Update Django Settings

The `settings.py` file uses environment variables. Verify it has this configuration:

```python
# In server/settings.py around line 75-85:

DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.sqlite3'),
        'NAME': config('DB_NAME', default=os.path.join(BASE_DIR, 'db.sqlite3')),
        'USER': config('DB_USER', default=''),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default=''),
        'PORT': config('DB_PORT', default=''),
    }
}
```

This configuration reads from `.env` file automatically using `python-decouple`.

---

## 🔄 Step 4: Install Python Dependencies

If you haven't already installed psycopg2, it's in requirements.txt:

```bash
cd server
.\venv\Scripts\Activate.ps1   # Windows PowerShell
# or: source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
```

Verify psycopg2 is installed:
```bash
pip show psycopg2-binary
```

---

## 🗂️ Step 5: Backup SQLite Data (Optional)

```bash
# Backup current SQLite database
cp db.sqlite3 db.sqlite3.backup

# Or: Save all current data as JSON (Django way)
python manage.py dumpdata > data_backup.json
```

---

## 🔄 Step 6: Run Migrations

```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run migrations to create all tables in PostgreSQL
python manage.py migrate

# Output should show: "Running migrations..."
# Then list all migrations applied successfully
```

---

## 👤 Step 7: Create Superuser

```bash
python manage.py createsuperuser

# Enter:
# Email: admin@test.com
# Password: admin123 (or your choice)
```

---

## ✅ Step 8: Verify Migration Success

```bash
# Test Django settings
python manage.py check

# Expected output: "System check identified no issues (0 silenced)."

# Test database connection
python manage.py shell

# In Python shell:
>>> from django.db import connection
>>> connection.ensure_connection()
>>> print("✓ PostgreSQL connection successful!")
>>> exit()
```

---

## 🚀 Step 9: Run Development Servers

### Terminal 1: Start Backend
```bash
cd server
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

**Output:**
```
Starting development server at http://127.0.0.1:8000/
```

### Terminal 2: Start Frontend
```bash
cd client
npm run dev
```

**Output:**
```
VITE v4.5.14 ready in XXX ms
Local: http://localhost:3001/
```

---

## 🧪 Step 10: Test the Application

### Test Admin Login
1. Open browser: `http://localhost:3001/login`
2. Login with: `admin@test.com` / `admin123`
3. Verify redirects to `/admin`
4. Test Product CRUD:
   - Create product (with image)
   - Edit product
   - Delete product
5. Test Orders:
   - View pending orders
   - Update order status
   - Cancel order
6. Test Sentiment Analytics:
   - View sentiment dashboard
   - Check feedback analytics

### Test Customer Workflow
1. Signup with new account
2. Browse Menu
3. Add items to cart
4. Checkout & place order
5. View Orders page
6. Submit Feedback
7. Admin views feedback sentiment

---

## 🔍 Step 11: Verify PostgreSQL Data

```bash
# Connect to PostgreSQL database
psql -U coffee_user -d white_hat_coffee

# List all tables
\dt

# Check users
SELECT * FROM users_customuser;

# Check products
SELECT * FROM products_product;

# Check orders
SELECT * FROM orders_order;

# Check feedback with sentiment
SELECT user_id, message, sentiment, sentiment_confidence FROM feedback_feedback;

# Exit
\q
```

---

## 📊 Database Schema Verification

**Expected tables:**
```
users_customuser
products_product
orders_order
orders_orderitem
feedback_feedback
django_migrations
django_session
auth_user (Django admin)
...
```

---

## 🔐 Production Deployment Notes

For production deployment:

```env
# .env (Production)
DEBUG=False
SECRET_KEY=use-a-strong-random-key-from-Python
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_HOST=your-postgres-server-ip
DB_USER=production-user
DB_PASSWORD=strong-production-password
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

**Security Steps:**
1. Change SECRET_KEY to a random value
2. Set DEBUG=False
3. Update ALLOWED_HOSTS with your domain
4. Update CORS_ALLOWED_ORIGINS with your frontend URL
5. Use environment variables for all secrets
6. Enable HTTPS
7. Set secure cookies in settings.py

---

## ✅ Verification Checklist

After migration:

- [ ] Django system check passes (no errors)
- [ ] Migrations applied successfully
- [ ] Superuser created
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Admin can login
- [ ] Customer can signup
- [ ] Products display correctly
- [ ] Orders can be created
- [ ] Feedback can be submitted
- [ ] Sentiment analysis works
- [ ] PostgreSQL contains all data

---

## 🐛 Troubleshooting

### "psycopg2: Cannot connect to server"
```bash
# Check PostgreSQL is running
# Windows: Services > PostgreSQL
# Linux: sudo systemctl status postgresql
# macOS: brew services list
```

### "FATAL: database does not exist"
```bash
# Check database was created
psql -U postgres -l | grep white_hat_coffee

# If missing, create it again:
psql -U postgres -c "CREATE DATABASE white_hat_coffee;"
```

### "FATAL: Ident authentication failed"
```bash
# Update PostgreSQL credentials in .env file
# Make sure password matches what you set
```

### "ModuleNotFoundError: No module named 'psycopg2'"
```bash
pip install psycopg2-binary==2.9.11
```

### "django.core.exceptions.ImproperlyConfigured"
```bash
# Ensure .env file exists in server/ directory
# Check all database variables are set
# Verify SECRET_KEY is set
```

---

## 📚 Rollback to SQLite (if needed)

```bash
# Update .env
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3

# Restore from backup
cp db.sqlite3.backup db.sqlite3

# Run migrations (SQLite will recreate tables)
python manage.py migrate
```

---

## 🎉 Migration Complete!

Your application is now running on PostgreSQL and ready for production deployment.

**Next Steps:**
1. Test thoroughly in development
2. Load production data (if migrating from existing system)
3. Set up backups and maintenance
4. Deploy to production server
5. Configure CI/CD pipeline
6. Monitor performance

---

## 📞 Additional Resources

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Django Postgres: https://docs.djangoproject.com/en/6.0/ref/databases/#postgresql-notes
- psycopg2 Docs: https://www.psycopg.org/psycopg2/docs/
- Environment Variables: https://github.com/henriquebastos/python-decouple

