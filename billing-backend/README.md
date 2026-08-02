# Jainam Billing System - Backend

Spring Boot REST API backend for the Jainam Billing Management System.

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- MySQL 8.0+

## Setup Instructions

### 1. Database Setup

Create MySQL database:
```sql
CREATE DATABASE IF NOT EXISTS jainam_billing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Environment Variables

Create a `.env` file in the project root or set system environment variables:

```
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASSWORD=your-app-password
```

**Note:** For Gmail, use an [App Password](https://myaccount.google.com/apppasswords), not your regular password.

### 3. Application Configuration

Edit `src/main/resources/application.yml`:
- Update database URL if using non-local MySQL
- Verify CORS origins for frontend

### 4. Build and Run

```bash
# Build the project
mvn clean package

# Run the application
mvn spring-boot:run

# Or run the JAR
java -jar target/billing-system-1.0.0.jar
```

The backend API will be available at `http://localhost:8080/api`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search/{keyword}` - Search products
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/{id}` - Get client by ID
- `GET /api/clients/search/{keyword}` - Search clients
- `POST /api/clients` - Create client
- `PUT /api/clients/{id}` - Update client
- `DELETE /api/clients/{id}` - Delete client

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/{id}` - Get invoice by ID
- `GET /api/invoices/status/{status}` - Get invoices by status (PENDING, PAID, OVERDUE, CANCELLED)
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/{id}/status/{status}` - Update invoice status
- `POST /api/invoices/{id}/send-email?email=recipient@email.com` - Send invoice via email
- `DELETE /api/invoices/{id}` - Delete invoice

## Sample Data

Sample data is automatically loaded on first run, including:
- 10 products in various categories
- 8 client companies
- 5 sample invoices with line items

## Technologies

- Spring Boot 3.2
- Spring Data JPA
- MySQL 8
- Lombok
- Spring Mail
- iText (PDF generation)

## Troubleshooting

**Port already in use:**
```bash
# Change port in application.yml
server:
  port: 8081
```

**Email not sending:**
- Verify GMAIL_USER and GMAIL_PASSWORD are set
- Enable "Less secure app access" or use App Password
- Check firewall allows port 587

**Database connection error:**
- Ensure MySQL is running
- Check database URL and credentials in application.yml
- Verify database exists
