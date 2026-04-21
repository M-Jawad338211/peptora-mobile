import { Tabs } from 'expo-router'
import { colors } from '../../src/lib/theme'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.navy2,
          borderTopColor: 'rgba(255,255,255,0.09)',
          height: 60,
        },
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.tx3,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.tx,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.navy },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Calculator', tabBarIcon: ({ color }) => <TabIcon label="⚗️" color={color} /> }} />
      <Tabs.Screen name="encyclopedia" options={{ title: 'Encyclopedia', tabBarIcon: ({ color }) => <TabIcon label="📖" color={color} /> }} />
      <Tabs.Screen name="vendors" options={{ title: 'Vendors', tabBarIcon: ({ color }) => <TabIcon label="🛡️" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon label="👤" color={color} /> }} />
    </Tabs>
  )
}

function TabIcon({ label, color }) {
  const { Text } = require('react-native')
  return <Text style={{ fontSize: 18 }}>{label}</Text>
}
