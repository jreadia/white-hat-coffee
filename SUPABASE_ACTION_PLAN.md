# Supabase Setup Action Plan ☕

**Ready to migrate to cloud PostgreSQL? Follow these steps.**

---

## 📋 Quick Checklist (5 minutes total)

### Phase 1: Create Supabase Account (2 min)
- [ ] Go to https://supabase.com
- [ ] Click "Start your project"
- [ ] Sign up with GitHub or Email
- [ ] Verify email

### Phase 2: Create Database (2 min)
- [ ] Click "New Project"
- [ ] Name: `white-hat-coffee`
- [ ] Set strong password (save it!)
- [ ] Choose your region
- [ ] Click "Create new project"
- [ ] Wait for creation (~1-2 min)

### Phase 3: Get Connection String (1 min)
- [ ] In dashboard, click Settings (gear)
- [ ] Click "Database" in left menu
- [ ] Scroll to "Connection String"
- [ ] Select "PostgreSQL" tab
- [ ] Copy entire connection string
- [ ] Save it safely (you'll need it)

### Phase 4: Update .env File (1 min)
- [ ] Open `server/.env` (create if doesn't exist)
- [ ] Extract from connection string:
  - [ ] DB_PASSWORD (from connection string)
  - [ ] DB_HOST (from connection string)
- [ ] Add all variables from template below
- [ ] Save file

### Phase 5: Run Setup Commands (1 min)
- [ ] Activate venv: `.\venv\Scripts\Activate.ps1`
- [ ] Run migrations: `python manage.py migrate`
- [ ] Create admin: `python manage.py createsuperuser`
- [ ] Enter: `admin@test.com` / `admin123`

### Phase 6: Test (1 min)
- [ ] Terminal 1: `python manage.py runserver`
- [ ] Terminal 2: `npm run dev` (in client folder)
- [ ] Open http://localhost:3001
- [ ] Login with admin@test.com / admin123
- [ ] Click around - should work! ✅

---

## 🔧 .env Template

Copy this into `server/.env`:

```env
# Supabase PostgreSQL
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=YOUR_SUPABASE_PASSWORD_HERE
DB_HOST=db.YOUR_PROJECT_ID.supabase.co
DB_PORT=5432

# Django
SECRET_KEY=GENERATE_THIS_COMMAND_BELOW
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3001
```

### How to Fill It:

1. **DB_PASSWORD**: From Supabase connection string
   ```
   postgresql://postgres:[THIS_PART]@db...
   ```

2. **DB_HOST**: From Supabase connection string
   ```
   postgresql://...@db.abc123xyz.supabase.co:5432/postgres
                     ↑ THIS PART ↑
   ```

3. **SECRET_KEY**: Run this command:
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```
   Copy output and paste in .env

---

## 📝 Command Sequence

```bash
# 1. Navigate to server
cd server

# 2. Activate Python environment
.\venv\Scripts\Activate.ps1

# 3. Run Django migrations (create tables in Supabase)
python manage.py migrate

# 4. Create admin user
python manage.py createsuperuser

# 5. Test database connection
python manage.py check

# Expected: "System check identified no issues (0 silenced)."
```

---

## 🚀 Start Development Servers

### Terminal 1: Backend
```bash
cd server
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

### Terminal 2: Frontend
```bash
cd client
npm run dev
```

Then open: http://localhost:3001

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Can login with `admin@test.com` / `admin123`
- [ ] Admin dashboard loads
- [ ] Can create a product
- [ ] Can upload product image
- [ ] Can logout
- [ ] Can signup new customer
- [ ] Can browse menu
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can view orders
- [ ] Can submit feedback
- [ ] Can view sentiment analytics

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| "password authentication failed" | Check DB_PASSWORD in .env matches exactly |
| "could not translate host name" | Check DB_HOST spelling - no typos |
| "database 'postgres' does not exist" | Keep DB_NAME=postgres (not 'white_hat_coffee') |
| "connection timeout" | Check internet, Supabase project running |
| "relation does not exist" | Run `python manage.py migrate` |
| ".env not found" | Create `server/.env` file first |

---

## 📚 Detailed Guide

For more info, see:
- **SUPABASE_SETUP.md** - Full step-by-step (with screenshots)
- **POSTGRESQL_MIGRATION.md** - All PostgreSQL options
- **README.md** - Project overview
- **CURRENT_STATUS.md** - Feature list

---

## 🎉 Next Steps After Setup

1. **Test thoroughly** - Try all features
2. **Load test data** - Create products, orders
3. **Test sentiment analysis** - Submit feedback
4. **Check Supabase dashboard** - Verify data there
5. **Ready for production** - Deploy anytime!

---

## ⏱️ Expected Timeline

| Task | Time |
|------|------|
| Create Supabase account | 2 min |
| Create database | 2 min |
| Get connection string | 1 min |
| Add to .env | 1 min |
| Run migrations | 1 min |
| Create admin | 30 sec |
| Test everything | 5 min |
| **TOTAL** | **~12 min** |

---

## 🎯 You're Ready!

Your application is production-ready. Supabase gives you:

✅ PostgreSQL database in cloud  
✅ Automatic daily backups  
✅ SSL security  
✅ Scalable (500MB free → upgrade as needed)  
✅ No server maintenance  
✅ Deploy anytime  

**Start with Supabase setup, then deploy when ready!**

Questions? Check SUPABASE_SETUP.md for detailed walkthrough.

