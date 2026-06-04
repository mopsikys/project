<template>
  <section class="profile">
    <!-- если пользователь не авторизован -->
    <Auth v-if="!user" />

    <!-- если авторизован -->
    <div v-else class="profile-page">
      <header class="profile-header">
        <img :src="userData.avatarUrl || avatarUrl" alt="profile" class="profile-icon" />
        <h1>Профиль</h1>
      </header>

      <div class="profile-info">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p v-if="userData?.name"><strong>Имя:</strong> {{ userData.name }}</p>
        <p v-if="userData?.phone"><strong>Телефон:</strong> {{ userData.phone }}</p>
        <p v-if="userData?.role"><strong>Роль:</strong> {{ userData.role }}</p>
        <p><strong>Дата регистрации:</strong> {{ user.metadata.creationTime }}</p>
        <p><strong>Последний вход:</strong> {{ user.metadata.lastSignInTime }}</p>
      </div>

      <div class="profile-actions">
        <button @click="logout">Выйти</button>
        <button @click="editMode = true">Редактировать профиль</button>
      </div>

      <!-- модальное окно редактирования -->
      <div v-if="editMode" class="modal">
        <div class="modal-content">
          <h2>Редактирование профиля</h2>
          <input v-model="userData.name" placeholder="Имя" />
          <input v-model="userData.phone" placeholder="Телефон" />
          <input v-model="userData.avatarUrl" placeholder="Ссылка на аватарку" />
          <button @click="saveProfile">Сохранить</button>
          <button class="close-btn" @click="editMode = false">Закрыть</button>
        </div>
      </div>

      <!-- блок заказов -->
      <div class="profile-orders" v-if="orders.length">
        <h2>История заказов</h2>
        <div class="orders-grid">
          <div class="order-card" v-for="order in orders" :key="order.id">
            <h3>Заказ №{{ order.id }}</h3>
            <p><small>Оформлен: {{ formatDate(order.createdAt) }}</small></p>
            <p><strong>Телефон:</strong> {{ order.phone }}</p>
            <p><strong>Статус:</strong> {{ order.status }}</p>
            <ul>
              <li v-for="item in order.items" :key="item.productId">
                {{ item.title }} — {{ item.quantity }} шт. ({{ item.price }}₸)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- блок отзывов -->
      <div class="profile-reviews" v-if="reviews.length">
        <h2>Мои отзывы</h2>
        <div class="reviews-grid">
          <div class="review-card" v-for="review in reviews" :key="review.id">
            <p><strong>{{ review.productTitle }}</strong></p>
            <p>{{ review.text }}</p>
            <div class="review-actions">
              <button @click="editReview(review)">Редактировать</button>
              <button @click="deleteReview(review.id)">Удалить</button>
            </div>
          </div>
        </div>
      </div>

      <!-- блок сообщений -->
      <div class="profile-messages" v-if="messages.length">
        <h2>Мои сообщения</h2>
        <div class="messages-grid">
          <div class="message-card" v-for="msg in messages" :key="msg.id">
            <p><strong>Имя:</strong> {{ msg.name }}</p>
            <p><strong>Email:</strong> {{ msg.email }}</p>
            <p><strong>Сообщение:</strong> {{ msg.message }}</p>
            <p><small>Отправлено: {{ formatDate(msg.createdAt) }}</small></p>
            <p>
              <strong>Ответ администратора:</strong>
              <span v-if="msg.reply">{{ msg.reply }}</span>
              <span v-else>Админы пока не ответили на сообщение</span>
            </p>
            <button @click="deleteMessage(msg.id)">Удалить</button>
          </div>
        </div>
      </div>
      <p v-else>Сообщений пока нет.</p>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { signOut } from 'firebase/auth'
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc, onSnapshot } from 'firebase/firestore'
import defaultAvatar from '@/assets/icons/profile.png'
import Auth from '@/components/Auth.vue'

export default {
  name: 'ProfilePage',
  components: { Auth },
  setup() {
    const user = ref(null)
    const userData = ref({})
    const router = useRouter()
    const avatarUrl = ref(defaultAvatar)
    const editMode = ref(false)
    const orders = ref([])
    const reviews = ref([])
    const messages = ref([])

    onMounted(() => {
      auth.onAuthStateChanged(async (u) => {
        user.value = u
        if (!u) return
        const snap = await getDoc(doc(db, 'users', u.uid))
        if (snap.exists()) userData.value = snap.data()

        // заказы (реактивный слушатель)
        const qOrders = query(collection(db, 'orders'), where('userId', '==', u.uid))
        onSnapshot(qOrders, async (snapOrders) => {
          const loadedOrders = []
          for (const docSnap of snapOrders.docs) {
            const itemsSnap = await getDocs(collection(docSnap.ref, 'items'))
            loadedOrders.push({
              id: docSnap.id,
              createdAt: docSnap.data().createdAt,
              phone: docSnap.data().phone,
              status: docSnap.data().status || 'новый',
              items: itemsSnap.docs.map(d => d.data())
            })
          }
          orders.value = loadedOrders
        })

        // отзывы
        const qReviews = query(collection(db, 'reviews'), where('userId', '==', u.uid))
        const snapReviews = await getDocs(qReviews)
        reviews.value = snapReviews.docs.map(d => ({ id: d.id, ...d.data() }))

        // сообщения (реактивный слушатель)
        const qMessages = query(collection(db, 'contacts'), where('userId', '==', u.uid))
        onSnapshot(qMessages, (snapMessages) => {
          messages.value = snapMessages.docs.map(d => ({ id: d.id, ...d.data() }))
        })
      })
    })

    const logout = async () => {
      await signOut(auth)
      user.value = null
      userData.value = {}
    }

    const saveProfile = async () => {
      await updateDoc(doc(db, 'users', user.value.uid), {
        name: userData.value.name,
        phone: userData.value.phone || '',
        avatarUrl: userData.value.avatarUrl || ''
      })
      editMode.value = false
    }

    const formatDate = (date) => {
      if (!date) return ''
      const d = date.toDate ? date.toDate() : new Date(date)
      return d.toLocaleString('ru-RU')
    }

    const editReview = async (review) => {
      const newText = prompt('Измените текст отзыва:', review.text)
      if (newText !== null) {
        await updateDoc(doc(db, 'reviews', review.id), { text: newText })
        review.text = newText
      }
    }

    const deleteReview = async (id) => {
      if (confirm('Удалить отзыв?')) {
        await deleteDoc(doc(db, 'reviews', id))
        reviews.value = reviews.value.filter(r => r.id !== id)
      }
    }

    const deleteMessage = async (id) => {
      if (confirm('Удалить сообщение?')) {
        await deleteDoc(doc(db, 'contacts', id))
        messages.value = messages.value.filter(m => m.id !== id)
      }
    }

    return { user, userData, avatarUrl, editMode, orders, reviews, messages, logout, saveProfile, formatDate, editReview, deleteReview, deleteMessage }
  }
}
</script>

<style src="@/styles/profile.css"></style>
