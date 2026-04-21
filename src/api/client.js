import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.peptora.app'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Platform': Platform.OS,
  },
})

// Attach JWT from SecureStore on every request
client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 — clear stored tokens
client.interceptors.response.use(
  res => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('access_token')
      await SecureStore.deleteItemAsync('refresh_token')
    }
    return Promise.reject(error)
  }
)

export default client

export async function saveTokens(accessToken, refreshToken) {
  await SecureStore.setItemAsync('access_token', accessToken)
  if (refreshToken) await SecureStore.setItemAsync('refresh_token', refreshToken)
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync('access_token')
  await SecureStore.deleteItemAsync('refresh_token')
}

export async function getStoredToken() {
  return SecureStore.getItemAsync('access_token')
}
