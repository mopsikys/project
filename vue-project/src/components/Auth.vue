<template>
  <div class="auth-box">
    <h2 v-if="mode === 'register'">Регистрация</h2>
    <h2 v-else>Вход</h2>

    <!-- Регистрация -->
    <form v-if="mode === 'register'" @submit.prevent="onRegister">
      <div class="form-group"><label>Имя</label><input v-model="name" type="text" required /></div>
      <div class="form-group"><label>Email</label><input v-model="email" type="email" required /></div>
      <div class="form-group"><label>Телефон</label><input v-model="phone" type="tel" required /></div>
      <div class="form-group"><label>Пароль</label><input v-model="password" type="password" required /></div>
      <div class="form-group"><label>Подтверждение пароля</label><input v-model="confirmPassword" type="password" required /></div>
      <button type="submit">Зарегистрироваться</button>
    </form>

    <!-- Вход -->
    <form v-else @submit.prevent="onLogin">
      <div class="form-group"><label>Email</label><input v-model="loginEmail" type="email" required /></div>
      <div class="form-group"><label>Пароль</label><input v-model="loginPassword" type="password" required /></div>
      <button type="submit">Войти</button>
    </form>

    <!-- 🔹 Кнопка Google -->
    <button @click="loginGoogle" class="google-btn">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
      Вход / Регистрация через Google
    </button>

    <!-- 🔹 Переключатель режимов -->
    <div style="margin-top:12px;">
      <button @click="toggleMode" class="close-btn">
        {{ mode === 'register' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться' }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db, signInWithGoogle } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'

export default {
  name: 'AuthBox',
  setup() {
    const router = useRouter()
    const name = ref('')
    const phone = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const loginEmail = ref('')
    const loginPassword = ref('')
    const error = ref('')
    const mode = ref('register')

    const onRegister = async () => {
      if (password.value !== confirmPassword.value) {
        error.value = 'Пароли не совпадают'
        return
      }
      const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name: name.value,
        email: cred.user.email,
        phone: phone.value,
        avatarUrl: '',
        role: 'customer',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      })
    }

    const onLogin = async () => {
      const cred = await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
      await updateDoc(doc(db, 'users', cred.user.uid), { lastLogin: serverTimestamp() })
      const snap = await getDoc(doc(db, 'users', cred.user.uid))
      if (snap.exists() && snap.data().role === 'admin') router.push('/admin')
    }

    const loginGoogle = async () => {
      try {
        await signInWithGoogle()
      } catch (err) {
        error.value = 'Ошибка входа через Google'
        console.error(err)
      }
    }

    const toggleMode = () => {
      mode.value = mode.value === 'register' ? 'login' : 'register'
    }

    return {
      name, phone, email, password, confirmPassword,
      loginEmail, loginPassword, error, mode,
      onRegister, onLogin, loginGoogle, toggleMode
    }
  }
}
</script>

<style src="@/styles/profile.css"></style>
