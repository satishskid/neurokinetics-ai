# NeuroKinetics AI

**An intelligent platform for autism screening, assessment, and intervention support**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1.svg)](https://www.postgresql.org/)

## 🎯 Overview

NeuroKinetics AI is a comprehensive healthcare platform designed to support autism screening, assessment, and intervention planning. Built with modern web technologies, it provides AI-powered tools for healthcare providers and family-friendly resources for parents.

### Key Features

- **🔬 AI-Powered Screening**: Computer vision-based assessment tools
- **📊 Clinical Assessment**: Comprehensive evaluation and reporting
- **🤖 CareBuddy AI**: Intelligent assistant for parents and providers
- **📈 Progress Tracking**: Intervention monitoring and analytics
- **📚 Educational Resources**: Evidence-based content library
- **🔐 Secure & Compliant**: HIPAA-compliant with role-based access

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Modern UI/UX  │  Real-time Updates  │  Mobile      │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┼────────────────────────────────┘
                            │ HTTPS/WebSocket
┌───────────────────────────┼────────────────────────────────┐
│                      Backend (Encore.ts)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  REST APIs  │  AI Services  │  Clinical Protocols  │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┼────────────────────────────────┘
                            │ SQL
┌───────────────────────────┼────────────────────────────────┐
│                      PostgreSQL Database                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Assessment Data  │  Clinical Data  │  User Data   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18.0.0+
- PostgreSQL v14.0+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/neurokinetics-ai.git
cd neurokinetics-ai

# Install Encore CLI
curl -L https://encore.dev/install.sh | bash

# Setup backend
cd backend
npm install
encore db create neurokinetics
encore run

# Setup frontend (in new terminal)
cd ../frontend
npm install
npm run generate-client
npm run dev
```

Visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Documentation: http://localhost:4000/docs

## 📖 Documentation

### 📋 User Manual
Complete guide for all user roles (Parents, Providers, Admins)
- **[View User Manual](USER_MANUAL.md)**
- Features overview and step-by-step guides
- Role-specific instructions and best practices

### 💻 Developer Manual
Comprehensive development guide for contributors
- **[View Developer Manual](DEVELOPER_MANUAL.md)**
- Architecture overview and technology stack
- Development environment setup
- API documentation and testing

### 🚀 Deployment Guide
Production deployment instructions for various platforms
- **[View Deployment Guide](DEPLOYMENT_GUIDE.md)**
- Cloud deployment (AWS, GCP, Azure)
- Docker and Kubernetes configurations
- Security and monitoring setup

## 🛠️ Technology Stack

### Backend
- **Framework**: Encore.ts (TypeScript)
- **Database**: PostgreSQL with SQL migrations
- **Authentication**: JWT with role-based access control
- **AI/ML**: Computer vision and NLP services
- **APIs**: RESTful with OpenAPI documentation

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query
- **Routing**: React Router v6

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes (optional)
- **Cloud**: AWS, GCP, Azure support
- **CI/CD**: GitHub Actions (configurable)
- **Monitoring**: Prometheus + Grafana

## 🔧 Development

### Project Structure
```
neurokinetics-ai/
├── backend/                 # Encore.ts backend
│   ├── analysis/           # AI analysis services
│   ├── assessment/         # Assessment management
│   ├── auth/              # Authentication
│   ├── carebuddy/         # AI assistant
│   ├── child/             # Child profiles
│   ├── db/                # Database migrations
│   ├── intervention/      # Intervention planning
│   ├── knowledge/         # Clinical protocols
│   ├── report/           # Report generation
│   ├── screening/        # Screening services
│   └── user/             # User management
├── frontend/              # React frontend
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities and types
│   └── client.ts         # Auto-generated API client
└── docs/                 # Documentation
```

### Key Features by Module

#### 🧠 Assessment & Screening
- **Comprehensive Screening**: Multi-domain assessment (social, motor, attention, sensory)
- **AI Analysis**: Computer vision for behavioral analysis
- **Progressive Assessment**: Age-appropriate tasks and activities
- **Clinical Reports**: Detailed findings with visual analytics

#### 🤖 CareBuddy AI
- **Parent Support**: Empathetic guidance and daily care strategies
- **Provider Tools**: Clinical decision support and protocols
- **Educational Content**: Evidence-based recommendations
- **24/7 Availability**: Always-on AI assistance

#### 📊 Intervention Planning
- **Personalized Plans**: Tailored intervention strategies
- **Goal Setting**: SMART goals with progress tracking
- **Daily Schedules**: Structured activity planning
- **Progress Monitoring**: Real-time analytics and reporting

#### 📚 Knowledge Base
- **Clinical Protocols**: Evidence-based treatment protocols
- **Educational Resources**: Parent-friendly educational content
- **Research Integration**: Latest autism research findings
- **Multi-language Support**: Content in multiple languages

## 🔐 Security & Compliance

### Security Features
- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: At-rest and in-transit encryption
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting and DDoS protection

### Compliance
- **HIPAA Compliant**: Healthcare data protection standards
- **GDPR Ready**: European data protection regulations
- **SOC 2 Type II**: Security and availability controls
- **FERPA Compliant**: Educational records protection

## 🧪 Testing

### Test Coverage
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test

# End-to-end tests
npm run test:e2e
```

### Quality Assurance
- **Unit Tests**: Comprehensive unit test coverage
- **Integration Tests**: API and database integration
- **E2E Tests**: Full user journey testing
- **Performance Tests**: Load and stress testing
- **Security Tests**: Vulnerability scanning and penetration testing

## 📊 Monitoring & Analytics

### Application Monitoring
- **Performance Metrics**: Response times, throughput, error rates
- **Health Checks**: System health and availability monitoring
- **Error Tracking**: Real-time error monitoring and alerting
- **User Analytics**: User behavior and engagement metrics

### Infrastructure Monitoring
- **Resource Usage**: CPU, memory, disk, network monitoring
- **Database Performance**: Query performance and connection pooling
- **Log Aggregation**: Centralized logging and analysis
- **Alerting**: Automated alerts for critical issues

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📞 Support

### Documentation
- **User Manual**: [USER_MANUAL.md](USER_MANUAL.md)
- **Developer Manual**: [DEVELOPER_MANUAL.md](DEVELOPER_MANUAL.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Community
- **Issues**: [GitHub Issues](https://github.com/your-org/neurokinetics-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/neurokinetics-ai/discussions)
- **Wiki**: [Project Wiki](https://github.com/your-org/neurokinetics-ai/wiki)

### Contact
- **Email**: support@neurokinetics-ai.com
- **Security**: security@neurokinetics-ai.com
- **Business**: business@neurokinetics-ai.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Clinical Advisors**: Autism specialists and healthcare providers
- **Technical Contributors**: Open source community contributors
- **Research Partners**: Academic institutions and research organizations
- **User Community**: Parents, providers, and individuals who provided feedback

---

**Made with ❤️ for the autism community**

*NeuroKinetics AI - Empowering families and providers with intelligent tools for autism care*