# StudyBuddy - Focus. Plan. Succeed.

A cross-platform mobile app built with React Native and Expo that helps students generate AI-based study plans, enter deep focus mode, and track productivity streaks.

## Features

### 🤖 AI-Generated Study Plans
- Input subject, exam date, and daily study hours
- AI breaks down syllabus into manageable daily tasks
- Weekly adaptations based on progress

### ⏰ Focus Mode
- Pomodoro Timer (25 minutes)
- Deep Focus (52 minutes)
- Custom duration sessions
- Full-screen distraction-free interface
- Session completion tracking

### 🔥 Streak & Progress Tracking
- Daily session completion maintains streaks
- Visual progress bars and analytics
- Weekly reports with focus time and consistency metrics
- Achievement badges and motivational elements

### 📅 Task Management
- Daily task lists synced with AI-generated plans
- Manual task completion tracking
- Progress visualization

### 📊 Analytics & Insights
- Time spent per subject/topic
- Focus efficiency scoring
- Weekly and monthly progress charts
- Streak maintenance statistics

### 🔐 User Authentication
- Firebase Authentication (Email/Password)
- Guest mode with local data storage
- Data synchronization across devices

## Tech Stack

- **Frontend**: React Native with Expo
- **State Management**: Redux Toolkit
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Charts**: Victory Native
- **Navigation**: Expo Router

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Firebase project
- OpenAI API key (optional, for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd studybuddy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your Firebase and OpenAI configurations.

4. Start the development server:
```bash
npm start
```

5. Run on your device:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Add your web app configuration to `.env`

### Project Structure

```
app/
├── (tabs)/           # Main tab navigation screens
│   ├── index.tsx     # Home screen
│   ├── plan.tsx      # Study plan management
│   ├── focus.tsx     # Focus mode selection
│   ├── streak.tsx    # Progress and analytics
│   └── settings.tsx  # App settings
├── auth/             # Authentication screens
│   ├── index.tsx     # Auth landing
│   ├── login.tsx     # Sign in
│   └── register.tsx  # Sign up
├── focus.tsx         # Full-screen focus mode
├── index.tsx         # App entry point
└── _layout.tsx       # Root layout

store/
├── index.ts          # Redux store configuration
└── slices/           # Redux slices
    ├── authSlice.ts      # Authentication state
    ├── studyPlanSlice.ts # Study plans and tasks
    ├── focusSlice.ts     # Focus sessions and timer
    └── streakSlice.ts    # Progress tracking

lib/
└── firebase.ts       # Firebase configuration
```

## Key Features Implementation

### Focus Timer
- Redux-based timer state management
- Background timer continuation
- Session completion tracking
- Multiple focus modes (Pomodoro, Deep Focus, Custom)

### Study Plan Generation
- Mock AI implementation (replace with OpenAI integration)
- Task breakdown by date and duration
- Progress tracking and completion status

### Streak System
- Daily session completion tracking
- Streak maintenance logic
- Progress visualization with charts

### Data Persistence
- Firebase Firestore for authenticated users
- Local storage for guest mode
- Automatic data synchronization

## Deployment

### Mobile App Deployment

1. Build for production:
```bash
# iOS
eas build -p ios

# Android
eas build -p android
```

2. Submit to app stores using EAS Submit

### Backend Services (Optional)

For AI features, deploy serverless functions to Google Cloud Functions or similar platforms to handle OpenAI API calls securely.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**StudyBuddy** - Helping students focus, plan, and succeed in their academic journey! 🎓