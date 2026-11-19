import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

/** .env 에 Firebase 설정이 채워져 있는지 */
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId)

type FirebaseServices = {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  storage: FirebaseStorage
}

/** 설정이 없으면 null. (설정 없이도 앱이 깨지지 않고 안내 화면을 보여주기 위함) */
export const firebase: FirebaseServices | null = isFirebaseConfigured
  ? (() => {
      const app = initializeApp(config)
      return {
        app,
        auth: getAuth(app),
        db: getFirestore(app),
        storage: getStorage(app),
      }
    })()
  : null
