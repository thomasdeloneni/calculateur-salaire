# Assistant Maternel Salary Calculator - Backend

REST API backend for the assistant maternel salary calculator app. Built with Express.js and MySQL using Clean Architecture principles.

## Features

- **Authentication**: JWT-based user registration and login
- **Salary Calculator**: Calculate salaries based on presence days and expenses
- **Configuration**: Customizable calculation parameters
- **History**: Save and view calculation history
- **Clean Architecture**: Domain models, DTOs, repositories, services, and controllers

## Tech Stack

- Node.js + Express.js
- MySQL with mysql2
- JWT for authentication
- Argon2 for password hashing
- Jest for testing

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # HTTP request handlers
│   ├── dto/           # Data Transfer Objects
│   ├── interfaces/    # Interface definitions
│   ├── middleware/    # Express middleware
│   ├── models/        # Domain models
│   ├── repositories/  # Database operations
│   ├── services/      # Business logic
│   └── utils/         # Utility functions
├── tests/             # Unit tests
├── schema.sql         # Database schema
├── package.json
└── .env.example
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile

### Calculator
- `GET /api/calculator/preview` - Quick preview calculation
- `POST /api/calculator/calculate` - Calculate salary (no save)
- `POST /api/calculator/save` - Calculate and save to history

### Configuration
- `GET /api/config` - Get user configuration
- `PUT /api/config` - Update configuration
- `DELETE /api/config` - Reset to defaults

### History
- `GET /api/history` - Get calculation history
- `GET /api/history/:id` - Get single calculation
- `DELETE /api/history/:id` - Delete calculation
- `DELETE /api/history` - Clear all history

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

3. Configure database in `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=assistant_salary_db
   ```

4. Create database and run schema:
   ```bash
   mysql -u root -p < schema.sql
   ```

5. Start server:
   ```bash
   npm run dev
   ```

## Testing

```bash
npm test
```

## License

ISC
