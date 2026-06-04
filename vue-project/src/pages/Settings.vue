<template>
  <div class="settings-page">
    <h1>Настройки аккаунта</h1>

    <div class="settings-options">
      <button @click="openPhoneModal">Изменить номер телефона</button>
      <button @click="openEmailModal">Изменить email</button>
      <button @click="openPasswordModal">Сменить пароль</button>
      <button @click="openAvatarModal">Изменить аватарку</button>
      <button @click="logout">Выйти из аккаунта</button>
    </div>

    <!-- Модалка изменения телефона -->
    <div v-if="phoneModal" class="modal">
      <div class="modal-content">
        <h2>Изменение номера телефона</h2>
        <input v-model="newPhone" placeholder="Новый номер" />
        <button @click="updatePhone">Сохранить</button>
        <button class="close-btn" @click="phoneModal = false">Закрыть</button>
      </div>
    </div>

    <!-- Модалка изменения email -->
    <div v-if="emailModal" class="modal">
      <div class="modal-content">
        <h2>Изменение email</h2>
        <input v-model="newEmail" type="email" placeholder="Новый email" />
        <input v-model="currentPassword" type="password" placeholder="Текущий пароль" />
        <button @click="updateEmail">Сохранить</button>
        <button class="close-btn" @click="emailModal = false">Закрыть</button>
      </div>
    </div>

    <!-- Модалка смены пароля -->
    <div v-if="passwordModal" class="modal">
      <div class="modal-content">
        <h2>Смена пароля</h2>
        <input v-model="oldPassword" type="password" placeholder="Старый пароль" />
        <input v-model="newPassword" type="password" placeholder="Новый пароль" />
        <input v-model="confirmNewPassword" type="password" placeholder="Подтверждение нового пароля" />
        <button @click="changePassword">Сохранить</button>
        <button class="close-btn" @click="passwordModal = false">Закрыть</button>
      </div>
    </div>

    <!-- Модалка изменения аватарки -->
    <div v-if="avatarModal" class="modal">
      <div class="modal-content">
        <h2>Изменение аватарки</h2>
        <input v-model="newAvatarUrl" placeholder="Ссылка на аватарку" />
        <button @click="updateAvatar">Сохранить</button>
        <button class="close-btn" @click="avatarModal = false">Закрыть</button>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { auth, db } from '@/firebase'
import { updateDoc, doc } from 'firebase/firestore'
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail as fbUpdateEmail,
  signOut
} from 'firebase/auth'

export default {
  name: 'SettingsPage',
  setup() {
    const phoneModal = ref(false)
    const emailModal = ref(false)
    const passwordModal = ref(false)
    const avatarModal = ref(false)

    const newPhone = ref('')
    const newEmail = ref('')
    const currentPassword = ref('')
    const oldPassword = ref('')
    const newPassword = ref('')
    const confirmNewPassword = ref('')
    const newAvatarUrl = ref('')
    const error = ref('')

    const openPhoneModal = () => phoneModal.value = true
    const openEmailModal = () => emailModal.value = true
    const openPasswordModal = () => passwordModal.value = true
    const openAvatarModal = () => avatarModal.value = true

    const updatePhone = async () => {
      try {
        const user = auth.currentUser
        await updateDoc(doc(db, 'users', user.uid), { phone: newPhone.value })
        phoneModal.value = false
      } catch (err) {
        error.value = 'Ошибка изменения номера'
      }
    }

    const updateEmail = async () => {
      try {
        const user = auth.currentUser
        const credential = EmailAuthProvider.credential(user.email, currentPassword.value)
        await reauthenticateWithCredential(user, credential)
        await fbUpdateEmail(user, newEmail.value)
        await updateDoc(doc(db, 'users', user.uid), { email: newEmail.value })
        emailModal.value = false
      } catch (err) {
        error.value = 'Ошибка изменения email'
      }
    }

    const changePassword = async () => {
      try {
        const user = auth.currentUser
        if (newPassword.value !== confirmNewPassword.value) {
          error.value = 'Пароли не совпадают'
          return
        }
        const credential = EmailAuthProvider.credential(user.email, oldPassword.value)
        await reauthenticateWithCredential(user, credential)
        await updatePassword(user, newPassword.value)
        passwordModal.value = false
      } catch (err) {
        error.value = 'Ошибка смены пароля'
      }
    }

    const updateAvatar = async () => {
      try {
        const user = auth.currentUser
        await updateDoc(doc(db, 'users', user.uid), { avatarUrl: newAvatarUrl.value })
        avatarModal.value = false
      } catch (err) {
        error.value = 'Ошибка изменения аватарки'
      }
    }

    const logout = async () => {
      await signOut(auth)
    }

    return {
      phoneModal, emailModal, passwordModal, avatarModal,
      newPhone, newEmail, currentPassword, oldPassword, newPassword, confirmNewPassword, newAvatarUrl,
      error, openPhoneModal, openEmailModal, openPasswordModal, openAvatarModal,
      updatePhone, updateEmail, changePassword, updateAvatar, logout
    }
  }
}
</script>

<style src="@/styles/settings.css"></style>
