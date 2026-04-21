import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { authApi } from '../../src/api'
import { saveTokens } from '../../src/api/client'
import { colors } from '../../src/lib/theme'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    try {
      const res = await authApi.login(email, password)
      // The API sets httpOnly cookies, but for mobile we also store tokens if returned
      router.back()
    } catch (err) {
      Alert.alert('Login failed', err.response?.data?.detail || 'Check your email and password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in to Peptora</Text>

      {[
        { placeholder: 'Email address', value: email, set: setEmail, type: 'email-address', secure: false },
        { placeholder: 'Password', value: password, set: setPassword, type: 'default', secure: true },
      ].map(({ placeholder, value, set, type, secure }) => (
        <TextInput key={placeholder}
          value={value} onChangeText={set}
          placeholder={placeholder} placeholderTextColor={colors.tx3}
          keyboardType={type} secureTextEntry={secure}
          autoCapitalize="none"
          style={styles.input}
        />
      ))}

      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Logging in…' : 'Log in'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/signup')} style={styles.link}>
        <Text style={styles.linkText}>Don't have an account? Sign up free</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy, padding: 24, paddingTop: 32 },
  title: { color: colors.tx, fontSize: 24, fontWeight: '700', marginBottom: 28 },
  input: {
    backgroundColor: colors.navy2, borderRadius: 11, padding: 14, color: colors.tx,
    fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', marginBottom: 12,
  },
  btn: { backgroundColor: colors.teal, borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#021a0e', fontSize: 16, fontWeight: '700' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: colors.teal, fontSize: 14 },
})
