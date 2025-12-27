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
- **NativeWind** (Tailwind CSS for React Native)
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **Firebase** for auth and data

### Backend

- **Fastify** + TypeScript
- **Firebase Admin SDK**
- **Optional OpenAI** integration

## 📁 Project Structure

```
StudyBuddy/
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── screens/       # App screens
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
- Xcode (for iOS)

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

Firebase configuration is automatically handled by:

- `android/app/google-services.json` (Android)
- `ios/GoogleService-Info.plist` (iOS)

## 📱 Screens

1. **Welcome** - Onboarding entry point
2. **Subject Selection** - Choose your study subjects
3. **Exam Date** - Set your exam deadline
4. **Availability** - Configure daily study hours
5. **Plan Summary** - Review and generate plan
6. **Home** - Daily schedule and quick actions
7. **Focus** - Pomodoro timer
8. **Progress** - Stats and streaks
9. **Insights** - AI recommendations

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/plan/generate` | Generate study plan |
| POST | `/plan/update` | Update session |
| GET | `/stats/weekly` | Weekly statistics |
| GET | `/stats/subjects` | Subject breakdown |

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- Built with React Native & Fastify
- Styled with NativeWind
- Powered by Firebase
