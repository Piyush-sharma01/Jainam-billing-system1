# Jainam Billing System - Complete Setup Guide

Full-stack billing management system with Spring Boot backend and React + Vite frontend.

## Project Structure

```
billing-backend/          # Spring Boot REST API
├── src/
│   ├── main/java/
│   │   └── com/jainam/
│   │       ├── entity/       # JPA entities
│   │       ├── repository/   # Data repositories
│   │       ├── service/      # Business logic
│   │       ├── controller/   # REST controllers
│   │       └── dto/          # Data transfer objects
│   └── main/resources/
│       ├── application.yml   # Configuration
│       └── data.sql          # Sample data
├── pom.xml                  # Maven dependencies
└── README.md               # Backend documentation

billing-frontend/         # React + Vite frontend
├── src/
│   ├── pages/            # Page components
│   ├── components/       # Reusable components
│   ├── services/         # API client
│   ├── App.jsx           # Main app
│   ├── main.jsx          # Entry point
│   └── index.css          # Global styles
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── package.json          # Dependencies
└── README.md             # Frontend documentation
```

## Prerequisites

### System Requirements
- Java 17 or higher (for backend)
- Maven 3.8+ (for building backend)
- Node.js 16+ (for frontend)
- MySQL 8.0+ (database)
- Git (optional)

### Installation

**macOS:**
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Java
brew install openjdk@17

# Install Maven
brew install maven

# Install Node.js
brew install node

# Install MySQL
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk maven nodejs npm mysql-server

sudo systemctl start mysql
```

**Windows:**
- Download and install from official websites:
  - Java: https://www.oracle.com/java/technologies/downloads/#java17
  - Maven: https://maven.apache.org/download.cgi
  - Node.js: https://nodejs.org/
  - MySQL: https://dev.mysql.com/downloads/mysql/

## Step-by-Step Setup

### 1. Database Setup

#### Create Database

Open MySQL terminal:
```bash
mysql -u root -p
```

Run SQL commands:
```sql
CREATE DATABASE IF NOT EXISTS jainam_billing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jainam_billing;
```

The schema and sample data will be created automatically when backend starts.

### 2. Backend Setup

Navigate to backend directory:
```bash
cd billing-backend
```

#### Configure Environment Variables

Create `.env` file or set system environment variables:

**Linux/macOS:**
```bash
export GMAIL_USER="your-gmail@gmail.com"
export GMAIL_PASSWORD="your-app-password"
```

**Windows (PowerShell):**
```powershell
$env:GMAIL_USER="your-gmail@gmail.com"
$env:GMAIL_PASSWORD="your-app-password"
```

**Note:** For Gmail:
1. Go to https://myaccount.google.com/apppasswords
2. Select Mail and Windows Computer (or your device)
3. Google will generate a 16-character password
4. Use this as GMAIL_PASSWORD

#### Update Configuration (Optional)

Edit `src/main/resources/application.yml` if needed:
- Change database credentials (default: root/root)
- Change server port (default: 8080)
- Change CORS origins

#### Build Backend

```bash
# Clean and build
mvn clean package

# Or just compile for development
mvn clean install
```

#### Run Backend

```bash
# Using Maven
mvn spring-boot:run

# Or run the JAR directly
java -jar target/billing-system-1.0.0.jar
```

Backend will start at `http://localhost:8080/api`

### 3. Frontend Setup

Open new terminal and navigate to frontend:
```bash
cd billing-frontend
```

#### Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

#### Start Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Access the Application

1. **Backend API**: http://localhost:8080/api
   - Products: http://localhost:8080/api/products
   - Clients: http://localhost:8080/api/clients
   - Invoices: http://localhost:8080/api/invoices

2. **Frontend**: http://localhost:5173

3. **Login Credentials**:
   - Username: `admin`
   - Password: `password`

## Sample Data

The database is automatically populated with:
- 10 products in various categories
- 8 client companies
- 5 sample invoices with line items
- Varying invoice statuses (PAID, PENDING, OVERDUE)

## Common Issues & Solutions

### Issue: Port Already in Use
**Backend (8080):**
```bash
# Change port in application.yml
server:
  port: 8081
```

**Frontend (5173):**
```bash
# Change port in vite.config.js
server: {
  port: 5174
}
```

### Issue: MySQL Connection Error
```bash
# Check MySQL is running
mysql --version

# Start MySQL
sudo systemctl start mysql  # Linux
brew services start mysql   # macOS
```

### Issue: Maven Build Fails
```bash
# Clear cache and rebuild
mvn clean
mvn package -U
```

### Issue: Frontend Not Loading
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: Email Sending Fails
- Verify GMAIL_USER and GMAIL_PASSWORD environment variables are set
- Check you're using App Password, not regular Gmail password
- Verify "Less secure app access" is enabled or use App Password
- Check firewall allows port 587 (SMTP)

## API Documentation

### Products Endpoints
```
GET    /api/products              - Get all products
GET    /api/products/{id}         - Get by ID
GET    /api/products/search/{keyword}  - Search products
POST   /api/products              - Create product
PUT    /api/products/{id}         - Update product
DELETE /api/products/{id}         - Delete product
```

### Clients Endpoints
```
GET    /api/clients               - Get all clients
GET    /api/clients/{id}          - Get by ID
GET    /api/clients/search/{keyword}   - Search clients
POST   /api/clients               - Create client
PUT    /api/clients/{id}          - Update client
DELETE /api/clients/{id}          - Delete client
```

### Invoices Endpoints
```
GET    /api/invoices              - Get all invoices
GET    /api/invoices/{id}         - Get by ID
GET    /api/invoices/status/{status}   - Filter by status
POST   /api/invoices              - Create invoice
PUT    /api/invoices/{id}/status/{status}  - Update status
POST   /api/invoices/{id}/send-email?email=...  - Send email
DELETE /api/invoices/{id}         - Delete invoice
```

## Technologies Used

### Backend
- Spring Boot 3.2
- Spring Data JPA
- MySQL 8
- Lombok
- Spring Mail
- iText (PDF generation)

### Frontend
- React 18
- React Router 6
- Axios
- Tailwind CSS
- Lucide React Icons
- Vite

## Production Deployment

### Backend Deployment (AWS EC2 Example)
```bash
# Build JAR
mvn clean package

# Copy to server
scp target/billing-system-1.0.0.jar user@server:/app/

# Run on server
ssh user@server
cd /app
nohup java -jar billing-system-1.0.0.jar &
```

### Frontend Deployment (Vercel Example)
```bash
# Build
npm run build

# Deploy using Vercel CLI
npm i -g vercel
vercel
```

## Troubleshooting Guide

See individual README files in `billing-backend/` and `billing-frontend/` for detailed troubleshooting.

## Support

For issues or questions:
1. Check the README in each directory
2. Review error messages in console/terminal
3. Check application logs in `/logs` directory (if logging is configured)

## License

This project is provided as-is for educational and commercial use.
