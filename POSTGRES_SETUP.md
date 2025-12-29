# 🐘 PostgreSQL Setup Guide

## Quick Setup (Automated)

Run the setup script:
```bash
./setup-postgres.sh
```

This will:
1. ✅ Check if PostgreSQL is installed
2. ✅ Start PostgreSQL service
3. ✅ Create database: `speak_fluent`
4. ✅ Create user: `speak_user`
5. ✅ Update `.env` file
6. ✅ Grant all permissions

---

## Manual Setup (If Script Fails)

### 1. Install PostgreSQL
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### 2. Start PostgreSQL
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Create Database and User
```bash
sudo -u postgres psql
```

Then in PostgreSQL prompt:
```sql
-- Create user
CREATE USER speak_user WITH PASSWORD 'speak_password_2024';

-- Create database
CREATE DATABASE speak_fluent OWNER speak_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE speak_fluent TO speak_user;

-- Connect to database
\c speak_fluent

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO speak_user;

-- Exit
\q
```

### 4. Update .env File
Edit `backend/.env`:
```env
DATABASE_URL=postgresql://speak_user:speak_password_2024@localhost:5432/speak_fluent
```

---

## Verify Setup

### Check PostgreSQL Status
```bash
sudo systemctl status postgresql
```

### Test Connection
```bash
psql -U speak_user -d speak_fluent -h localhost
# Password: speak_password_2024
```

### List Tables (after running app)
```bash
psql -U speak_user -d speak_fluent -h localhost -c "\dt"
```

---

## Database Credentials

- **Database Name:** `speak_fluent`
- **Username:** `speak_user`
- **Password:** `speak_password_2024`
- **Host:** `localhost`
- **Port:** `5432`

---

## Troubleshooting

### PostgreSQL Not Installed?
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Service Not Running?
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Permission Denied?
Make sure you're using `sudo -u postgres` for database creation.

### Connection Failed?
Check if PostgreSQL is listening:
```bash
sudo netstat -plnt | grep 5432
```

---

## After Setup

1. **Restart servers:**
   ```bash
   ./run-all.sh
   ```

2. **Tables will be created automatically!**

3. **Verify tables:**
   ```bash
   psql -U speak_user -d speak_fluent -h localhost -c "\dt"
   ```

Expected tables:
- users
- conversations
- messages
- vocabulary_items
- user_progress
- quizzes
- quiz_attempts
- grammar_corrections

---

## 🎉 You're All Set!

Once PostgreSQL is configured, your application will have full database support with all features enabled!
