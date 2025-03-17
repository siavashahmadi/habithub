# HabitHub - Modern Habit Tracking App

HabitHub is a sleek, user-friendly mobile application designed to help users build and maintain positive habits. With an intuitive interface and powerful tracking features, HabitHub makes it easy to stay on top of your daily, weekly, and monthly goals.

## Features

- **Habit Tracking**: Create, edit, and delete habits with customizable frequencies (daily, weekly, monthly, or custom days)
- **Dashboard**: Clean and intuitive dashboard displaying all active habits with quick access to mark them as completed
- **Analytics**: Visual insights into habit completion rates over time with charts and statistics
- **Reminders**: Customizable reminders for each habit to help you stay on track
- **Customization**: Personalize the app with different themes (light/dark/system) and accent colors
- **User Accounts**: Sign in to sync your habits across devices and never lose your progress
- **Cross-Platform**: Works on iOS, Android, and now as a web application!

## Screenshots

[Screenshots will be added here]

## Technology Stack

- **Frontend**: React Native with Expo
- **State Management**: React Context API
- **Database**: Firebase Firestore (with offline support)
- **Authentication**: Firebase Authentication
- **Charts**: react-native-chart-kit
- **Icons**: Ionicons from @expo/vector-icons
- **Date Handling**: date-fns
- **Web Support**: React Native Web
- **Deployment**: Vercel (web), Expo Application Services (mobile)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS development, macOS only)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/habithub.git
   cd habithub
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npx expo start
   ```

4. Choose your development platform:
   - Press `i` to open in iOS simulator (requires Xcode)
   - Press `a` to open in Android emulator (requires Android Studio)
   - Press `w` to open in web browser
   - Scan the QR code with Expo Go app on your physical device

## Running on Web

HabitHub now includes web support! To run the web version:

1. Make sure you have the web dependencies installed:
   ```
   npx expo install react-dom react-native-web @expo/metro-runtime
   ```

2. Start the web development server:
   ```
   npx expo start --web
   ```

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication and Firestore services
3. Create a `.env` file in the project root with your Firebase configuration:
   ```
   API_KEY=your-api-key
   AUTH_DOMAIN=your-auth-domain
   PROJECT_ID=your-project-id
   STORAGE_BUCKET=your-storage-bucket
   MESSAGING_SENDER_ID=your-sender-id
   APP_ID=your-app-id
   ```
4. If you don't want to use Firebase, you can remove the Firebase dependencies and use local storage instead.

## Deploying to Vercel

HabitHub can be easily deployed to Vercel to share with friends:

1. Push your code to a GitHub repository
2. Create a `vercel.json` file in your project root:
   ```json
   {
     "buildCommand": "npx expo export:web",
     "outputDirectory": "web-build",
     "devCommand": "npx expo start --web",
     "framework": "expo",
     "rewrites": [
       { "source": "/(.*)", "destination": "/" }
     ]
   }
   ```
3. Sign up for a Vercel account at [vercel.com](https://vercel.com)
4. Import your GitHub repository in the Vercel dashboard
5. Let Vercel deploy your app (it will detect the Expo framework automatically)
6. Share the generated URL with your friends!

## Project Structure

```
habithub/
├── assets/                 # App assets (images, fonts)
├── src/
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # App screens
│   ├── services/           # External services (Firebase, etc.)
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── App.tsx                 # Main app component
├── app.json                # Expo configuration
└── vercel.json             # Vercel deployment configuration
```

## Troubleshooting

### Common Issues

- **TypeScript Errors**: If you encounter TypeScript errors, make sure your `tsconfig.json` is correctly set up:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "baseUrl": ".",
      "paths": {
        "*": ["*", "src/*"]
      },
      "skipLibCheck": true,
      "resolveJsonModule": true,
      "jsx": "react-native",
      "noImplicitAny": true,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "forceConsistentCasingInFileNames": true,
      "moduleResolution": "node",
      "lib": [
        "es6",
        "dom"
      ],
      "target": "esnext"
    },
    "include": [
      "**/*.ts",
      "**/*.tsx"
    ],
    "exclude": [
      "node_modules"
    ]
  }
  ```

- **iOS/Xcode Issues**: If Expo doesn't recognize your Xcode installation, run:
  ```
  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
  ```

- **Web Dependencies**: If the web version doesn't work, make sure you've installed the required dependencies:
  ```
  npx expo install react-dom react-native-web @expo/metro-runtime
  ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/)
- [React Navigation](https://reactnavigation.org/)
- [Vercel](https://vercel.com/) for web deployment
