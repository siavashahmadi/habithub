# HabitHub - Modern Habit Tracking App

HabitHub is a sleek, user-friendly mobile application designed to help users build and maintain positive habits. With an intuitive interface and powerful tracking features, HabitHub makes it easy to stay on top of your daily, weekly, and monthly goals.

## Features

- **Habit Tracking**: Create, edit, and delete habits with customizable frequencies (daily, weekly, monthly, or custom days)
- **Dashboard**: Clean and intuitive dashboard displaying all active habits with quick access to mark them as completed
- **Analytics**: Visual insights into habit completion rates over time with charts and statistics
- **Reminders**: Customizable reminders for each habit to help you stay on track
- **Customization**: Personalize the app with different themes (light/dark/system) and accent colors
- **User Accounts**: Sign in to sync your habits across devices and never lose your progress

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

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

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
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Open the app on your device using the Expo Go app or run it on an emulator.

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication and Firestore services
3. Update the Firebase configuration in `src/services/firebase.ts` with your project credentials

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
└── app.json                # Expo configuration
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
