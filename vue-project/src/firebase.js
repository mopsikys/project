// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { reactive } from "vue"

// 🔹 Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCRAHU4HAF7OLo1OibqqNnrw6wQyPhfCsU",
  authDomain: "vue-shop-fc163.firebaseapp.com",
  projectId: "vue-shop-fc163",
  storageBucket: "vue-shop-fc163.appspot.com",
  messagingSenderId: "963327712585",
  appId: "1:963327712585:web:f12a0fdd78514556fdce98"
}

// 🔹 Инициализация приложения (только один раз)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// 🔹 Экспорт сервисов Firebase
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// 🔹 Глобальное состояние авторизации
export const authState = reactive({
  user: null,
  isAdmin: false,
  ready: false,
  userData: null, // данные из коллекции users
})

// 🔹 Авторизация через Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // 🔹 Сохраняем данные в коллекцию users
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
      phone: user.phoneNumber || "",
      avatarUrl: user.photoURL || "",
      role: "customer",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    }, { merge: true })

    // 🔹 Обновляем глобальное состояние
    authState.userData = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      phone: user.phoneNumber,
      avatarUrl: user.photoURL,
      role: "customer"
    }

    return user
  } catch (error) {
    console.error("Ошибка входа через Google:", error)
    throw error
  }
}

// 🔹 Следим за изменением состояния авторизации
onAuthStateChanged(auth, async (user) => {
  authState.user = user
  authState.isAdmin = false
  authState.userData = null

  if (user) {
    try {
      // Проверка роли и данных в коллекции users
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists()) {
        const data = snap.data()
        authState.userData = data
        if (data.role === 'admin') {
          authState.isAdmin = true
        }
      }
    } catch (error) {
      console.error("Ошибка проверки пользователя:", error)
    }
  }

  authState.ready = true
})
