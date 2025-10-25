# NeuroKinetics AI - Developer Manual

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Development Environment Setup](#development-environment-setup)
5. [Backend Development](#backend-development)
6. [Frontend Development](#frontend-development)
7. [Database Design](#database-design)
8. [API Documentation](#api-documentation)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Contributing Guidelines](#contributing-guidelines)

---

## Architecture Overview

NeuroKinetics AI follows a **modern full-stack architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Pages & Components  │  State Management │  Styling  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                │
└───────────────────────────┼────────────────────────────────┘
                            │ HTTP/WebSocket
┌───────────────────────────┼────────────────────────────────┐
│                      Backend (Encore.ts)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Services  │  Business Logic  │  Data Access  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                │
└───────────────────────────┼────────────────────────────────┘
                            │ SQL Queries
┌───────────────────────────┼────────────────────────────────┐
│                      PostgreSQL Database                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Clinical Data  │  User Data  │  Assessment Data  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles
- **Microservices Architecture**: Modular service design
- **Type Safety**: Full TypeScript implementation
- **API-First Design**: RESTful APIs with OpenAPI documentation
- **Database-First**: Schema-driven development
- **Security-First**: Authentication and authorization at every layer

---

## Technology Stack

### Backend Technologies
- **Runtime**: Node.js with Encore.ts framework
- **Language**: TypeScript
- **Database**: PostgreSQL with SQL migrations
- **Authentication**: JWT-based with role-based access control
- **AI/ML**: Integration with computer vision services
- **Caching**: Built-in Encore caching
- **Logging**: Structured logging with Encore

### Frontend Technologies
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query for server state
- **Routing**: React Router v6
- **HTTP Client**: Axios with auto-generated types
- **Icons**: Lucide React

### Development Tools
- **Package Manager**: npm/bun
- **Version Control**: Git
- **Database Migrations**: SQL-based with versioning
- **API Documentation**: Auto-generated OpenAPI specs
- **Testing**: Jest for backend, Vitest for frontend

---

## Project Structure

```
neurokinetics-ai/
├── backend/                    # Encore.ts backend application
│   ├── analysis/              # AI analysis services
│   ├── assessment/            # Assessment management
│   ├── auth/                  # Authentication & authorization
│   ├── carebuddy/             # AI assistant services
│   ├── child/                 # Child profile management
│   ├── db/                    # Database migrations and utilities
│   ├── intervention/           # Intervention planning
│   ├── knowledge/            # Clinical protocols & education
│   ├── report/               # Report generation
│   ├── screening/            # Screening services
│   ├── user/                 # User management
│   ├── encore.app            # Encore application configuration
│   └── package.json          # Backend dependencies
├── frontend/                  # React frontend application
│   ├── components/           # Reusable UI components
│   ├── pages/               # Page components
│   ├── lib/                 # Utility functions and types
│   ├── client.ts            # Auto-generated API client
│   ├── App.tsx              # Main application component
│   └── package.json         # Frontend dependencies
├── DEVELOPMENT.md           # Development setup instructions
├── USER_MANUAL.md         # User documentation
└── README.md              # Project overview
```

### Backend Service Organization
Each service follows a consistent structure:
```
service-name/
├── service.ts      # Main service implementation
├── types.ts        # TypeScript type definitions
├── utils.ts        # Service-specific utilities
└── tests/          # Service tests
```

---

## Development Environment Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **Git**: For version control
- **Encore CLI**: For backend development

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/neurokinetics-ai.git
cd neurokinetics-ai
```

#### 2. Install Encore CLI
```bash
# macOS
brew install encoredev/tap/encore

# Linux
sudo curl -L https://encore.dev/install.sh | bash

# Windows
# Download from https://encore.dev/docs/install
```

#### 3. Setup Backend
```bash
cd backend
npm install

# Setup database
encore db create neurokinetics
encore db migrate

# Run backend
encore run
```

#### 4. Setup Frontend
```bash
cd ../frontend
npm install

# Generate API client
npm run generate-client

# Run frontend
npm run dev
```

#### 5. Environment Configuration
Create `.env` files for both frontend and backend:

**Backend (.env.local)**
```env
DATABASE_URL=postgresql://localhost/neurokinetics
JWT_SECRET=your-secret-key
AI_SERVICE_URL=http://localhost:8080
```

**Frontend (.env.local)**
```env
VITE_API_URL=http://localhost:4000
VITE_CLIENT_TARGET=http://localhost:4000
```

---

## Backend Development

### Service Development Pattern

#### 1. Creating a New Service
```typescript
// service.ts
import { api } from "encore.dev/api";
import { log } from "encore.dev/log";

export interface CreateRequest {
  name: string;
  description?: string;
}

export interface CreateResponse {
  id: number;
  createdAt: Date;
}

// API endpoint
export const create = api(
  { method: "POST", path: "/service-name", auth: true },
  async (req: CreateRequest): Promise<CreateResponse> => {
    log.info("Creating new service", { name: req.name });
    
    // Implementation logic
    return {
      id: 1,
      createdAt: new Date()
    };
  }
);
```

#### 2. Database Integration
```typescript
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("service-name", {
  migrations: "./migrations"
});

export async function createRecord(data: CreateRequest) {
  const result = await db.exec`
    INSERT INTO records (name, description, created_at)
    VALUES (${data.name}, ${data.description}, NOW())
    RETURNING id, created_at
  `;
  
  return result.rows[0];
}
```

#### 3. Authentication & Authorization
```typescript
import { auth } from "encore.dev/auth";

// Role-based access control
export const create = api(
  { 
    method: "POST", 
    path: "/service-name", 
    auth: true // Requires authentication
  },
  async (req: CreateRequest, ctx: auth.Context): Promise<CreateResponse> => {
    // Check user role
    if (!ctx.user.roles.includes("admin")) {
      throw new Error("Insufficient permissions");
    }
    
    // Implementation
  }
);
```

### Database Migrations

#### Creating Migrations
```bash
encore db migrate create add_new_table
```

#### Migration Structure
```sql
-- migrations/001_create_tables.up.sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- migrations/001_create_tables.down.sql
DROP TABLE IF EXISTS users;
```

### API Documentation
Encore automatically generates OpenAPI documentation:
```bash
# View API docs
encore run
# Navigate to http://localhost:4000/docs
```

---

## Frontend Development

### Component Development

#### 1. Creating Components with shadcn/ui
```bash
# Add new component
npx shadcn-ui@latest add button

# Use in component
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  );
}
```

#### 2. Page Development Pattern
```typescript
// pages/MyPage.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { backend } from "@/client";

export default function MyPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-data"],
    queryFn: () => backend.service.getData()
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Page</h1>
      {/* Content */}
    </div>
  );
}
```

#### 3. State Management
```typescript
// Using React Query for server state
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

// Using Zustand for client state
import { create } from "zustand";

interface AppState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### Styling with Tailwind CSS
```typescript
// Component with responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Title</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">Content</p>
    </CardContent>
  </Card>
</div>
```

---

## Database Design

### Schema Overview

#### Core Tables
```sql
-- Users and authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Child profiles
CREATE TABLE children (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  age_months INTEGER NOT NULL,
  sex VARCHAR(10),
  developmental_concerns TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assessments
CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  child_id INTEGER REFERENCES children(id),
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Database Best Practices
- **Use migrations**: Never modify schema directly
- **Add indexes**: For frequently queried columns
- **Use constraints**: Ensure data integrity
- **Document schema**: Add comments to tables and columns
- **Backup regularly**: Implement automated backups

---

## API Documentation

### Authentication Endpoints
```typescript
// Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Register
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "role": "parent"
}
```

### Child Management Endpoints
```typescript
// Create child profile
POST /child
{
  "name": "John Doe",
  "ageMonths": 36,
  "sex": "male",
  "developmentalConcerns": "Speech delay"
}

// Get child assessments
GET /child/:id/assessments

// Start screening
POST /screening/start
{
  "childId": 1,
  "type": "comprehensive"
}
```

### CareBuddy AI Endpoints
```typescript
// Send message
POST /carebuddy/message
{
  "conversationId": 1,
  "message": "How can I help my child with social skills?",
  "role": "parent"
}
```

### Report Generation Endpoints
```typescript
// Generate report
POST /report/generate
{
  "assessmentId": 1,
  "type": "clinical"
}

// Get report
GET /report/:id
```

---

## Testing

### Backend Testing
```typescript
// service.test.ts
import { describe, it, expect } from "vitest";
import { create } from "./service";

describe("Service API", () => {
  it("should create a new record", async () => {
    const response = await create({
      name: "Test Record",
      description: "Test description"
    });
    
    expect(response.id).toBeDefined();
    expect(response.name).toBe("Test Record");
  });
});
```

### Frontend Testing
```typescript
// MyComponent.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected text")).toBeInTheDocument();
  });
});
```

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# End-to-end tests
npm run test:e2e
```

---

## Deployment

### Environment Configuration

#### Development
```bash
# Backend
encore run

# Frontend
npm run dev
```

#### Production
```bash
# Build backend
encore build

# Build frontend
npm run build

# Deploy using Encore Cloud
encore deploy
```

### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["encore", "run"]
```

### Environment Variables
```env
# Production environment
NODE_ENV=production
DATABASE_URL=postgresql://prod-db:5432/neurokinetics
JWT_SECRET=your-production-secret
AI_SERVICE_URL=https://ai-service.production.com
```

---

## Contributing Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Conventional Commits**: Standardized commit messages

### Git Workflow
1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

### Code Review Process
1. **Automated Tests**: All tests must pass
2. **Code Quality**: Meet linting and formatting standards
3. **Documentation**: Update relevant documentation
4. **Security Review**: Ensure no security vulnerabilities
5. **Performance**: Consider performance implications

### Security Guidelines
- **Never commit secrets**: Use environment variables
- **Input validation**: Validate all user inputs
- **SQL injection prevention**: Use parameterized queries
- **Authentication**: Implement proper auth checks
- **Data encryption**: Encrypt sensitive data

---

## Performance Optimization

### Backend Optimization
- **Database indexing**: Optimize query performance
- **Caching**: Implement Redis caching where appropriate
- **Connection pooling**: Optimize database connections
- **Async processing**: Use background jobs for heavy tasks

### Frontend Optimization
- **Code splitting**: Lazy load components
- **Image optimization**: Compress and serve appropriate formats
- **Bundle analysis**: Monitor bundle size
- **Caching strategies**: Implement proper HTTP caching

### Monitoring
- **Application monitoring**: Track performance metrics
- **Error tracking**: Monitor and alert on errors
- **User analytics**: Track user behavior and engagement
- **Health checks**: Implement system health monitoring

---

## Resources

### Documentation
- [Encore.ts Documentation](https://encore.dev/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Community
- [Encore Community](https://encore.dev/community)
- [React Community](https://react.dev/community)
- [TypeScript Community](https://www.typescriptlang.org/community/)

### Tools
- [Encore CLI](https://encore.dev/docs/install)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)

---

*This manual is updated regularly. For the latest version, visit: docs.neurokinetics-ai.com/developers*