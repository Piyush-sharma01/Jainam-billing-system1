# Jainam Billing System - Frontend

React + Vite frontend for the Jainam Billing Management System.

## Prerequisites

- Node.js 16+ and npm/yarn/pnpm

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Configuration

The API is configured in `src/services/api.js` to connect to:
```
http://localhost:8080/api
```

If your backend is running on a different URL, update this file.

## Features

- **Login Page**: Demo authentication (admin/password)
- **Dashboard**: Overview with summary cards and recent invoices
- **Products**: Create, read, update, delete products with search
- **Clients**: Manage client information
- **Billing**: Create invoices with dynamic line items and automatic calculations
- **Invoice History**: View all invoices, filter by status, send emails, download PDFs

## Demo Credentials

- **Username**: admin
- **Password**: password

## API Integration

The frontend connects to the Spring Boot backend via REST API. All API calls are centralized in `src/services/api.js`:

- **Products API**: CRUD operations and search
- **Clients API**: CRUD operations and search  
- **Invoices API**: CRUD operations, status updates, email sending

## Technology Stack

- React 18
- React Router 6
- Axios for HTTP requests
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

## Troubleshooting

**Backend connection error:**
- Ensure backend is running on `http://localhost:8080`
- Check CORS is enabled in backend
- Verify API URL in `src/services/api.js`

**Styling not working:**
- Run `npm install` to ensure Tailwind is installed
- Check `postcss.config.js` and `tailwind.config.js` are in place
- Restart dev server: `npm run dev`

**Build errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for syntax errors in JSX files
- Ensure all imports are correct
