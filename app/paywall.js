import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { subscriptionsApi } from '../src/api'
import { colors } from '../src/lib/theme'
import * as WebBrowser from 'expo-web-browser'

export default function PaywallScreen() {
  const [loading, setLoading] = useState(null)
  const router = useRouter()

  const handleCheckout = async (plan) => {
    setLoading(plan)
    try {
      const res = await subscriptionsApi.createCheckout(plan)
      await WebBrowser.openBrowserAsync(res.data.checkout_url)
    } catch (err) {
      if (err.response?.status === 401) {
        router.push('/auth/signup')
      } else {
        Alert.alert('Error', err.response?.data?.detail || 'Failed to start checkout')
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade to Peptora Pro</Text>
      <Text style={styles.sub}>Unlock unlimited calculations and all AI-powered features.</Text>

      <View style={styles.plans}>
        <TouchableOpacity style={styles.planCard} onPress={() => handleCheckout('monthly')} disabled={!!loading}>
          <Text style={styles.planLabel}>MONTHLY</Text>
          <Text style={styles.planPrice}>£9.99</Text>
          <Text style={styles.planPeriod}>per month</Text>
          <Text style={styles.planCta}>{loading === 'monthly' ? 'Loading…' : 'Choose monthly →'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.planCard, styles.featuredPlan]} onPress={() => handleCheckout('annual')} disabled={!!loading}>
          <Text style={styles.bestValue}>BEST VALUE</Text>
          <Text style={styles.planLabel}>ANNUAL</Text>
          <Text style={styles.planPrice}>£79</Text>
          <Text style={styles.planPeriod}>per year · £6.58/mo</Text>
          <Text style={[styles.planCta, { color: colors.gold }]}>{loading === 'annual' ? 'Loading…' : 'Choose annual →'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        {['Unlimited dose calculations', 'AI research assistant', 'Peptide stack checker', 'Cycle tracker + AI summaries', 'Protocol finder'].map(f => (
          <View key={f} style={styles.featureRow}>
            <Text style={styles.featureCheck}>✓</Text>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.disclaimer}>
        Secure payment via Stripe. Cancel anytime. For research use only.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy, padding: 24 },
  title: { color: colors.tx, fontSize: 24, fontWeight: '700', marginBottom: 6 },
  sub: { color: colors.tx2, fontSize: 14, lineHeight: 20, marginBottom: 28 },
  plans: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  planCard: { flex: 1, backgroundColor: colors.navy2, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  featuredPlan: { borderColor: colors.gold },
  bestValue: { color: colors.gold, fontSize: 9, fontFamily: 'monospace', marginBottom: 8 },
  planLabel: { color: colors.tx3, fontSize: 10, fontFamily: 'monospace', marginBottom: 8 },
  planPrice: { color: colors.tx, fontSize: 28, fontWeight: '700' },
  planPeriod: { color: colors.tx3, fontSize: 11, fontFamily: 'monospace', marginBottom: 12 },
  planCta: { color: colors.teal, fontSize: 12, fontWeight: '600' },
  features: { marginBottom: 24 },
  featureRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'center' },
  featureCheck: { color: colors.teal, fontSize: 14, fontWeight: '700' },
  featureText: { color: colors.tx2, fontSize: 14 },
  disclaimer: { color: colors.tx3, fontSize: 11, textAlign: 'center', lineHeight: 18 },
})
