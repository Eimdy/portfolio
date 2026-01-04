#!/bin/bash

# Portfolio Deployment Script
# Usage: ./deploy.sh
# Author: Andy Mahendra

set -e # Exit immediately if a command exits with a non-zero status

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Portfolio Deployment...${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# 0. Check Environment Variables
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local file not found!${NC}"
    echo -e "   Please create it using .env.example as a template."
    echo -e "   Run: ${GREEN}cp .env.example .env.local${NC} and edit the domains."
    # We continue anyway, defaulting to localhost mode
else
    echo -e "${GREEN}✅ Environment file found.${NC}"
fi

# 1. Install Dependencies
echo -e "${YELLOW}📦 Installing dependencies (including dev)...${NC}"
npm install --include=dev

# 2. Build Application
echo -e "${YELLOW}🏗️  Building application...${NC}"
npm run build

# 3. Database Check & Permissions
if [ ! -d "database" ]; then
    echo -e "${YELLOW}📂 Creating database directory...${NC}"
    mkdir database
fi
echo -e "${YELLOW}🔒 Setting permissions for database...${NC}"
chmod 775 database
# If database exists, ensure it is writable
if [ -f "database/portfolio.db" ]; then
    chmod 664 database/portfolio.db
fi

# 4. Process Management (PM2)
APP_NAME="portfolio"

if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "$APP_NAME"; then
        echo -e "${GREEN}🔄 Reloading existing PM2 process...${NC}"
        pm2 reload "$APP_NAME"
    else
        echo -e "${GREEN}▶️  Starting new PM2 process...${NC}"
        pm2 start npm --name "$APP_NAME" -- start
    fi
    
    # Save PM2 list for reboot
    pm2 save
    
    echo -e "${GREEN}✅ Deployment Complete! App is running via PM2.${NC}"
    echo -e "   Check status: ${YELLOW}pm2 status $APP_NAME${NC}"
    echo -e "   View logs:    ${YELLOW}pm2 logs $APP_NAME${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 is not installed.${NC}"
    echo -e "   Installing PM2 globally..."
    npm install -g pm2
    
    echo -e "${GREEN}▶️  Starting PM2 process...${NC}"
    pm2 start npm --name "$APP_NAME" -- start
    pm2 save
    pm2 startup
    
    echo -e "${GREEN}✅ Deployment Complete!${NC}"
fi
