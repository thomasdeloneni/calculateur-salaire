# Assistant Maternel Salary Calculator - Backend API

A REST API backend for calculating assistant maternel salaries with user authentication and configurable calculation parameters.

## Architecture

This project follows **Clean Architecture** and **SOLID** principles:

### Clean Architecture Layers
```
src/
├── controllers/    # HTTP request handlers (UI Layer)
├── services/       # Business logic (Application Layer)
├── repositories/   # Data access (Domain Layer)
├── models/         # Domain entities
├── interfaces/     # Contracts (ISP)
├── middleware/     # HTTP middleware
├── dto/            # Data Transfer Objects
├── config/         # Configuration
└── utils/          # Utilities (DIC, ServiceFactory)
```

### SOLID Principles Applied
- **S**ingle Responsibility: Each class has one purpose
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Interfaces properly designed
- **I**nterface Segregation: Small, specific interfaces
- **D**ependency Injection: Dependencies injected via constructor

## Features

- **User Authentication**: Register and login with JWT tokens (Argon2i password hashing)
- **Configurable Calculations**: Users can customize calculation parameters
- **Salary Calculation**: Calculate salary based on presence days and expenses
- **Calculation History**: Save and retrieve past calculations

## Tech Stack

- Node.js + Express
- MySQL (mysql2/promise)
- Argon2 for password hashing
- JWT for authentication
- Jest + Supertest for testing

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your database connection in `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=assistant_salary
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   ```

5. Initialize the database:
   ```bash
   npm run init-db
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Configuration

All configuration endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

#### Get Configuration
```http
GET /config
```

**Response (200 OK):**
```json
{
  "days_per_month": 4.22,
  "hours_per_day": 8.0,
  "expense_per_day": 3.69,
  "salary_multiplier": 9.5,
  "expense_multiplier": 1.0
}
```

#### Update Configuration
```http
PUT /config
Content-Type: application/json

{
  "days_per_month": 5.0,
  "hours_per_day": 7.5,
  "expense_per_day": 4.0,
  "salary_multiplier": 10.0,
  "expense_multiplier": 1.2
}
```

**Response (200 OK):**
```json
{
  "message": "Configuration updated successfully",
  "config": {
    "days_per_month": 5.0,
    "hours_per_day": 7.5,
    "expense_per_day": 4.0,
    "salary_multiplier": 10.0,
    "expense_multiplier": 1.2
  }
}
```

### Calculator

#### Calculate Salary
```http
POST /calculate
Content-Type: application/json
Authorization: Bearer <token>

{
  "days_presence": 20,
  "days_expense": 15
}
```

**Response (200 OK):**
```json
{
  "days_presence": 20,
  "days_expense": 15,
  "hours_total": 160,
  "salary_base": 801.8,
  "expense_total": 55.35,
  "grand_total": 857.15
}
```

#### Get Calculation History
```http
GET /calculate
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "days_presence": 20,
    "days_expense": 15,
    "hours_total": 160,
    "salary_base": 801.8,
    "expense_total": 55.35,
    "grand_total": 857.15,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## Calculation Formula

```
hours_total = days_presence × hours_per_day
salary_base = days_presence × days_per_month × salary_multiplier
expense_total = days_expense × expense_per_day × expense_multiplier
grand_total = salary_base + expense_total
```

### Default Configuration Values
- `days_per_month`: 4.22
- `hours_per_day`: 8.0
- `expense_per_day`: 3.69
- `salary_multiplier`: 9.5
- `expense_multiplier`: 1.0

## Testing

Run all tests with coverage:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MySQL connection pool
│   │   └── initDb.js        # Database initialization
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── ConfigController.js
│   │   └── CalculationController.js
│   ├── dto/
│   │   ├── RegisterUserDTO.js
│   │   ├── LoginUserDTO.js
│   │   ├── UpdateConfigDTO.js
│   │   └── SalaryInputDTO.js
│   ├── interfaces/
│   │   ├── IUserRepository.js
│   │   ├── IConfigRepository.js
│   │   ├── ICalculationRepository.js
│   │   ├── IPasswordHasher.js
│   │   ├── ITokenService.js
│   │   └── ISalaryCalculator.js
│   ├── middleware/
│   │   └── AuthMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── UserConfig.js
│   │   ├── Calculation.js
│   │   └── SalaryResult.js
│   ├── repositories/
│   │   ├── UserRepository.js
│   │   ├── ConfigRepository.js
│   │   └── CalculationRepository.js
│   ├── services/
│   │   ├── PasswordHasher.js
│   │   ├── TokenService.js
│   │   ├── SalaryCalculator.js
│   │   ├── AuthService.js
│   │   ├── ConfigService.js
│   │   └── CalculationService.js
│   ├── utils/
│   │   ├── DIContainer.js
│   │   └── ServiceFactory.js
│   └── index.js
├── tests/
│   ├── RegisterUserDTO.test.js
│   ├── UpdateConfigDTO.test.js
│   ├── SalaryInputDTO.test.js
│   ├── SalaryCalculator.test.js
│   ├── User.test.js
│   ├── UserConfig.test.js
│   └── api.test.js
├── .env
├── .env.example
├── package.json
└── README.md
```

## License

ISC
