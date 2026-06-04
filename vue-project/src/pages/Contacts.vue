<template>
  <div class="contacts-page">
    <section class="contacts">
      <h1>Связаться с нами</h1>
      <p>Вы можете оставить заявку или написать напрямую:</p>

      <div class="contact-info">
        <p><strong>Email:</strong> forge@example.com</p>
        <p><strong>Телефон:</strong> +7 (777) 123‑45‑67</p>
        <p><strong>Адрес:</strong> Алматы, ул. Кузнечная, 15</p>
      </div>

      <!-- Форма обратной связи -->
      <form class="contact-form" @submit.prevent="sendMessage">
        <input type="text" v-model="name" placeholder="Ваше имя" required />
        <input type="email" v-model="email" placeholder="Ваш email" required />
        <textarea v-model="message" placeholder="Ваше сообщение" required></textarea>
        <button type="submit">Отправить</button>
      </form>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'
import { db, auth } from '@/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export default {
  name: "Contacts",
  setup() {
    const name = ref('')
    const email = ref('')
    const message = ref('')
    const successMessage = ref('')
    const errorMessage = ref('')

    const sendMessage = async () => {
      successMessage.value = ''
      errorMessage.value = ''
      try {
        await addDoc(collection(db, 'contacts'), {
          userId: auth.currentUser ? auth.currentUser.uid : null,
          name: name.value,
          email: email.value,
          message: message.value,
          createdAt: serverTimestamp()
        })
        successMessage.value = 'Ваше сообщение успешно отправлено!'
        name.value = ''
        email.value = ''
        message.value = ''
      } catch (err) {
        console.error('Ошибка отправки сообщения:', err)
        errorMessage.value = 'Не удалось отправить сообщение. Попробуйте позже.'
      }
    }

    return { name, email, message, successMessage, errorMessage, sendMessage }
  }
}
</script>

<style src="@/styles/contacts.css"></style>
