# NeuroKinetics AI Demo Mode Guide

## Overview

The demo mode provides a comprehensive way to showcase all features of the NeuroKinetics AI platform without requiring real user accounts or clinical data. It includes pre-populated demo users, children profiles, assessments, and AI conversations.

## Features

### Demo Users
- **Admin**: `admin@neurokinetics.demo` - Full platform access
- **Provider**: `therapist@neurokinetics.demo` - Clinical provider features
- **Parent 1**: `parent1@neurokinetics.demo` - Parent with 2 children
- **Parent 2**: `parent2@neurokinetics.demo` - Parent with 2 children

**Password for all accounts**: `demo123`

### Demo Children
- **Emma Johnson** (4 years, Female) - Autism screening completed
- **Liam Rodriguez** (6 years, Male) - Assessment in progress
- **Sophia Chen** (3 years, Female) - Early intervention plan
- **Noah Williams** (5 years, Male) - Comprehensive assessment complete

### Demo Data Included
- Completed screening sessions with realistic results
- Assessment data and clinical reports
- Intervention plans with progress tracking
- CareBuddy AI conversations
- Clinical protocols and education materials
- Progress entries and activity logs

## How to Use

### 1. Access Demo Mode
Navigate to `/demo` or click the "🎮 Try Demo" button on the landing page.

### 2. Setup Demo Data
If demo data is not already set up, click "Setup Demo Environment" to populate the database with sample data.

### 3. Choose a User Role
Select from the available demo user accounts to experience different perspectives:

- **Admin**: See all users, manage the platform, view analytics
- **Provider**: Access clinical tools, create assessments, manage patients
- **Parent**: View child's progress, access CareBuddy AI, track interventions

### 4. Explore Features
Each demo account provides access to different features:

- **Child Management**: Add/view child profiles, track development
- **Screening & Assessment**: Complete autism screenings, view results
- **CareBuddy AI**: Get personalized guidance and support
- **Intervention Plans**: Access evidence-based intervention strategies
- **Progress Tracking**: Monitor child development over time
- **Clinical Reports**: Generate comprehensive assessment reports

### 5. Quick User Switching
Use the "Switch" button to quickly change between demo users without logging out.

## Demo API Endpoints

### Setup & Management
- `POST /demo/setup` - Initialize demo data
- `GET /demo/dashboard` - Get demo dashboard data
- `GET /demo/stats` - Get demo statistics

### Authentication
- `POST /demo/login` - Login with demo credentials
- `GET /demo/user-info` - Get current demo user info
- `POST /demo/quick-switch` - Switch between demo users

## Development Notes

### Enabling Demo Mode
Demo mode is automatically enabled in development environments. In production, set the `DEMO_MODE=true` environment variable.

### Customizing Demo Data
Edit the files in `/backend/demo/` to modify:
- Demo user accounts (`demo_auth.ts`)
- Sample children profiles (`setup_demo.ts`)
- Assessment data and results (`setup_demo.ts`)
- CareBuddy conversations (`setup_demo.ts`)

### Security Considerations
- Demo mode should only be enabled in development/staging environments
- All demo accounts use a simple password for easy access
- Demo data is clearly marked and separate from production data
- Consider implementing demo data cleanup mechanisms

## Testing Scenarios

### Scenario 1: Parent Journey
1. Login as `parent1@neurokinetics.demo`
2. View Emma's profile and assessment results
3. Access CareBuddy AI for guidance
4. Review intervention recommendations
5. Track progress over time

### Scenario 2: Provider Workflow
1. Login as `therapist@neurokinetics.demo`
2. Review patient caseload
3. Complete screening for a new child
4. Generate clinical report
5. Create intervention plan

### Scenario 3: Admin Overview
1. Login as `admin@neurokinetics.demo`
2. View platform analytics
3. Manage user accounts
4. Review assessment trends
5. Access all clinical data

## Troubleshooting

### Demo Mode Not Working
- Ensure backend services are running
- Check that database migrations are applied
- Verify demo mode is enabled in environment
- Check browser console for API errors

### Demo Data Missing
- Run `/demo/setup` to initialize demo data
- Check database connection
- Verify migration files are up to date

### Login Issues
- Use correct demo email addresses
- Password is always `demo123`
- Check network connectivity to backend

## Next Steps

After exploring the demo mode:
1. Review the comprehensive documentation
2. Set up a development environment
3. Customize the platform for your needs
4. Deploy to your preferred cloud provider
5. Configure for your specific clinical requirements