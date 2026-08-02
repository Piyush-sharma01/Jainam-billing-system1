# Quick Start Guide - 5 Minutes to Running Application

## Prerequisites Check

```bash
# Check Java version (should be 17+)
java -version

# Check Maven (should have mvn command)
mvn --version

# Check Node.js (should be 16+)
node --version
npm --version

# Check MySQL is running
mysql -u root -p
# Type: exit
```

## Step 1: Setup MySQL Database (1 minute)

```bash
mysql -u root -p
```

In MySQL prompt:
```sql
CREATE DATABASE IF NOT EXISTS jainam_billing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit
```

## Step 2: Start Backend (1 minute)

Open Terminal 1:
```bash
cd billing-backend

# For Linux/macOS:
export GMAIL_USER="demo@gmail.com"
export GMAIL_PASSWORD="demo-password"

# For Windows PowerShell:
$env:GMAIL_USER="demo@gmail.com"
$env:GMAIL_PASSWORD="demo-password"

# Run backend
mvn spring-boot:run
```

Wait for message: "Started BillingSystemApplication in X seconds"

## Step 3: Start Frontend (2 minutes)

Open Terminal 2:
```bash
cd billing-frontend

# Install dependencies (first time only)
npm install

# Start frontend
npm run dev
```

You'll see: "➜ Local: http://localhost:5173/"

## Step 4: Open Application (1 minute)

1. Open browser: http://localhost:5173
2. Login with credentials:
   - Username: `admin`
   - Password: `password`
3. Explore the application

## Common Commands

### Backend
```bash
cd billing-backend

# Run development server
mvn spring-boot:run

# Build JAR
mvn clean package

# Clean only
mvn clean
```

### Frontend
```bash
cd billing-frontend

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install/reinstall dependencies
npm install
```

## Directory Structure at a Glance

```
billing-backend/          # Backend (Java/Spring Boot)
billing-frontend/         # Frontend (React/Vite)
SETUP.md                 # Complete setup guide
PROJECT_SUMMARY.md       # Detailed project overview
QUICK_START.md          # This file
```

## Troubleshooting Quick Fixes

### Backend Won't Start
```bash
# Check MySQL is running
mysql -u root -p
# Type: SELECT 1;
# Then: exit

# If port 8080 is in use
lsof -i :8080  # Check what's using it
```

### Frontend Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Port Already in Use
```bash
# Find what's using the port
lsof -i :5173    # Frontend
lsof -i :8080    # Backend

# Change port in config if needed
# Frontend: vite.config.js
# Backend: application.yml
```

### API Connection Issues
- Make sure backend is running (check Terminal 1)
- Check http://localhost:8080/api in browser
- Verify CORS is enabled in backend

## Feature Overview

### Dashboard
- View all statistics
- See recent invoices
- Quick overview of business metrics

### Products
- Browse all products
- Add new products
- Edit/Delete products
- Search by name or category

### Clients
- Manage client list
- Add new clients
- View client details
- Search functionality

### Billing
- Create new invoices
- Select client and products
- Add multiple line items
- Auto-calculate totals and taxes

### Invoice History
- View all invoices
- Filter by status
- Send invoices via email
- Download/View invoice details

## Demo Credentials

```
Username: admin
Password: password
```

These are for demo purposes. Replace with proper authentication in production.

## Sample Data Included

- **10 Products**: Various pipes, valves, fittings, tools
- **8 Clients**: Different companies with contact info
- **5 Invoices**: Mix of PAID, PENDING, and OVERDUE status

## Stop Application

To stop either server:
1. In the terminal where it's running
2. Press `Ctrl + C`

## Next Steps

1. **Explore the UI**: Navigate through all pages
2. **Create Data**: Add products, clients, invoices
3. **Test Email**: Try sending invoice via email (requires Gmail setup)
4. **Check API**: Visit http://localhost:8080/api/products
5. **Read Full Guide**: See SETUP.md for production deployment

## Need Help?

- **Backend Issues**: See `billing-backend/README.md`
- **Frontend Issues**: See `billing-frontend/README.md`
- **Setup Help**: See `SETUP.md`
- **Architecture**: See `PROJECT_SUMMARY.md`

## Production Deployment

When ready to deploy:

**Backend:**
```bash
cd billing-backend
mvn clean package
# Deploy target/billing-system-1.0.0.jar
```

**Frontend:**
```bash
cd billing-frontend
npm run build
# Deploy dist/ folder
```

See SETUP.md for detailed deployment instructions.

---

That's it! Your full-stack billing system is now running. Enjoy!
