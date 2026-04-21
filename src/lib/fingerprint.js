import * as Device from 'expo-device'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

export async function getDeviceFingerprint() {
  const stored = await SecureStore.getItemAsync('device_fingerprint')
  if (stored) return stored

  const raw = [
    Device.osInternalBuildId || 'unknown',
    Platform.OS,
    Device.modelName || 'unknown',
    Device.osVersion || 'unknown',
  ].join('|')

  // Simple hash (no crypto.subtle in RN)
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  const fp = `mobile_${Platform.OS}_${Math.abs(hash).toString(16)}`
  await SecureStore.setItemAsync('device_fingerprint', fp)
  return fp
}
