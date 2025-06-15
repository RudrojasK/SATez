# SATez - Professional SAT Preparation Platform

<div align="center">

![SATez Logo](https://via.placeholder.com/200x80/007ACC/FFFFFF?text=SATez)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.x-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.io/)

**A comprehensive, data-driven SAT preparation application built with React Native and Expo**

[Features](#features) • [Installation](#installation) • [Contributing](#contributing)

</div>

## 📖 Overview

SATez is a comprehensive SAT preparation platform designed to provide students with a personalized learning experience. Built with React Native architecture and powered by Supabase, SATez offers practice modules, progress tracking, and AI-powered tutoring to help students improve their SAT performance.

The platform combines academic content with intuitive user experience design, providing students with the tools they need to achieve their target SAT scores through structured practice, analytics, and AI-powered assistance.

## ✨ Key Features

### 🎯 Core Learning Modules
- **Vocabulary Practice**: SAT vocabulary training with spaced repetition
- **Reading Comprehension**: Curated passages with SAT-style questions
- **Practice Tests**: Timed practice sessions with scoring
- **AI Tutor**: Interactive AI-powered tutoring and question assistance

### 📊 Analytics & Progress Tracking
- **Performance Dashboard**: Real-time statistics and progress indicators
- **Score Tracking**: Historical performance tracking and improvement trends
- **Statistics View**: Detailed analytics on practice sessions and performance
- **Progress Visualization**: Charts and graphs showing learning progress

### 🔐 User Management
- **Secure Authentication**: Authentication with Supabase Auth
- **Profile Management**: Personalized user profiles and preferences
- **Data Synchronization**: Cross-device progress sync
- **Settings Customization**: User preference and app settings management

### 🚀 Technical Features
- **Offline Storage**: Local data persistence with AsyncStorage
- **Real-time Data Sync**: Seamless synchronization with Supabase
- **Performance Optimization**: Smooth animations and responsive UI
- **Cross-platform**: Works on iOS, Android, and Web

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React Native 0.79.2 with Expo 53.x
- **Language**: TypeScript for type safety and developer experience
- **Backend**: Supabase (PostgreSQL, Auth, Real-time subscriptions)
- **Navigation**: React Navigation with Expo Router
- **State Management**: React Context with custom hooks
- **Styling**: Expo StyleSheet with custom design system
- **Data Persistence**: Supabase with AsyncStorage for offline storage
- **AI Integration**: Groq API for AI tutoring features

### Project Structure
```
SATez/
├── app/                          # Main application code (Expo Router)
│   ├── (auth)/                   # Authentication flow
│   ├── (tabs)/                   # Main app navigation
│   │   ├── index.tsx             # Home/Dashboard screen
│   │   ├── practice.tsx          # Practice module hub
│   │   ├── quiz.tsx              # Quiz interface
│   │   ├── tutor.tsx             # AI tutor interface
│   │   ├── resources.tsx         # Learning resources
│   │   ├── stats.tsx             # Statistics dashboard
│   │   ├── profile.tsx           # User profile & settings
│   │   ├── vocabpractice.tsx     # Vocabulary practice
│   │   ├── readingpractice.tsx   # Reading comprehension
│   │   └── _layout.tsx           # Tab navigation layout
│   ├── context/                  # React context providers
│   ├── components/               # App-specific components
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   └── Badge.tsx
│   ├── Card.tsx                  # Card components
│   ├── ProgressBar.tsx           # Progress indicators
│   ├── StatCard.tsx              # Statistics display
│   ├── PracticeCard.tsx          # Practice session cards
│   ├── ChatMessage.tsx           # AI tutor chat interface
│   ├── SplashScreen.tsx          # App loading screen
│   ├── ThemedText.tsx            # Themed text components
│   └── ThemedView.tsx            # Themed view components
├── constants/                    # App-wide constants
│   └── Colors.ts                 # Design system colors
├── data/                         # Static data and content
│   ├── vocab.json                # Vocabulary word database
│   └── sat_questions_parsed.json # SAT practice questions
├── hooks/                        # Custom React hooks
│   ├── useColorScheme.ts         # Theme management
│   ├── useThemeColor.ts          # Color theming
│   └── useHaptics.ts             # Haptic feedback
├── utils/                        # Utility functions
│   ├── supabase.ts               # Supabase client configuration
│   ├── groq.ts                   # AI service integration
│   ├── storage.ts                # Local storage utilities
│   ├── haptics.ts                # Haptic feedback utilities
│   ├── database_setup.sql        # Database schema
│   └── setupSupabaseTables.js    # Database setup script
├── scripts/                      # Build and utility scripts
└── assets/                       # Static assets
    ├── images/
    └── fonts/
```

## 🚀 Quick Start

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **Yarn** (v1.22.0 or higher)
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git** for version control
- **Supabase Account** for backend services

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/aarushk09/SATez.git
   cd SATez
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI Integration
   GROQ_API_KEY=your_groq_api_key
   
   # Development Configuration
   NODE_ENV=development
   ```

4. **Database Setup**
   
   Set up your Supabase database using the provided schema:
   ```bash
   # Run the database setup script in your Supabase SQL editor
   # File: utils/database_setup.sql
   ```

5. **Start Development Server**
   ```bash
   npx expo start
   ```

### Development Workflow

- **iOS Development**: Press `i` in the terminal or scan QR code with Expo Go
- **Android Development**: Press `a` in the terminal or scan QR code with Expo Go
- **Web Development**: Press `w` in the terminal for web preview

## 📚 Database Schema

The application uses Supabase (PostgreSQL) for data persistence. Key tables include:

### Core Tables

#### `user_profiles`
Stores user account information and preferences
```sql
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    target_score INTEGER DEFAULT 1600,
    study_plan JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `vocab_practice_results`
Tracks vocabulary practice session results
```sql
CREATE TABLE vocab_practice_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    word_id VARCHAR(100) NOT NULL,
    correct BOOLEAN NOT NULL,
    response_time INTEGER,
    difficulty_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `reading_practice_results`
Stores reading comprehension practice results
```sql
CREATE TABLE reading_practice_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    passage_id VARCHAR(100) NOT NULL,
    question_id VARCHAR(100) NOT NULL,
    user_answer TEXT,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent INTEGER,
    question_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

For the complete database schema, see `utils/database_setup.sql`.

## 🔧 Configuration

### Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Configure Authentication**:
   - Enable email/password authentication
   - Set up OAuth providers if needed
   - Configure email templates for verification

3. **Set up Database**:
   - Run the SQL schema from `utils/database_setup.sql`
   - Enable Row Level Security (RLS) for data protection
   - Configure real-time subscriptions

4. **Configure API Keys**:
   - Copy your project URL and anon key to `.env.local`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `GROQ_API_KEY` | AI service API key for tutoring | ✅ |

## 📱 Usage Guide

### For Students

1. **Account Setup**:
   - Register with email and create a password
   - Complete your profile setup
   - Set your target SAT score

2. **Practice Modules**:
   - **Vocabulary**: Practice with flashcards and spaced repetition
   - **Reading**: Work through comprehension passages
   - **Quiz**: Take timed practice quizzes
   - **Tutor**: Get AI-powered help and explanations

3. **Track Progress**:
   - View your statistics and performance trends
   - Monitor your improvement over time
   - Set goals and track achievements

## 🧪 Testing

### Available Scripts
```bash
# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web

# Code quality
npm run lint
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Your Changes**
   - Follow existing code style
   - Test your changes thoroughly
4. **Submit a Pull Request**

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing component patterns
- Test on multiple platforms before submitting
- Update documentation as needed

## 🚀 Deployment

### Production Build
```bash
# Create production build
npx expo build:android
npx expo build:ios

# Or using EAS Build (recommended)
eas build --platform all
```

## 📋 Roadmap

### Current Features (v1.0)
- ✅ Vocabulary practice with spaced repetition
- ✅ Reading comprehension exercises
- ✅ AI-powered tutoring system
- ✅ Progress tracking and analytics
- ✅ Cross-platform support (iOS, Android, Web)

### Upcoming Features (v1.1)
- [ ] Math practice modules
- [ ] Full-length practice tests
- [ ] Enhanced AI tutoring capabilities
- [ ] Social features and study groups
- [ ] Offline mode improvements

### Long-term Vision (v2.0+)
- [ ] Personalized learning paths
- [ ] Advanced analytics and insights
- [ ] Integration with college prep platforms
- [ ] Teacher/parent dashboards
- [ ] Multi-language support

## 🔒 Security & Privacy

- **Data Encryption**: All sensitive data is encrypted in transit and at rest
- **Authentication**: Secure authentication with Supabase Auth
- **Privacy**: User data is protected and not shared with third parties
- **Compliance**: Following best practices for student data protection

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Technology Stack
- [Expo](https://expo.dev/) - React Native development platform
- [Supabase](https://supabase.io/) - Backend-as-a-Service platform
- [React Navigation](https://reactnavigation.org/) - Navigation library
- [Groq](https://groq.com/) - AI API for tutoring features

### Educational Content
- College Board for SAT content guidelines
- Open educational resources for practice materials

## 📞 Support

### Getting Help
- **GitHub Issues**: Bug reports and feature requests
- **Email**: Contact the development team
- **Documentation**: Check the code comments and README

### Community
- **GitHub Discussions**: Share ideas and get help from the community

## Study Timer Backend Setup

The study timer feature requires a database table to store session data. To set up the backend:

1. **Using Admin Tools (Recommended)**:
   - Navigate to Settings → Admin Tools in the app
   - Click "Create Table" under "Study Sessions Table Migration"
   - This will create the `study_sessions` table with proper indexes

2. **Manual Setup**:
   If you prefer to set up the table manually via Supabase dashboard:
   ```sql
   -- Create study_sessions table
   CREATE TABLE IF NOT EXISTS study_sessions (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
       start_time TIMESTAMPTZ NOT NULL,
       end_time TIMESTAMPTZ NOT NULL,
       duration INTEGER NOT NULL, -- duration in seconds
       subject TEXT NOT NULL DEFAULT 'General Study',
       notes TEXT DEFAULT '',
       created_at TIMESTAMPTZ DEFAULT now()
   );

   -- Create indexes for better query performance
   CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
   CREATE INDEX IF NOT EXISTS idx_study_sessions_created_at ON study_sessions(created_at);
   ```

3. **Row Level Security (RLS)**:
   Make sure to enable RLS and add policies:
   ```sql
   -- Enable RLS
   ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

   -- Policy for users to see only their own sessions
   CREATE POLICY "Users can view own study sessions" ON study_sessions
       FOR SELECT USING (auth.uid() = user_id);

   -- Policy for users to insert their own sessions
   CREATE POLICY "Users can insert own study sessions" ON study_sessions
       FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Policy for users to delete their own sessions
   CREATE POLICY "Users can delete own study sessions" ON study_sessions
       FOR DELETE USING (auth.uid() = user_id);
   ```

After setting up the table, the study timer will automatically sync data to the backend and users can access their study history across devices.

## Google OAuth Setup

SATez supports Google Sign-In/Sign-Up for a seamless authentication experience. To enable this feature:

### Quick Setup

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google Sign-In API
   - Create OAuth 2.0 credentials (Web, iOS, Android)

2. **Supabase Configuration**:
   - Enable Google provider in Authentication settings
   - Add your Google OAuth credentials
   - Configure redirect URLs

3. **Environment Variables**:
   Add to your `.env` file:
   ```env
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.googleusercontent.com
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.googleusercontent.com
   ```

4. **Test the Integration**:
   - Start the development server: `npm start`
   - Try "Continue with Google" on login/signup screens

### Detailed Setup Guide

For complete step-by-step instructions, see [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md).

### Features Enabled

- ✅ **One-Click Authentication** - Users can sign in/up with their Google account
- ✅ **Profile Auto-Population** - Name and email are automatically filled from Google
- ✅ **Secure Authentication** - OAuth 2.0 with Supabase Auth integration
- ✅ **Cross-Platform Support** - Works on iOS, Android, and Web
- ✅ **Seamless UX** - Native Google sign-in experience

**Note**: Google OAuth requires proper configuration in both Google Cloud Console and Supabase. The feature will show a disabled state until properly configured.

---

<div align="center">

**Built with ❤️ by the SATez Team**

[![GitHub stars](https://img.shields.io/github/stars/aarushk09/SATez?style=social)](https://github.com/aarushk09/SATez/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/aarushk09/SATez?style=social)](https://github.com/aarushk09/SATez/network/members)

[⬆ Back to Top](#satez---professional-sat-preparation-platform)

</div>



