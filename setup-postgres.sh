#!/bin/bash

# PostgreSQL Database Setup Script

echo "🐘 PostgreSQL Database Setup"
echo "=============================="
echo ""

# Database configuration
DB_NAME="speak_fluent"
DB_USER="speak_user"
DB_PASSWORD="speak_password_2024"
DB_HOST="localhost"
DB_PORT="5432"

echo "📊 Database Configuration:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo ""
    echo "To install PostgreSQL:"
    echo "   sudo apt update"
    echo "   sudo apt install postgresql postgresql-contrib"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Check if PostgreSQL service is running
if ! sudo systemctl is-active --quiet postgresql; then
    echo "⚠️  PostgreSQL service is not running"
    echo "Starting PostgreSQL..."
    sudo systemctl start postgresql
    echo "✅ PostgreSQL started"
else
    echo "✅ PostgreSQL service is running"
fi

echo ""
echo "🔧 Creating database and user..."
echo ""

# Create database and user
sudo -u postgres psql << EOF
-- Drop existing database and user if they exist
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Create new user
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Create database
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Connect to the database and grant schema privileges
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;

\q
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database and user created successfully!"
    echo ""
    
    # Update .env file
    cd backend
    
    # Backup existing .env
    if [ -f .env ]; then
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        echo "✅ Backed up existing .env"
    fi
    
    # Create new .env with PostgreSQL
    cat > .env << EOF
# NVIDIA API Key (Required for AI features)
NVIDIA_API_KEY=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

# PostgreSQL Database URL
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

# OpenAI API Key (Optional)
OPENAI_API_KEY=
EOF
    
    echo "✅ Updated .env file with PostgreSQL configuration"
    echo ""
    echo "=============================="
    echo "🎉 Setup Complete!"
    echo "=============================="
    echo ""
    echo "Database Details:"
    echo "   Name: $DB_NAME"
    echo "   User: $DB_USER"
    echo "   Password: $DB_PASSWORD"
    echo "   Connection: postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
    echo ""
    echo "Next steps:"
    echo "1. Restart your servers: ./run-all.sh"
    echo "2. Tables will be created automatically!"
    echo ""
else
    echo ""
    echo "❌ Failed to create database"
    echo "Please check PostgreSQL installation and permissions"
    exit 1
fi
