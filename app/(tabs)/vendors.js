import { View, Text, FlatList, StyleSheet } from 'react-native'
import { colors } from '../../src/lib/theme'

const VENDORS = [
  { name: 'Peptide Sciences', status: 'Active', coa: true, notes: 'HPLC tested, US-based' },
  { name: 'Amino Asylum', status: 'Active', coa: true, notes: 'Wide selection' },
  { name: 'Core Peptides', status: 'Active', coa: true, notes: 'Third-party tested' },
  { name: 'Swiss Chems', status: 'Active', coa: true, notes: 'International shipping' },
  { name: 'Behemoth Labz', status: 'Caution', coa: false, notes: 'COA inconsistencies' },
  { name: 'Biotech Peptides', status: 'Shutdown', coa: false, notes: 'No longer operational' },
]

const STATUS = {
  Active: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', text: colors.green },
  Caution: { bg: 'rgba(226,185,106,0.1)', border: 'rgba(226,185,106,0.2)', text: colors.gold },
  Shutdown: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: colors.red },
}

export default function VendorsTab() {
  return (
    <View style={styles.container}>
      <FlatList
        data={VENDORS} keyExtractor={v => v.name}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.header}>Vendor Status Board</Text>
            <Text style={styles.subheader}>Peptora does not endorse any vendor. Verify COAs independently.</Text>
          </View>
        }
        renderItem={({ item: v }) => {
          const s = STATUS[v.status] || STATUS.Caution
          return (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.vendorName}>{v.name}</Text>
                <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.border }]}>
                  <Text style={[styles.badgeText, { color: s.text }]}>{v.status}</Text>
                </View>
              </View>
              <View style={styles.row2}>
                <Text style={[styles.coa, { color: v.coa ? colors.green : colors.tx3 }]}>
                  {v.coa ? '✓ COA' : '✗ No COA'}
                </Text>
                <Text style={styles.notes}>{v.notes}</Text>
              </View>
            </View>
          )
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy },
  header: { color: colors.tx, fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subheader: { color: colors.tx3, fontSize: 11, lineHeight: 17 },
  card: { backgroundColor: colors.navy2, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  row2: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  vendorName: { color: colors.tx, fontSize: 15, fontWeight: '600' },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1 },
  badgeText: { fontSize: 11, fontFamily: 'monospace' },
  coa: { fontSize: 12, fontFamily: 'monospace' },
  notes: { color: colors.tx2, fontSize: 12, flex: 1 },
})
