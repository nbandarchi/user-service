# User Management Service

A modern, type-safe user management service built with Node.js, TypeScript, and PostgreSQL. This service provides essential user management functionality including authentication, profile management, and access control.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- PostgreSQL 14 or later
- npm or yarn
- Docker (optional, for containerized database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/user-service.git
   cd user-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database**
   ```bash
   # Using Docker (recommended)
   docker-compose up -d
   
   # Or start your local PostgreSQL instance
   # Make sure to update .env with your connection details
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run db:studio` - Launch database GUI (DBeaver/BeeKeeper)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure

```
.
├── src/                    # Source code
│   ├── db/                # Database configuration and migrations
│   ├── routes/            # API routes
│   └── test-utils/        # Testing utilities
├── test/                  # Test files
├── .env                   # Environment variables
└── package.json           # Project configuration
```

## 📚 API Documentation

Once the server is running, you can access:

- **API Documentation**: `http://localhost:3000/api-docs` (Swagger UI)
- **Health Check**: `http://localhost:3000/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript and Node.js
- Uses Drizzle ORM for type-safe database operations
- Tested with Vitest
- Containerized with Docker

---

<div align="center">
  <p>Made with ❤️ by Your Team Name</p>
  <p>✨ Happy Coding!</p>
</div>
