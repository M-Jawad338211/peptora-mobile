import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1a2535' },
          headerTintColor: '#edf2f8',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#1a2535' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ title: 'Log in', presentation: 'modal' }} />
        <Stack.Screen name="auth/signup" options={{ title: 'Create account', presentation: 'modal' }} />
        <Stack.Screen name="paywall" options={{ title: 'Upgrade to Pro', presentation: 'modal' }} />
      </Stack>
    </>
  )
}
