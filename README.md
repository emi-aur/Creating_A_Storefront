# Storefront Backend API

## Technology Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **db-migrate** - Database migrations
- **Jasmine** - Testing framework
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Creating_A_Storefront
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Start PostgreSQL with Docker

```bash
docker-compose up -d
```

#### Or manually create databases in PostgreSQL:

```sql
CREATE DATABASE storefront;
CREATE DATABASE storefront_test;
CREATE USER user1 WITH PASSWORD '123456789';
GRANT ALL PRIVILEGES ON DATABASE storefront TO user1;
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO user1;
```

### 4. Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=user1
POSTGRES_PASSWORD=123456789

# Bcrypt Configuration
BCRYPT_PASSWORD=your-secret-pepper-here
SALT_ROUNDS=10

# JWT Configuration
TOKEN_SECRET=your-jwt-secret-token-here

# Environment
ENV=dev
```

### 5. Run Database Migrations

```bash
db-migrate up
```

This creates the following tables:

- `products` - Product catalog
- `users` - User accounts with hashed passwords
- `orders` - Order information

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

### Build & Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

## API Endpoints

### Products

| Method | Endpoint            | Auth Required | Description        |
| ------ | ------------------- | ------------- | ------------------ |
| GET    | `/api/products`     | ❌ No         | Get all products   |
| GET    | `/api/products/:id` | ❌ No         | Get product by ID  |
| POST   | `/api/products`     | ✅ Yes        | Create new product |

### Users

| Method | Endpoint           | Auth Required | Description             |
| ------ | ------------------ | ------------- | ----------------------- |
| POST   | `/api/users`       | ❌ No         | Register new user       |
| POST   | `/api/users/login` | ❌ No         | Login and get JWT token |
| GET    | `/api/users`       | ✅ Yes        | Get all users           |
| GET    | `/api/users/:id`   | ✅ Yes        | Get user by ID          |

### Orders

| Method | Endpoint          | Auth Required | Description      |
| ------ | ----------------- | ------------- | ---------------- |
| GET    | `/api/orders`     | ✅ Yes        | Get all orders   |
| GET    | `/api/orders/:id` | ❌ No         | Get order by ID  |
| POST   | `/api/orders`     | ❌ No         | Create new order |

## Authentication

This API uses JWT (JSON Web Tokens) for authentication.

### Step 1: Register a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "password": "securePassword123"
  }'
```

### Step 2: Login to Get Token

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "password": "securePassword123"
  }'
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 3: Use Token for Protected Routes

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "New Product",
    "price": 99.99
  }'
```

## Testing

The project includes comprehensive test suites for all models:

```bash
# Run all tests
npm test

# Tests are automatically run against test database
# Database is created, migrated, tested, and dropped automatically
```

Test files are located in `src/models/tests/`:

- `user.spec.ts` - User model tests
- `products.spec.ts` - Product model tests
- `orders.spec.ts` - Order model tests

## Project Structure

```
Creating_A_Storefront/
├── src/
│   ├── models/          # Database models
│   │   ├── tests/       # Model test suites
│   │   ├── user.ts
│   │   ├── products.ts
│   │   └── orders.ts
│   ├── routes/          # API routes
│   │   ├── api/
│   │   │   ├── users.ts
│   │   │   ├── products.ts
│   │   │   └── orders.ts
│   │   └── index.ts
│   ├── middleware/      # Custom middleware
│   │   └── auth.ts      # JWT verification
│   ├── database.ts      # Database connection
│   └── server.ts        # Express app
├── migrations/          # Database migrations
├── spec/                # Test configuration
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment file
├── database.json        # Database configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies & scripts
└── README.md           # This file
```

## Security Features

- **Password Hashing:** All passwords are hashed using bcrypt with salt and pepper
- **JWT Authentication:** Protected routes require valid JWT tokens
- **Environment Variables:** Sensitive data stored in `.env` (not committed)
- **CORS Enabled:** Cross-origin requests allowed for frontend integration

## Database Schema

### Products Table

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price NUMERIC NOT NULL
);
```

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  password_digest VARCHAR(255) NOT NULL
);
```

### Orders Table

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  order_id INTEGER,
  quantity NUMERIC,
  order_status BOOLEAN
);
```
