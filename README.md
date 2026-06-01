# 🎓 School Management Backend

Production-grade **Node.js (Express) + MongoDB** backend for a comprehensive School Management System. Features role-based access control, academic module management, attendance tracking, and multi-channel communications.

![Node.js](https://img.shields.io/badge/Node.js-Latest-green?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-black?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-13AA52?style=flat-square&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Core Features

### 🔐 **Authentication & Authorization**
- **JWT Authentication** (Access + Refresh tokens)
- **Role-Based Access Control (RBAC)**
  - Admin
  - Teacher
  - Student
  - Parent
  - Accountant
  - Super Admin
- Email verification
- Password reset with email confirmation

### 📚 **Academic Management**
- **Classes & Sections** - Organize students by class
- **Subjects & Curricula** - Subject management and curriculum mapping
- **Class Schedules** - Timetable management
- **Exams** - Exam creation, scheduling, and result management
- **Grades** - Grade entry and transcript generation
- **Assignments** - Assignment creation and submission tracking

### 📋 **Attendance System**
- Attendance marking and tracking
- Attendance reports and summaries
- Parent notifications for absences
- Bulk upload support

### ✍️ **Student Assessments**
- Assignment submission and grading
- Exam scheduling and result management
- Performance analytics
- Grade card generation

### 💰 **Payment & Finance**
- Payment processing and tracking
- Fee management
- Payment status monitoring
- Accounting records
- Financial reports

### 💬 **Communication & Notifications**
- In-app messaging between users
- Email notifications (password reset, assignments, results)
- Parent notifications
- Teacher announcements
- System-wide alerts

### 📁 **File Management**
- Student document uploads
- Assignment submission files
- Academic records storage
- File organization and retrieval

### 📊 **Reporting & Analytics**
- Attendance summaries and reports
- Academic performance reports
- Financial statements
- Custom report generation

### 🛡️ **Security Features**
- Rate limiting
- Security headers
- Centralized error handling
- Input validation and sanitization
- CORS protection

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+
- **npm** or **yarn**
- **MongoDB** 5.0+ (local or cloud - Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kati47/school-backend.git
   cd school-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env file**
   ```env
   # Server
   PORT=3000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/school-management
   
   # Authentication
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_REFRESH_EXPIRE=30d
   
   # Email (Optional - for password reset)
   APP_BASE_URL=http://localhost:3000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@school.com
   SMTP_SECURE=false
   
   # File Uploads
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=10485760
   ```

5. **Start MongoDB** (if local)
   ```bash
   # Using Docker (recommended)
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or local MongoDB service
   mongod
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The API runs on `http://localhost:3000`

---

## 🛠️ Build for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

---

## 📦 Tech Stack

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| **Framework** | Express | 4.x | Web framework |
| **Database** | MongoDB | 6.x | NoSQL database |
| **ODM** | Mongoose | 8.x | Database schema validation |
| **Language** | TypeScript | 5 | Type safety |
| **Authentication** | jsonwebtoken | 9.x | JWT tokens |
| **Password** | bcryptjs | 3.x | Password hashing |
| **Validation** | joi | 17.x | Schema validation |
| **Email** | nodemailer | 6.x | Email delivery |
| **File Upload** | multer | 1.x | Multipart uploads |
| **Testing** | Jest | 29.x | Test framework |
| **API Tests** | Supertest | 6.x | HTTP assertions |
| **Linting** | ESLint | 8.x | Code quality |
| **Formatting** | Prettier | 3.x | Code formatting |
| **Pre-commit** | Husky | 8.x | Git hooks |
| **API Docs** | Swagger | 3.x | API documentation |

---

## 📁 Project Structure

```
school-backend/
├── src/
│   ├── routes/                 # API route definitions
│   │   ├── auth.ts             # Authentication endpoints
│   │   ├── users.ts            # User management
│   │   ├── academics.ts        # Academic module routes
│   │   ├── attendance.ts       # Attendance routes
│   │   ├── assignments.ts      # Assignment endpoints
│   │   ├── exams.ts            # Exam management
│   │   ├── payments.ts         # Payment processing
│   │   ├── messages.ts         # Messaging system
│   │   └── reports.ts          # Report generation
│   ├── middleware/             # Custom middleware
│   │   ├── auth.ts             # Authentication/authorization
│   │   ├── errorHandler.ts     # Error handling
│   │   ├── validation.ts       # Input validation
│   │   └── rateLimit.ts        # Rate limiting
│   ├── models/                 # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Student.ts
│   │   ├── Class.ts
│   │   ├── Subject.ts
│   │   ├── Exam.ts
│   │   ├── Grade.ts
│   │   ├── Attendance.ts
│   │   ├── Assignment.ts
│   │   ├── Payment.ts
│   │   └── Message.ts
│   ├── controllers/            # Business logic
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── academicController.ts
│   │   ├── attendanceController.ts
│   │   └── ...
│   ├── services/               # Business services
│   │   ├── emailService.ts
│   │   ├── paymentService.ts
│   │   ├── reportService.ts
│   │   └── ...
│   ├── utils/                  # Helper functions
│   ├── types/                  # TypeScript types
│   ├── config/                 # Configuration
│   └── app.ts                  # Express app setup
├── tests/                      # Jest test files
├── docs/                       # Documentation
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-integration.md
│   ├── deployment.md
│   └── development-setup.md
├── .env.example                # Environment template
├── .eslintrc.js                # ESLint config
├── .prettierrc                 # Prettier config
├── jest.config.js              # Jest config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🔌 API Endpoints Overview

### Authentication
```
POST   /auth/register           - User registration
POST   /auth/verify-email       - Email verification
POST   /auth/login              - User login
POST   /auth/refresh            - Refresh access token
POST   /auth/forgot-password    - Request password reset
POST   /auth/reset-password     - Reset password with token
```

### Users
```
GET    /users                   - List all users (admin)
GET    /users/:id               - Get user profile
PUT    /users/:id               - Update user (admin)
DELETE /users/:id               - Delete user (admin)
```

### Academics
```
GET    /academics/classes       - List classes
POST   /academics/classes       - Create class (admin)
GET    /academics/subjects      - List subjects
POST   /academics/subjects      - Create subject (admin)
GET    /academics/schedule      - View schedule
```

### Attendance
```
GET    /attendance              - Get attendance records
POST   /attendance              - Mark attendance
GET    /attendance/report       - Generate attendance report
PUT    /attendance/:id          - Update attendance record
```

### Assignments
```
GET    /assignments             - List assignments
POST   /assignments             - Create assignment
POST   /assignments/:id/submit  - Submit assignment
GET    /assignments/:id/submissions - View submissions
```

### Exams
```
GET    /exams                   - List exams
POST   /exams                   - Create exam (admin)
POST   /exams/:id/results       - Upload exam results
GET    /exams/:id/results       - View exam results
```

### Payments
```
GET    /payments                - List payments
POST   /payments                - Process payment
GET    /payments/:id            - Get payment status
```

### Messages
```
GET    /messages                - Get conversations
POST   /messages                - Send message
GET    /messages/:conversationId - Get conversation
```

### File Uploads
```
POST   /files/upload            - Upload file
GET    /files/:id               - Download file
```

### Reports
```
GET    /reports/attendance      - Attendance summary report
GET    /reports/academic        - Academic performance report
GET    /reports/financial       - Financial statement
```

### Health Checks
```
GET    /health/live             - Liveness check
GET    /health/ready            - Readiness check
```

---

## 💡 Usage

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start with nodemon (auto-reload) |
| `build` | `npm run build` | Compile TypeScript |
| `start` | `npm start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `format` | `npm run format` | Format code with Prettier |
| `test` | `npm run test` | Run test suite |
| `test:cov` | `npm run test:cov` | Run tests with coverage |

### API Documentation

Access interactive API documentation:
```
http://localhost:3000/docs
```

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage report
npm run test:cov

# Run specific test file
npm test -- attendance.test.ts

# Watch mode
npm test -- --watch
```

**Test Coverage Includes:**
- ✅ Authentication and authorization
- ✅ User management
- ✅ Academic operations
- ✅ Attendance tracking
- ✅ Payment processing
- ✅ Error handling

---

## 🔒 Security Best Practices

- ✅ JWT authentication with expiration
- ✅ Bcrypt password hashing
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ Environment variable protection
- ✅ Rate limiting on API endpoints
- ✅ Security headers (HELMET)
- ✅ HTTPS in production (recommended)
- ✅ MongoDB injection prevention
- ✅ XSS protection

---

## 📧 Email Configuration

To enable email notifications (password reset, assignments, results):

1. **Gmail Setup** (Recommended for development)
   - Enable 2-Factor Authentication
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use the generated password in `SMTP_PASS`

2. **Other Email Providers**
   - Update `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - Ensure `SMTP_FROM` is a valid email from your provider

3. **Test Email**
   ```bash
   # Email will be sent on password reset requests
   POST /auth/forgot-password
   ```

---

## 🚀 Deployment

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Deployment Guides
See `docs/deployment.md` for:
- AWS EC2 deployment
- Heroku deployment
- Docker containerization
- GitHub Actions CI/CD
- Environment setup

---

## 📄 Additional Documentation

- **Architecture**: `docs/architecture.md` - System design and components
- **Database Schema**: `docs/database-schema.md` - Data models
- **API Integration**: `docs/frontend-api-integration.md` - Frontend guide
- **Development Setup**: `docs/development-setup.md` - Local setup
- **Deployment**: `docs/deployment.md` - Production deployment
- **Contributing**: `CONTRIBUTING.md` - Contribution guidelines
- **Roadmap**: `docs/roadmap.md` - Feature roadmap

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Add tests for new features
5. Run linter and tests: `npm run lint && npm test`
6. Commit with meaningful message (`git commit -m 'Add AmazingFeature'`)
7. Push to branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### Code Guidelines
- Follow TypeScript strict mode
- Write meaningful commit messages
- Add JSDoc comments for functions
- Include tests for new features
- Maintain code coverage above 80%

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Kati47** - [GitHub Profile](https://github.com/Kati47)

### Support & Contact

For questions or issues:
- Open an issue on [GitHub](https://github.com/Kati47/school-backend/issues)
- Check existing documentation in `docs/`
- Contact: [Kati47](https://github.com/Kati47)

---

**Built with ❤️ for educational excellence**
