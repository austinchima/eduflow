# EduFlow - Dynamic Learning Platform

A comprehensive AI-powered study platform that adapts to each user's unique learning journey. Unlike static applications with fake data, EduFlow provides a truly personalized experience for every student.

## 🚀 Key Features

### Dynamic User Experience

- **Personalized Dashboard**: Each user sees their own courses, grades, and study progress
- **Individual Analytics**: Real-time tracking of personal academic performance
- **Custom Study Tools**: Create and manage flashcards, quizzes, and study sessions specific to your courses
- **AI-Powered Recommendations**: Intelligent suggestions based on your actual study patterns and performance

### Core Functionality

- **Course Management**: Add, track, and manage your academic courses
- **Study Tools Hub**: Create flashcards, quizzes, and study sessions
- **Analytics Dashboard**: Comprehensive insights into your learning progress
- **Flashcard Study Sessions**: Spaced repetition learning with difficulty tracking
- **Quiz Interface**: Interactive assessments with detailed feedback
- **Progress Tracking**: Monitor study streaks, GPA goals, and course completion

### AI-Powered Features

- **AI-Generated Quiz Questions**: Automatically create relevant quiz questions based on course content
- **Intelligent Recommendations**: Personalized study suggestions based on performance patterns
- **Adaptive Learning**: Questions adapt to your difficulty level and learning pace
- **Smart Content Generation**: Context-aware question creation using Google's Gemini AI

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API with useReducer
- **Data Persistence**: Supabase database with local caching
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **AI Integration**: Google Gemini AI for question generation
- **HTTP Client**: Axios for API requests

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd eduflow
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add your API keys:

```bash
# Gemini AI API Key
# Get your API key from: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
# Get these from your Supabase project settings
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Note**: You need both a Gemini API key to enable AI-generated quiz questions and Supabase credentials for the backend. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed Supabase setup instructions.

4. Set up Supabase database:

Follow the comprehensive setup guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:

- Create a Supabase project
- Set up the database schema
- Configure authentication
- Enable Row Level Security

5. Start the development server:

```bash
npm start
```

6. Open your browser and navigate to `http://localhost:4028`

## 🎯 Getting Started

### First-Time Setup

When you first launch EduFlow, you'll be guided through a personalized setup process:

1. **Account Creation**: Sign up with email and password
2. **Profile Creation**: Enter your name and email
3. **Study Goals**: Set your daily study target (hours)
4. **Academic Goals**: Define your target GPA for the semester

### Adding Your Courses

1. Navigate to "Course Management"
2. Click "Add Course" to create your first course
3. Enter course details: name, instructor, credits, semester, and description
4. Track your progress and grades as you study

### Creating Study Tools

1. Visit the "Study Tools Hub"
2. Use "Quick Create" to generate flashcards or quizzes
3. Organize tools by course, difficulty, or status
4. Start studying with your personalized materials

## 🔧 Architecture

### Backend Integration

EduFlow uses Supabase as its backend service, providing:

- **PostgreSQL Database**: Reliable data storage with real-time capabilities
- **Authentication**: Secure user management with email/password
- **Row Level Security**: Data protection ensuring users only access their own data
- **Real-time Subscriptions**: Live updates across devices
- **File Storage**: Store course materials and user uploads

### User Context System

The application uses a centralized `UserContext` that manages all user-specific data:

```javascript
const { user, academic, studyData, flashcards, quizzes, actions } = useUser();
```

### Data Structure

- **User Profile**: Personal information and preferences
- **Academic Data**: Courses, grades, GPA, and study streaks
- **Study Data**: Activities, recommendations, and progress tracking
- **Flashcards**: Decks and cards with spaced repetition data
- **Quizzes**: Available and completed assessments

### State Management

- **Actions**: Centralized functions for data manipulation
- **Persistence**: Automatic saving to Supabase with local caching
- **Real-time Updates**: Immediate UI updates when data changes
- **Offline Support**: Local storage fallback for offline functionality

## 🎨 Customization

### Adding New Study Tools

1. Extend the `UserContext` with new data types
2. Create corresponding UI components
3. Add actions for data manipulation
4. Update the study tools hub to include new tool types

### Customizing Analytics

1. Modify the analytics dashboard components
2. Add new chart types and metrics
3. Implement custom data calculations
4. Update the export functionality

## 🔒 Data Privacy & Security

- **Row Level Security**: Database-level protection ensuring data isolation
- **Authentication**: Secure user authentication with Supabase Auth
- **Data Encryption**: All data encrypted in transit and at rest
- **User Control**: Users have full control over their information
- **GDPR Compliant**: Built with privacy regulations in mind

## 🚀 Future Enhancements

- **Real-time Collaboration**: Share study materials with classmates
- **Advanced Analytics**: Machine learning insights and predictions
- **Mobile App**: Native mobile application
- **API Integration**: Connect with learning management systems
- **Offline Mode**: Enhanced offline functionality with sync
- **File Upload**: Course material and image uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**EduFlow** - Empowering your academic journey with AI-driven personalization and cloud-powered collaboration.
