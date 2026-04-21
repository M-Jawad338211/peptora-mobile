import { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '../../src/lib/theme'

const PEPTIDES = [
  { name: 'BPC-157', category: 'Healing', status: 'Research', desc: 'Tissue repair, gut healing, angiogenesis.' },
  { name: 'TB-500', category: 'Healing', status: 'Research', desc: 'Wound healing, inflammation reduction, angiogenesis.' },
  { name: 'GHK-Cu', category: 'Regenerative', status: 'Research', desc: 'Skin repair, collagen synthesis, anti-inflammatory.' },
  { name: 'Ipamorelin', category: 'GH Peptide', status: 'Research', desc: 'Selective GH secretagogue, minimal cortisol elevation.' },
  { name: 'CJC-1295 (no DAC)', category: 'GH Peptide', status: 'Research', desc: 'GHRH analogue, 30 min half-life.' },
  { name: 'Semaglutide', category: 'GLP-1', status: 'FDA Approved', desc: 'GLP-1 agonist, T2D and obesity treatment.' },
  { name: 'Tirzepatide', category: 'GLP-1/GIP', status: 'FDA Approved', desc: 'Dual agonist, superior weight loss outcomes.' },
  { name: 'Retatrutide', category: 'Triple Agonist', status: 'Phase 3', desc: 'GLP-1/GIP/GCG triple agonist.' },
  { name: 'Semax', category: 'Nootropic', status: 'Research', desc: 'ACTH analogue, neuroprotection and cognition.' },
  { name: 'Selank', category: 'Nootropic', status: 'Research', desc: 'Anxiolytic and nootropic, intranasal.' },
  { name: 'Epitalon', category: 'Anti-aging', status: 'Research', desc: 'Telomere lengthening, anti-aging studies.' },
  { name: 'Thymosin Alpha-1', category: 'Immune', status: 'Approved (non-US)', desc: 'Immune modulator, 35+ countries approved.' },
  { name: 'MOTS-C', category: 'Mitochondrial', status: 'Research', desc: 'Metabolic regulation, insulin sensitivity.' },
  { name: 'SS-31', category: 'Mitochondrial', status: 'Clinical Trials', desc: 'Heart failure, mitochondrial targeting.' },
  { name: 'KPV', category: 'Anti-inflammatory', status: 'Research', desc: 'Alpha-MSH fragment, gut inflammation.' },
  { name: 'AOD-9604', category: 'Fat Loss', status: 'Research', desc: 'hGH fragment, fat metabolism.' },
  { name: 'MK-677', category: 'GH Secretagogue', status: 'Research', desc: 'Oral, increases GH and IGF-1.' },
]

const STATUS_COLORS = {
  'FDA Approved': colors.green, 'Research': colors.tx3, 'Phase 3': colors.gold,
  'Clinical Trials': colors.gold, 'Approved (non-US)': '#60a5fa',
}

export default function EncyclopediaTab() {
  const [search, setSearch] = useState('')

  const filtered = PEPTIDES.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View style={styles.container}>
      <TextInput
        value={search} onChangeText={setSearch}
        placeholder="Search peptides…" placeholderTextColor={colors.tx3}
        style={styles.search}
      />
      <FlatList
        data={filtered}
        keyExtractor={p => p.name}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item: p }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.category}>{p.category}</Text>
              <Text style={[styles.status, { color: STATUS_COLORS[p.status] || colors.tx3 }]}>{p.status}</Text>
            </View>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.desc}>{p.desc}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy },
  search: {
    margin: 16, backgroundColor: colors.navy2, borderRadius: 10, padding: 13,
    color: colors.tx, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
  },
  card: { backgroundColor: colors.navy2, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  category: { color: colors.tx3, fontSize: 10, fontFamily: 'monospace', backgroundColor: 'rgba(255,255,255,0.05)', padding: 3, paddingHorizontal: 8, borderRadius: 20 },
  status: { fontSize: 10, fontFamily: 'monospace' },
  name: { color: colors.tx, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  desc: { color: colors.tx2, fontSize: 13.5, lineHeight: 20 },
})
