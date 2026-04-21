import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { authApi } from '../../src/api'
import { clearTokens } from '../../src/api/client'
import { colors } from '../../src/lib/theme'

export default function ProfileTab() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    authApi.me().then(r => setUser(r.data)).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await authApi.logout().catch(() => {})
    await clearTokens()
    setUser(null)
  }

  if (loading) return (
    <View style={styles.center}><Text style={styles.muted}>Loading…</Text></View>
  )

  if (!user) return (
    <View style={styles.center}>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.muted}>Log in to track your calculations and access Pro features.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/auth/login')}>
        <Text style={styles.btnText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.outlineBtn]} onPress={() => router.push('/auth/signup')}>
        <Text style={styles.outlineBtnText}>Create free account</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <Text style={styles.name}>{user.full_name || 'Researcher'}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={[styles.planBadge, user.plan === 'pro' && styles.proBadge]}>
          <Text style={[styles.planBadgeText, user.plan === 'pro' && styles.proBadgeText]}>
            {user.plan === 'pro' ? '⭐ Pro' : 'Free'}
          </Text>
        </View>
      </View>

      {user.trial_count && user.plan !== 'pro' && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>USAGE</Text>
          <Text style={styles.statValue}>
            {25 - (user.trial_count.anonymous_uses + user.trial_count.free_uses)} of 25 calculations remaining
          </Text>
          <TouchableOpacity onPress={() => router.push('/paywall')}>
            <Text style={styles.upgradeLink}>Upgrade to Pro for unlimited →</Text>
          </TouchableOpacity>
        </View>
      )}

      {user.plan === 'pro' && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>PRO ACCESS</Text>
          <Text style={styles.statValue}>Unlimited calculations</Text>
          <Text style={styles.muted}>AI assistant, stack checker, cycle tracker all included.</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>APP</Text>
        <Text style={styles.infoItem}>Version 1.0.0</Text>
        <Text style={styles.infoItem}>peptora.app</Text>
      </View>

      <TouchableOpacity style={[styles.btn, styles.dangerBtn]} onPress={handleLogout}>
        <Text style={styles.dangerBtnText}>Log out</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        For research and educational purposes only. Not medical advice.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { color: colors.tx, fontSize: 24, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  card: { backgroundColor: colors.navy2, borderRadius: 14, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  sectionLabel: { color: colors.tx3, fontSize: 10, fontFamily: 'monospace', marginBottom: 10 },
  name: { color: colors.tx, fontSize: 18, fontWeight: '700', marginBottom: 2 },
  email: { color: colors.tx2, fontSize: 13, marginBottom: 12, fontFamily: 'monospace' },
  planBadge: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  proBadge: { backgroundColor: 'rgba(0,214,143,0.1)', borderColor: 'rgba(0,214,143,0.2)' },
  planBadgeText: { color: colors.tx3, fontSize: 11, fontFamily: 'monospace' },
  proBadgeText: { color: colors.teal },
  statValue: { color: colors.tx, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  upgradeLink: { color: colors.teal, fontSize: 13, marginTop: 6 },
  infoItem: { color: colors.tx2, fontSize: 13, marginBottom: 4 },
  muted: { color: colors.tx3, fontSize: 13, lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  btn: { backgroundColor: colors.teal, borderRadius: 12, padding: 15, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#021a0e', fontSize: 15, fontWeight: '700' },
  outlineBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  outlineBtnText: { color: colors.tx2, fontSize: 15 },
  dangerBtn: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', marginTop: 4 },
  dangerBtnText: { color: colors.red, fontSize: 15, fontWeight: '600' },
  disclaimer: { color: colors.tx3, fontSize: 11, textAlign: 'center', marginTop: 16, lineHeight: 18 },
})
