import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { calculatorApi, authApi, subscriptionsApi } from '../../src/api'
import { getDeviceFingerprint } from '../../src/lib/fingerprint'
import { colors } from '../../src/lib/theme'
import * as WebBrowser from 'expo-web-browser'

const PEPTIDES = [
  'BPC-157', 'TB-500', 'GHK-Cu', 'Ipamorelin', 'CJC-1295 (no DAC)',
  'CJC-1295 (with DAC)', 'GHRP-2', 'GHRP-6', 'Sermorelin', 'Tesamorelin',
  'Semaglutide', 'Tirzepatide', 'Retatrutide', 'AOD-9604', 'Semax',
  'Selank', 'Epitalon', 'Thymosin Alpha-1', 'MOTS-C', 'SS-31',
  'KPV', 'MK-677', 'Custom',
]

export default function CalculatorTab() {
  const router = useRouter()
  const [fingerprint, setFingerprint] = useState('')
  const [trial, setTrial] = useState(null)
  const [peptide, setPeptide] = useState(PEPTIDES[0])
  const [showPeptidePicker, setShowPeptidePicker] = useState(false)
  const [vialMg, setVialMg] = useState('')
  const [bacMl, setBacMl] = useState('')
  const [targetMcg, setTargetMcg] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    getDeviceFingerprint().then(fp => {
      setFingerprint(fp)
      calculatorApi.checkTrial(fp, 'android').then(r => setTrial(r.data)).catch(() => {})
    })
  }, [])

  const calculate = async () => {
    if (!vialMg || !bacMl || !targetMcg) {
      Alert.alert('Missing values', 'Please fill in all three fields')
      return
    }
    setLoading(true)
    try {
      const check = await calculatorApi.checkTrial(fingerprint, 'android')
      const trialData = check.data
      setTrial(trialData)

      if (!trialData.allowed) {
        setModal(trialData.reason === 'anonymous_limit' ? 'signup' : 'paywall')
        return
      }

      const vial = parseFloat(vialMg)
      const bac = parseFloat(bacMl)
      const target = parseFloat(targetMcg)
      const conc = (vial * 1000) / bac
      const drawMl = target / conc
      const drawUnits = drawMl * 100
      const doses = Math.floor((vial * 1000) / target)

      setResult({ conc, drawMl, drawUnits, doses })

      calculatorApi.recordUse({
        device_fingerprint: fingerprint,
        platform: 'android',
        peptide_name: peptide,
        vial_mg: vial,
        bac_water_ml: bac,
        target_mcg: target,
        result_units: drawUnits,
        result_ml: drawMl,
      }).catch(() => {})

      calculatorApi.checkTrial(fingerprint, 'android').then(r => setTrial(r.data)).catch(() => {})
    } catch {
      Alert.alert('Error', 'Calculation failed. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (plan) => {
    try {
      const res = await subscriptionsApi.createCheckout(plan)
      await WebBrowser.openBrowserAsync(res.data.checkout_url)
    } catch (err) {
      if (err.response?.status === 401) {
        router.push('/auth/signup')
      }
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Trial bar */}
      {trial && (
        <View style={styles.trialBar}>
          <Text style={styles.trialText}>
            {trial.reason === 'pro' ? '⭐ Pro — unlimited'
              : trial.remaining !== null ? `${trial.remaining} free uses remaining`
              : 'Limit reached'}
          </Text>
          {trial.reason !== 'pro' && (
            <TouchableOpacity onPress={() => router.push('/paywall')}>
              <Text style={styles.upgradeLink}>Upgrade →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Peptide picker */}
      <Text style={styles.label}>PEPTIDE</Text>
      <TouchableOpacity style={styles.picker} onPress={() => setShowPeptidePicker(true)}>
        <Text style={styles.pickerText}>{peptide}</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      {/* Inputs */}
      {[
        { label: 'VIAL POTENCY (mg)', value: vialMg, set: setVialMg, placeholder: 'e.g. 5' },
        { label: 'BAC WATER (mL)', value: bacMl, set: setBacMl, placeholder: 'e.g. 2' },
        { label: 'TARGET DOSE (mcg)', value: targetMcg, set: setTargetMcg, placeholder: 'e.g. 250' },
      ].map(({ label, value, set, placeholder }) => (
        <View key={label}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            value={value} onChangeText={set} placeholder={placeholder}
            keyboardType="decimal-pad" placeholderTextColor={colors.tx3}
            style={styles.input}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.calcBtn, (!vialMg || !bacMl || !targetMcg) && styles.disabledBtn]}
        onPress={calculate} disabled={loading || !vialMg || !bacMl || !targetMcg}
      >
        <Text style={styles.calcBtnText}>{loading ? 'Calculating…' : 'Calculate dose'}</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>DRAW</Text>
          <Text style={styles.resultBig}>{result.drawUnits.toFixed(1)}</Text>
          <Text style={styles.resultSub}>units on insulin syringe</Text>
          <View style={styles.resultGrid}>
            {[
              { l: 'Volume', v: `${result.drawMl.toFixed(4)} mL` },
              { l: 'Concentration', v: `${result.conc.toFixed(1)} mcg/mL` },
              { l: 'Doses/vial', v: result.doses },
            ].map(({ l, v }) => (
              <View key={l} style={styles.resultCell}>
                <Text style={styles.resultCellLabel}>{l.toUpperCase()}</Text>
                <Text style={styles.resultCellValue}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.disclaimer}>For research and educational purposes only. Not medical advice.</Text>

      {/* Peptide picker modal */}
      <Modal visible={showPeptidePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Peptide</Text>
            <ScrollView>
              {PEPTIDES.map(p => (
                <TouchableOpacity key={p} style={styles.peptideOption} onPress={() => { setPeptide(p); setShowPeptidePicker(false) }}>
                  <Text style={[styles.peptideOptionText, p === peptide && { color: colors.teal }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPeptidePicker(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sign up modal */}
      <Modal visible={modal === 'signup'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Get 20 more free calculations</Text>
            <Text style={styles.modalSub}>Create a free account — no credit card needed</Text>
            <TouchableOpacity style={styles.calcBtn} onPress={() => { setModal(null); router.push('/auth/signup') }}>
              <Text style={styles.calcBtnText}>Create free account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModal(null)} style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={{ color: colors.tx3, fontSize: 13 }}>Maybe later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Paywall modal */}
      <Modal visible={modal === 'paywall'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Unlock unlimited access</Text>
            <Text style={styles.modalSub}>You've used your 25 free calculations. Upgrade to Pro.</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <TouchableOpacity style={[styles.planCard, { flex: 1 }]} onPress={() => handleUpgrade('monthly')}>
                <Text style={styles.planPrice}>£9.99</Text>
                <Text style={styles.planPeriod}>/month</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.planCard, { flex: 1, borderColor: colors.gold }]} onPress={() => handleUpgrade('annual')}>
                <Text style={{ color: colors.gold, fontSize: 10, marginBottom: 4 }}>Best value</Text>
                <Text style={styles.planPrice}>£79</Text>
                <Text style={styles.planPeriod}>/year</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModal(null)} style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.tx3, fontSize: 13 }}>Maybe later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy },
  content: { padding: 20, paddingBottom: 40 },
  trialBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.navy2, borderRadius: 10, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  trialText: { color: colors.tx2, fontSize: 12, fontFamily: 'monospace' },
  upgradeLink: { color: colors.teal, fontSize: 12, fontFamily: 'monospace' },
  label: { color: colors.tx3, fontSize: 10, fontFamily: 'monospace', marginBottom: 6, marginTop: 14 },
  picker: { backgroundColor: colors.sl, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerText: { color: colors.tx, fontSize: 15 },
  chevron: { color: colors.tx3, fontSize: 10 },
  input: { backgroundColor: colors.sl, borderRadius: 10, padding: 14, color: colors.tx, fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  calcBtn: { backgroundColor: colors.teal, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  disabledBtn: { opacity: 0.5 },
  calcBtnText: { color: '#021a0e', fontSize: 16, fontWeight: '700' },
  resultCard: { backgroundColor: colors.navy2, borderRadius: 16, padding: 20, marginTop: 24, borderWidth: 1, borderColor: 'rgba(0,214,143,0.15)', alignItems: 'center' },
  resultLabel: { color: colors.tx3, fontSize: 10, fontFamily: 'monospace', marginBottom: 4 },
  resultBig: { color: colors.teal, fontSize: 56, fontWeight: '700', lineHeight: 64 },
  resultSub: { color: colors.tx2, fontSize: 13, marginBottom: 20 },
  resultGrid: { flexDirection: 'row', gap: 10, width: '100%' },
  resultCell: { flex: 1, backgroundColor: colors.sl, borderRadius: 10, padding: 12, alignItems: 'center' },
  resultCellLabel: { color: colors.tx3, fontSize: 9, fontFamily: 'monospace', marginBottom: 4 },
  resultCellValue: { color: colors.tx, fontSize: 13, fontWeight: '600' },
  disclaimer: { color: colors.tx3, fontSize: 11, textAlign: 'center', marginTop: 24, lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.navy2, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { color: colors.tx, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  modalSub: { color: colors.tx2, fontSize: 13, marginBottom: 20, lineHeight: 20 },
  modalCancel: { padding: 14, alignItems: 'center' },
  modalCancelText: { color: colors.tx3, fontSize: 14 },
  peptideOption: { padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  peptideOptionText: { color: colors.tx2, fontSize: 15 },
  planCard: { backgroundColor: colors.sl, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  planPrice: { color: colors.tx, fontSize: 26, fontWeight: '700' },
  planPeriod: { color: colors.tx3, fontSize: 12, fontFamily: 'monospace' },
})
