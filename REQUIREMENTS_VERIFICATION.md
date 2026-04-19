# Requirements.txt Verification & Updates

## Summary
The `requirements.txt` file has been thoroughly reviewed and updated to ensure all dependencies are correctly specified for production deployment.

## Changes Made

### ✅ **Critical Fixes**
1. **Added Pillow (12.2.0)** 
   - **Issue**: The Product model uses `ImageField` which requires Pillow for image processing
   - **Impact**: Without this, image uploads will fail
   - **Status**: NOW INCLUDED

2. **Removed PyJWT (2.12.1)**
   - **Issue**: PyJWT is redundant - it's already included as a dependency of `djangorestframework_simplejwt`
   - **Impact**: Avoids potential version conflicts and bloat
   - **Status**: REMOVED (safe to remove)

### ⚠️ **Version Updates**
Updated to match currently stable versions used in development:
- joblib: 1.4.2 → 1.5.3
- numpy: 1.24.3 → 2.4.4
- scikit-learn: 1.5.0 → 1.7.2 (pinned to match ML model training version)

**Important**: scikit-learn is pinned to 1.7.2 because the sentiment analysis models were trained with that version. This ensures the ML models load and function correctly without compatibility warnings.

### 📦 **Production Enhancements**
Added two recommended packages for production deployment:
- **gunicorn (23.0.0)**: WSGI application server for production
- **whitenoise (6.8.2)**: Efficient static file serving

## Complete Dependencies List

| Package | Version | Purpose |
|---------|---------|---------|
| Django | 6.0.4 | Web framework |
| djangorestframework | 3.17.1 | REST API framework |
| djangorestframework_simplejwt | 5.5.1 | JWT authentication |
| django-cors-headers | 4.9.0 | CORS handling |
| asgiref | 3.11.1 | ASGI utilities (Django dependency) |
| sqlparse | 0.5.5 | SQL parsing (Django dependency) |
| tzdata | 2026.1 | Timezone data (Django dependency) |
| python-decouple | 3.8 | Environment variable management |
| Pillow | 12.2.0 | Image processing (ImageField) |
| psycopg2-binary | 2.9.11 | PostgreSQL adapter |
| scikit-learn | 1.7.2 | ML sentiment analysis |
| numpy | 2.4.4 | Numerical computing (scikit-learn dependency) |
| joblib | 1.5.3 | Serialized ML model loading |
| gunicorn | 23.0.0 | Production WSGI server |
| whitenoise | 6.8.2 | Static file serving |

## Installation Instructions

### For Development
```bash
cd server
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### For Production
```bash
pip install -r requirements.txt
gunicorn --bind 0.0.0.0:8000 wsgi:application
```

## Features Verified
✅ REST API endpoints (users, products, orders, feedback)
✅ JWT authentication  
✅ CORS handling
✅ Image upload handling (products)
✅ Sentiment analysis (feedback)
✅ PostgreSQL database support
✅ Environment variable configuration

## Notes for Teammates
- All packages have been tested and verified working
- The venv in this project is ready to use with these dependencies
- Run `pip install -r requirements.txt` when setting up on your machine
- No additional packages should be needed for the current feature set
- If you add new features requiring packages, update this file and run `pip freeze > requirements.txt`

## Last Updated
April 19, 2026
