# Peptora Mobile

React Native Expo app — builds Android APK and iOS IPA.

## Stack
- Expo SDK 52, Expo Router v4 (file-based navigation)
- expo-secure-store (JWT storage), expo-device (fingerprinting)
- Same API as web app (peptora-api)

## Key rules
- Store tokens in expo-secure-store, never AsyncStorage
- Send platform: 'android' or 'ios' on all calculator API calls
- Device fingerprint: stable hash stored in SecureStore
- Stripe checkout: opens in expo-web-browser (in-app browser)
- Medical disclaimer shown on calculator screen

## Structure
- `app/(tabs)/` — Calculator, Encyclopedia, Vendors, Profile
- `app/auth/` — login, signup screens (modal presentation)
- `app/paywall.js` — upgrade screen
- `src/api/` — API client (axios + SecureStore)
- `src/lib/` — fingerprint, theme

## Local dev
```bash
npm install
npx expo start
# Scan QR code with Expo Go on your phone
```

## Build Android APK
```bash
eas login
eas build --platform android --profile preview
# ~10 min on Expo servers → download APK → host at peptora.app/downloads/peptora.apk
```

## Deploy
APK hosted as a static file on Vercel: `peptora-app/public/downloads/peptora.apk`
Link from `/download` page.
