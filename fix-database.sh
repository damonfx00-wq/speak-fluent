#!/bin/bash

# Fix Database Configuration Script

echo "🔧 Fixing database configuration..."

cd backend

# Backup existing .env if it exists
if [ -f .env ]; then
    cp .env .env.backup
    echo "✅ Backed up existing .env to .env.backup"
fi

# Create new .env with SQLite (no PostgreSQL needed)
cat > .env << 'EOF'
# NVIDIA API Key (Required for AI features)
NVIDIA_API_KEY=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

# Database URL - Using SQLite (no setup required!)
DATABASE_URL=sqlite:///./speak_fluent.db

# OpenAI API Key (Optional)
OPENAI_API_KEY=
EOF

echo "✅ Created new .env with SQLite database"
echo ""
echo "📊 Database Configuration:"
echo "   Type: SQLite"
echo "   Location: backend/speak_fluent.db"
echo "   Setup Required: None! ✨"
echo ""
echo "🎉 Configuration complete!"
echo ""
echo "Next steps:"
echo "1. Press Ctrl+C to stop current servers"
echo "2. Run: ./run-all.sh"
echo "3. Tables will be created automatically!"
