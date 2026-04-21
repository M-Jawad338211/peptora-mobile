import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { authApi } from '../../src/api'
import { getDeviceFingerprint } from '../../src/lib/fingerprint'
import { colors } from '../../src/lib/theme'

export default function SignupScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [fingerprint, setFingerprint] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => { getDeviceFingerprint().then(setFingerprint) }, [])

  const handleSignup = async () => {
    if (!email || !password) return
    if (password.length < 8) {
      Alert.alert('Password too short', 'Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await authApi.register(email, password, fullName, fingerprint)
      Alert.alert('Account created! 🎉', 'Welcome to Peptora. You have 25 free calculations.', [
        { text: 'Start calculating', onPress: () => router.back() }
      ])
    } catch (err) {
      const msg = err.response?.data?.detail || 'Signup failed. Please try again.'
      Alert.alert('Error', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.sub}>Free forever. No credit card required.</Text>

      {[
        { placeholder: 'Full name (optional)', value: fullName, set: setFullName, type: 'default', secure: false },
        { placeholder: 'Email address', value: email, set: setEmail, type: 'email-address', secure: false },
        { placeholder: 'Password (8+ chars)', value: password, set: setPassword, type: 'default', secure: true },
      ].map(({ placeholder, value, set, type, secure }) => (
        <TextInput key={placeholder}
          value={value} onChangeText={set}
          placeholder={placeholder} placeholderTextColor={colors.tx3}
          keyboardType={type} secureTextEntry={secure}
          autoCapitalize="none"
          style={styles.input}
        />
      ))}

      <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Creating account…' : 'Create free account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy, padding: 24, paddingTop: 32 },
  title: { color: colors.tx, fontSize: 24, fontWeight: '700', marginBottom: 4 },
  sub: { color: colors.tx2, fontSize: 14, marginBottom: 28 },
  input: {
    backgroundColor: colors.navy2, borderRadius: 11, padding: 14, color: colors.tx,
    fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', marginBottom: 12,
  },
  btn: { backgroundColor: colors.teal, borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#021a0e', fontSize: 16, fontWeight: '700' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: colors.teal, fontSize: 14 },
})
