# Supabase Setup for White Hat Coffee ☕

**Fastest way to get PostgreSQL running for production**

> Supabase is a managed PostgreSQL service. Setup takes ~5 minutes, includes automatic backups, SSL security, and a free tier.

---

## ✨ Why Supabase?

✅ **Free tier**: 500MB storage (perfect for starting)  
✅ **Fast setup**: 5 minutes from signup to database ready  
✅ **Automatic backups**: Daily backups included  
✅ **SSL secured**: HTTPS connections by default  
✅ **Scaling**: Easy to upgrade as you grow  
✅ **No maintenance**: Supabase handles everything  
✅ **Simple UI**: Copy-paste connection strings  

---

## 🚀 5-Minute Setup

### Step 1: Create Supabase Account (1 min)

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with:
   - **GitHub** (recommended - fastest)
   - **Email** (also works)
4. Verify your email (check inbox)

### Step 2: Create Your Project (2 min)

1. Click **"New Project"**
2. Fill in:
   - **Project name**: `white-hat-coffee`
   - **Database password**: Create strong password (you'll need this!)
   - **Region**: Choose closest to you (e.g., `us-east-1`)
3. Click **"Create new project"**
4. Wait 1-2 minutes for creation...

**You'll see a loading screen. It's creating your PostgreSQL database automatically!**

### Step 3: Get Connection Details (1 min)

1. In your project dashboard, click **gear icon** (Settings)
2. Left sidebar → click **"Database"**
3. Scroll to **"Connection String"** section
4. Select **"PostgreSQL"** tab
5. You'll see connection string like:
   ```
   postgresql://postgres:[YOUR_PASSWORD]@db.wxyzabc.supabase.co:5432/postgres
   ```

**Copy this entire string!**

### Step 4: Add to Your Project (.env file) (1 min)

```bash
cd c:\4 - CODING FILES\white-hat-coffee\server
```

**Create a new file called `.env`** (or edit if it exists):

```env
# Supabase PostgreSQL Connection
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD_FROM_SUPABASE
DB_HOST=db.wxyzabc.supabase.co
DB_PORT=5432

# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3001
```

**⚠️ Replace these:**
- `YOUR_PASSWORD_FROM_SUPABASE` → Password you created in Step 2
- `db.wxyzabc.supabase.co` → Your actual DB HOST from Step 3
- `your-secret-key-here` → Generate using command below

**Generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
Copy the output and paste it in `.env`

### Step 5: Run Migrations (1 min)

```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run migrations to create all database tables
python manage.py migrate

# You should see:
# Running migrations...
# Operations to perform:
# ...
# [success messages]
```

### Step 6: Create Admin User (30 sec)

```bash
python manage.py createsuperuser

# When prompted, enter:
Email: admin@test.com
Password: admin123

# Then confirm password
```

**✅ Done! Your database is ready!**

---

## 🧪 Test Your Setup

### Terminal 1: Start Backend

```bash
cd server
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

### Terminal 2: Start Frontend

```bash
cd client
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:3001/
```

### Test in Browser

1. Open **http://localhost:3001**
2. Click **Login**
3. Enter: `admin@test.com` / `admin123`
4. You should see the admin dashboard ✅

---

## 🔍 Verify Database Connection

```bash
# In server directory with venv activated
python manage.py shell

# In Python shell:
>>> from django.db import connection
>>> connection.ensure_connection()
>>> print("✓ Connected to Supabase PostgreSQL!")
>>> exit()
```

---

## 📱 Test Full Workflow

### As Admin:
1. Login at `http://localhost:3001/login`
2. Create a product (with image)
3. Go to Orders tab
4. Go to Sentiment Analysis tab ✅

### As Customer:
1. Logout
2. Signup new account
3. Browse Menu
4. Add to cart
5. Checkout
6. Submit Feedback
7. See sentiment analysis ✅

---

## 📊 Check Data in Supabase

1. Go to **Supabase Dashboard**
2. Click **"Table Editor"** (left sidebar)
3. You can see:
   - `users_customuser` - Your users
   - `products_product` - Your products
   - `orders_order` - Orders placed
   - `feedback_feedback` - Customer feedback

Everything is stored securely in Supabase!

---

## 🔐 Important Security Notes

### 1. Protect Your .env File
```bash
# Make sure .env is NOT committed to git
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

### 2. Never Share Your Credentials
- Don't paste `.env` content in messages
- Don't commit `.env` to git
- Each developer gets their own `.env`

### 3. Supabase Security Features
- ✅ SSL/HTTPS by default
- ✅ Password protected
- ✅ Row-level security available
- ✅ Automatic daily backups
- ✅ IP whitelist available

---

## 📈 Scaling Your Database

### Current Setup (Free Tier)
- **Storage**: 500 MB (plenty for starting)
- **Backups**: Daily automatic
- **Uptime**: 99.99%
- **Cost**: Free

### When You Need More
1. Go to Supabase Dashboard
2. Click **"Billing"**
3. Upgrade to **Pro plan** ($25/month)
4. Includes 8GB storage, priority support

**No downtime - upgrade instantly!**

---

## 💾 Backups in Supabase

Automatic backups happen every 24 hours. To view:

1. In Supabase Dashboard
2. Click **"Settings"** → **"Backups"**
3. See backup history
4. Can restore to any previous backup if needed

---

## 🚀 Deploy to Production

When ready to go live:

### Update .env for Production

```env
DEBUG=False
SECRET_KEY=generate-new-secure-key
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=YOUR_SUPABASE_PASSWORD
DB_HOST=db.YOUR_ID.supabase.co
DB_PORT=5432
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Deploy Options (with Supabase):
- **Vercel** (React + Django)
- **Railway** (easy deployment)
- **Render** (free tier available)
- **Heroku** (popular, easy)
- **AWS, Azure, Google Cloud** (enterprise)

All work perfectly with Supabase!

---

## 🆘 Troubleshooting

### "psycopg2: could not translate host name"
```
Fix: Check DB_HOST spelling in .env
Example: db.wxyzabc.supabase.co (not db.supabase.co)
```

### "FATAL: password authentication failed"
```
Fix: Check DB_PASSWORD matches exactly
- No extra spaces
- Copy-paste from Supabase to be sure
```

### "database 'postgres' does not exist"
```
Fix: Supabase uses 'postgres' as default DB
Keep DB_NAME=postgres in .env
```

### "connection timeout"
```
Fix 1: Check internet connection
Fix 2: Verify Supabase project is running (Dashboard → Overview)
Fix 3: Check firewall isn't blocking port 5432
```

### "relation 'users_customuser' does not exist"
```
Fix: Run migrations:
python manage.py migrate
```

---

## 📞 Need Help?

### Supabase Support
- **Docs**: https://supabase.com/docs
- **Discord**: https://discord.supabase.com
- **Email**: support@supabase.io

### Django Support
- **Django Postgres Docs**: https://docs.djangoproject.com/en/6.0/ref/databases/#postgresql-notes

### Your Project
- Check **CURRENT_STATUS.md** for full feature list
- Check **README.md** for API documentation
- All migrations stored in git

---

## ✅ You're All Set!

Your White Hat Coffee application is now running with:

✅ **PostgreSQL** (Supabase cloud)  
✅ **Automatic backups** (daily)  
✅ **SSL security** (by default)  
✅ **Scalable** (easy to grow)  
✅ **Free tier** (start with 500MB)  
✅ **No maintenance** (Supabase handles it)  
✅ **Production ready** (deploy anytime)  

**What's next?**
1. Test the application fully
2. Add real products and test orders
3. Collect customer feedback
4. View sentiment analytics
5. Deploy to production when ready

Enjoy your coffee app! ☕

