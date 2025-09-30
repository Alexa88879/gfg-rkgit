# 🚀 GFG RKGIT Portal

A comprehensive web portal for RKGIT (Raj Kumar Goel Institute of Technology) built with React, Firebase, and modern web technologies. This portal serves as a centralized platform for event management, career applications, community feedback, and administrative functions.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Firebase Configuration](#-firebase-configuration)
- [Available Scripts](#-available-scripts)
- [Key Features & Modules](#-key-features--modules)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality
- **Event Management System**: Complete event creation, registration, and management
- **Career Application Portal**: Job application and career opportunity management
- **Community Feedback Hub**: Interactive feedback collection and management
- **Admin Dashboard**: Comprehensive administrative controls
- **Real-time Analytics**: Live data visualization and reporting
- **Export Capabilities**: PDF, Excel, and CSV export functionality

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching capability
- **Modern UI Components**: Custom-built reusable components
- **Accessibility**: WCAG compliant design patterns
- **Performance Optimized**: Fast loading and smooth interactions

### 🔐 Security Features
- **Firebase Authentication**: Secure user authentication
- **Role-based Access Control**: Admin and user permission systems
- **Data Validation**: Client and server-side validation
- **Secure API Endpoints**: Protected routes and data access

## 🛠 Technology Stack

### Frontend
- **React 18.2.0**: Modern React with hooks and functional components
- **Vite 5.0.0**: Fast build tool and development server
- **React Router DOM 6.0.2**: Client-side routing
- **Tailwind CSS 3.4.6**: Utility-first CSS framework
- **Lucide React 0.484.0**: Beautiful icon library
- **Framer Motion 10.16.4**: Animation library

### Backend & Database
- **Firebase 12.3.0**: Backend-as-a-Service
- **Firestore**: NoSQL database
- **Firebase Authentication**: User management
- **Firebase Analytics**: Usage tracking

### State Management
- **Redux Toolkit 2.6.1**: Predictable state container
- **React Context API**: Component-level state management

### Data Processing & Export
- **jsPDF 3.0.2**: PDF generation
- **jsPDF-AutoTable 5.0.2**: Table generation in PDFs
- **XLSX 0.18.5**: Excel file processing
- **html2canvas 1.4.1**: HTML to canvas conversion
- **file-saver 2.0.5**: File download functionality

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing
- **Testing Library**: Component testing

## 📁 Project Structure

```
gfg_rkgit_portal_latest/
├── public/                          # Static assets
│   ├── assets/images/              # Image assets
│   ├── favicon.jpg                 # Site favicon
│   ├── manifest.json              # PWA manifest
│   └── robots.txt                  # SEO robots file
├── src/                            # Source code
│   ├── components/                 # Reusable components
│   │   ├── ui/                    # UI components
│   │   │   ├── Button.jsx         # Custom button component
│   │   │   ├── Input.jsx          # Form input component
│   │   │   ├── Header.jsx         # Navigation header
│   │   │   └── ...
│   │   ├── AppIcon.jsx            # Icon component
│   │   ├── AppImage.jsx           # Image component
│   │   └── ErrorBoundary.jsx      # Error handling
│   ├── contexts/                  # React contexts
│   │   └── AuthContext.jsx       # Authentication context
│   ├── pages/                     # Page components
│   │   ├── admin/                 # Admin pages
│   │   │   ├── Dashboard.jsx      # Admin dashboard
│   │   │   ├── Login.jsx          # Admin login
│   │   │   └── components/        # Admin components
│   │   │       ├── EventManager.jsx      # Event management
│   │   │       ├── EventForm.jsx         # Event creation/editing
│   │   │       ├── EventRegistrations.jsx # Registration management
│   │   │       ├── AnalyticsViewer.jsx    # Analytics dashboard
│   │   │       ├── UserManagement.jsx     # User management
│   │   │       ├── FeedbackViewer.jsx    # Feedback management
│   │   │       ├── BackupManager.jsx      # Data backup
│   │   │       └── ExportModal.jsx        # Export functionality
│   │   ├── register/              # Event registration
│   │   │   ├── index.jsx          # Event listing page
│   │   │   └── [eventId].jsx      # Individual event registration
│   │   ├── career-application/    # Career portal
│   │   │   ├── index.jsx          # Career page
│   │   │   └── components/
│   │   │       └── CareerForm.jsx  # Job application form
│   │   ├── community-feedback-hub/ # Feedback system
│   │   │   ├── index.jsx          # Feedback hub
│   │   │   └── components/        # Feedback components
│   │   ├── home/                  # Homepage
│   │   ├── contact/               # Contact page
│   │   ├── feedback/              # Feedback page
│   │   └── NotFound.jsx           # 404 page
│   ├── utils/                     # Utility functions
│   │   ├── eventService.js        # Event management logic
│   │   ├── registrationService.js  # Registration logic
│   │   ├── exportUtils.js         # Export functionality
│   │   ├── dateUtils.js           # Date formatting
│   │   └── cn.js                  # Class name utility
│   ├── styles/                    # Global styles
│   │   ├── index.css              # Main stylesheet
│   │   └── tailwind.css           # Tailwind imports
│   ├── firebase.js                # Firebase configuration
│   ├── App.jsx                    # Main app component
│   ├── Routes.jsx                 # Route configuration
│   └── index.jsx                  # Application entry point
├── firebase.json                  # Firebase configuration
├── firestore.rules               # Firestore security rules
├── tailwind.config.js            # Tailwind configuration
├── vite.config.mjs               # Vite configuration
├── postcss.config.js             # PostCSS configuration
└── package.json                  # Dependencies and scripts
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd gfg_rkgit_portal_latest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:4028`

## 🔧 Environment Configuration

### Firebase Environment Variables
The application uses Firebase for backend services. Configure these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase analytics measurement ID | No |

## 🔥 Firebase Configuration

### Firestore Collections
- **events**: Event data and metadata
- **registrations**: User event registrations
- **feedback**: Community feedback submissions
- **career_applications**: Job application data
- **users**: User profiles and permissions
- **analytics**: Usage analytics data

### Security Rules
The application uses Firestore security rules for data protection:
- Public read access for events
- Authenticated write access for registrations
- Admin-only access for user management
- Role-based permissions for different operations

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run serve` | Preview production build |
| `npm run deploy` | Deploy to Firebase |
| `npm run deploy:hosting` | Deploy only hosting |

## 🎯 Key Features & Modules

### 1. Event Management System
- **Event Creation**: Admin can create events with detailed information
- **Event Registration**: Users can register for events
- **Capacity Management**: Real-time participant tracking
- **Event Categories**: Automatic categorization based on content
- **Export Functionality**: Export registrations in multiple formats

### 2. Career Application Portal
- **Job Applications**: Submit career applications
- **Application Tracking**: Track application status
- **Document Upload**: Resume and document management
- **Admin Review**: Administrative review system

### 3. Community Feedback Hub
- **Feedback Collection**: Multiple feedback types
- **Interactive Forms**: Dynamic form generation
- **Feedback Analytics**: Response analysis and reporting
- **Public Engagement**: Community interaction features

### 4. Admin Dashboard
- **User Management**: User roles and permissions
- **Analytics Dashboard**: Real-time data visualization
- **Export Management**: Data export and backup
- **System Monitoring**: Application health monitoring

### 5. Registration System
- **Dynamic Forms**: Configurable registration forms
- **Validation**: Client and server-side validation
- **Duplicate Prevention**: Prevent duplicate registrations
- **Real-time Updates**: Live registration count updates

## 📊 API Documentation

### Event Service (`eventService.js`)
```javascript
// Get all events
getAllEvents()

// Create new event
createEvent(eventData)

// Update event
updateEvent(eventId, eventData)

// Delete event
deleteEvent(eventId)

// Get event registrations
getEventRegistrations(eventId)
```

### Registration Service (`registrationService.js`)
```javascript
// Register for event
registerForEvent(eventId, registrationData)

// Check duplicate registration
checkDuplicateRegistration(eventId, email)

// Update participant count
updateEventParticipantCount(eventId)
```

### Export Utilities (`exportUtils.js`)
```javascript
// Export to PDF
exportToPDF(data, filename)

// Export to Excel
exportToExcel(data, filename)

// Export to CSV
exportToCSV(data, filename)
```

## 🚀 Deployment

### Firebase Deployment
1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase**:
   ```bash
   firebase init
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

### Environment Setup for Production
1. Configure Firebase project settings
2. Set up Firestore security rules
3. Configure authentication providers
4. Set up analytics tracking
5. Configure hosting settings

## 🤝 Contributing

### Development Guidelines
1. Follow React best practices
2. Use TypeScript for type safety
3. Write comprehensive tests
4. Follow the existing code structure
5. Document new features

### Code Style
- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful variable names
- Write clean, readable code
- Add comments for complex logic

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation
- Review the code comments

## 🔄 Version History

- **v0.1.0**: Initial release with core functionality
- Event management system
- User authentication
- Admin dashboard
- Export capabilities

---

**Built with ❤️ for RKGIT Community**

*This portal serves as a comprehensive solution for managing events, applications, and community engagement for the RKGIT institution.*
