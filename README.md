# StudyBuddy 📚

**Focus. Plan. Succeed.**

An AI-assisted study planning mobile app that helps students create personalized study schedules, maintain focus, and build consistency through streaks and analytics.

## 🚀 Features

- **📅 AI-Generated Study Plans** - Smart scheduling based on your subjects, availability, and exam dates
- **⏱️ Focus Mode** - Pomodoro-style timer with distraction-free interface
- **🔥 Streak Tracking** - Build consistency with daily study streaks
- **📊 Analytics Dashboard** - Track your progress with visual insights
- **💡 AI Insights** - Weekly summaries with personalized recommendations
- **🔐 Secure Authentication** - Firebase-powered user authentication

## 🛠️ Tech Stack

### Mobile App

- **React Native CLI** + TypeScript
- **React Native StyleSheet** for styling
- **Redux Toolkit** for state management
- **React Navigation** (Stack + Bottom Tabs)
- **Firebase** for authentication

### Backend

- **Fastify** + TypeScript
- **Firebase Admin SDK**
- **Optional OpenAI** integration for AI insights

## 📁 Project Structure

```
StudyBuddy/
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── screens/       # App screens (auth, onboarding, main)
│   │   ├── store/         # Redux slices
│   │   ├── services/      # API & Firebase
│   │   ├── navigation/    # Navigation config
│   │   └── types/         # TypeScript types
│   └── App.tsx
├── backend/               # Fastify API
│   └── src/
│       ├── routes/        # API routes
│       └── services/      # Business logic
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- pnpm
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Email/Password** authentication
3. Download `google-services.json` (Android) → place in `mobile/android/app/`
4. Download `GoogleService-Info.plist` (iOS) → place in `mobile/ios/`

### Backend Setup

```bash
cd backend
pnpm install

# Create .env file
cp .env.example .env

# Start development server
pnpm dev
```

### Mobile App Setup

```bash
cd mobile
pnpm install

# Android
pnpm android

# iOS (macOS only)
cd ios && pod install && cd ..
pnpm ios
```

## 🔧 Environment Variables

### Backend (.env)

```
PORT=3001
FIREBASE_PROJECT_ID=your-project-id
OPENAI_API_KEY=sk-your-key (optional)
```

### Mobile

Firebase configuration files (not committed for security):

- `android/app/google-services.json` (Android)
- `ios/GoogleService-Info.plist` (iOS)

## 📱 Screens

| Screen | Description |
|--------|-------------|
| **Welcome** | Onboarding entry point |
| **Subject Selection** | Choose your study subjects |
| **Exam Date** | Set your exam deadline |
| **Availability** | Configure daily study hours |
| **Plan Summary** | Review and generate plan |
| **Home** | Daily schedule and quick actions |
| **Focus** | Pomodoro timer |
| **Progress** | Stats and streaks |
| **Insights** | AI recommendations |
| **Settings** | Profile and preferences |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/plan/generate` | Generate study plan |
| POST | `/plan/update` | Update session |
| GET | `/stats/weekly` | Weekly statistics |
| GET | `/stats/subjects` | Subject breakdown |

## 📸 Screenshots

*Coming soon*

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- Built with React Native & Fastify
- Powered by Firebase Authentication
- AI insights powered by OpenAI (optional)
