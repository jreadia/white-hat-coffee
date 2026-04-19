# White Hat Coffee Backend API

Django REST Framework backend for the White Hat Coffee application with JWT authentication.

## Prerequisites

- **Python 3.13.9** or higher
- pip (Python package manager)
- Virtual environment support (`venv` is included with Python)

**Verify your Python version:**
```bash
python --version
```

## Setup

### ⚙️ FIRST TIME SETUP ONLY (Run Once)

#### 1. Create Python Virtual Environment

```bash
cd server
python -m venv venv
```

#### 2. Activate Virtual Environment

**Windows:**
```bash
.\venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 4. Configure Environment Variables

Create a `.env` file in the server directory (use `.env.example` as template):

```bash
cp .env.example .env
```

Edit `.env` and update:
- `SECRET_KEY` - Generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
- `DEBUG` - Set to `False` in production
- Database credentials (if using PostgreSQL)

#### 5. Run Database Migrations

```bash
python manage.py migrate
```

**Note:** Only run this once during initial setup, unless you modify Django models.

#### 6. Create Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Or programmatically:
```bash
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> User.objects.create_superuser('admin@test.com', 'admin@test.com', 'password123')
```

### 🚀 REGULAR DEVELOPMENT (Run Every Time)

#### 1. Activate Virtual Environment

**Windows:**
```bash
.\venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### 2. Start Development Server

```bash
python manage.py runserver
```

Server runs at `http://127.0.0.1:8000/`

## API Endpoints

### Authentication

**POST** `/api/auth/signup/`
- Register new user
- Returns: `{ user, token, refresh }`

**POST** `/api/auth/login/`
- User login
- Returns: `{ user, token, refresh }`

**POST** `/api/auth/token/refresh/`
- Refresh JWT token
- Body: `{ refresh }`
- Returns: `{ access }`

### Admin

**GET/POST** `/admin/` - Django Admin interface
- Login with superuser credentials

## Authentication

All endpoints (except signup/login) require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

## Database

### Default: SQLite
- File: `db.sqlite3`
- Good for development

### Production: PostgreSQL
- Update `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` in `.env`
- Requires `psycopg2-binary` (already installed)

## Frontend Integration

Frontend (`client/`) is configured to:
- Call backend at `http://localhost:8000/api`
- Send JWT tokens in `Authorization: Bearer` headers
- Automatically refresh tokens
- Handle 401 errors with logout

### Environment Variable
Set in `client/.env`:
```
VITE_API_URL=http://localhost:8000/api
```

## Project Structure

```
server/
├── settings.py          # Django settings
├── urls.py              # URL routing
├── wsgi.py              # WSGI entry point
├── manage.py            # Django CLI
├── requirements.txt     # Python dependencies
├── db.sqlite3          # SQLite database (auto-created)
│
├── users/              # User authentication
│   ├── models.py       # CustomUser model
│   ├── views.py        # Signup/Login viewsets
│   ├── serializers.py  # Data serialization
│   └── admin.py        # Admin interface
│
├── products/           # Product catalog
│   ├── models.py       # Product model
│   └── admin.py        # Admin interface
│
├── orders/             # Order management
│   ├── models.py       # Order, OrderItem models
│   └── admin.py        # Admin interface
│
├── feedback/           # User feedback
│   ├── models.py       # Feedback model
│   └── admin.py        # Admin interface
│
└── sentiment/          # Sentiment analysis
    └── processor.py    # NLP processing (TODO)
```

## Next Steps

1. ✅ User authentication with JWT (completed)
2. 📝 Create Product endpoints
3. 📝 Create Order endpoints
4. 📝 Create Feedback endpoints
5. 📝 Sentiment analysis integration
6. 📝 Admin dashboard APIs

## Troubleshooting

### Database issues
```bash
# Reset database (WARNING: deletes all data)
rm db.sqlite3
python manage.py migrate
```

### Missing migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Port already in use
```bash
python manage.py runserver 8001
```
