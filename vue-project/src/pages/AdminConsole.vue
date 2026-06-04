<template>
  <section class="admin">
    <h1>Админ‑панель</h1>
    <p>Здесь вы можете управлять пользователями, заказами, товарами и контактами.</p>

    <!-- Пользователи -->
    <div class="admin-block">
      <h2 @click="toggleUsers" class="block-header">
        Пользователи
        <span class="arrow" :class="{ open: showUsers }">▼</span>
      </h2>
      <transition name="fade">
        <div v-if="showUsers">
          <ul>
            <li v-for="user in users" :key="user.uid">
              <strong>{{ user.name || user.email }}</strong> — {{ user.role }}
              <div class="actions">
                <button @click="makeAdmin(user.uid)">Сделать админом</button>
                <button @click="makeCustomer(user.uid)">Сделать клиентом</button>
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <!-- Заказы -->
    <div class="admin-block">
      <h2 @click="toggleOrders" class="block-header">
        Заказы
        <span class="arrow" :class="{ open: showOrders }">▼</span>
      </h2>
      <transition name="fade">
        <div v-if="showOrders">
          <div v-if="orders.length">
            <div class="order-card" v-for="order in orders" :key="order.id">
              <h3>Заказ №{{ order.id }}</h3>
              <p><small>Оформлен: {{ formatDate(order.createdAt) }}</small></p>
              <p><strong>Клиент:</strong> {{ order.name || 'не указан' }}</p>
              <p><strong>Email:</strong> {{ order.email || 'не указан' }}</p>
              <p><strong>Телефон:</strong> {{ order.phone || 'не указан' }}</p>
              <p><strong>Статус:</strong> {{ order.status }}</p>
              <ul>
                <li v-for="item in order.items" :key="item.productId">
                  {{ item.title }} — {{ item.quantity }} шт. ({{ item.price }} ₸)
                </li>
              </ul>
              <div class="actions">
                <button @click="updateOrderStatus(order.id, 'в обработке')">В обработке</button>
                <button @click="updateOrderStatus(order.id, 'завершён')">Завершён</button>
                <button @click="deleteOrder(order.id)">Удалить</button>
              </div>
            </div>
          </div>
          <p v-else>Заказов пока нет.</p>
        </div>
      </transition>
    </div>

    <!-- Контакты -->
    <div class="admin-block">
      <h2 @click="toggleContacts" class="block-header">
        Контакты
        <span class="arrow" :class="{ open: showContacts }">▼</span>
      </h2>
      <transition name="fade">
        <div v-if="showContacts">
          <div v-if="contacts.length">
            <div class="contact-card" v-for="c in contacts" :key="c.id">
              <p><strong>Имя:</strong> {{ c.name }}</p>
              <p><strong>Email:</strong> {{ c.email }}</p>
              <p><strong>Сообщение:</strong> {{ c.message }}</p>
              <p><small>Отправлено: {{ formatDate(c.createdAt) }}</small></p>
              <p v-if="c.reply"><strong>Ответ:</strong> {{ c.reply }}</p>
              <div class="actions">
                <button @click="replyToContact(c)">Ответить</button>
                <button @click="deleteContact(c.id)">Удалить</button>
              </div>
            </div>
          </div>
          <p v-else>Сообщений пока нет.</p>
        </div>
      </transition>
    </div>

    <!-- Добавление товара -->
    <div class="admin-block product-create">
      <h2>Добавить товар</h2>
      <form class="product-form" @submit.prevent="addProduct">
        <div class="form-group">
          <label>Название</label>
          <input v-model="newProduct.title" required />
        </div>
        <div class="form-group">
          <label>Описание</label>
          <textarea v-model="newProduct.description" />
        </div>
        <div class="form-group">
          <label>Материал</label>
          <input v-model="newProduct.material" />
        </div>
        <div class="form-group">
          <label>Цена</label>
          <input v-model.number="newProduct.price" type="number" required />
        </div>
        <div class="form-group">
          <label>Изображение (URL)</label>
          <input v-model="newProduct.image" />
        </div>
        <div class="form-group">
          <label>Загрузить файл</label>
          <input type="file" accept="image/*" @change="onFileChange" />
        </div>
        <button type="submit" class="btn-add">Добавить товар</button>
      </form>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { db, storage } from '@/firebase'
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export default {
  name: 'AdminConsole',
  setup() {
    const users = ref([])
    const orders = ref([])
    const contacts = ref([])

    const showUsers = ref(false)
    const showOrders = ref(false)
    const showContacts = ref(false)

    const newProduct = ref({ title: '', description: '', material: '', price: 0, image: '' })
    const file = ref(null)

    onMounted(async () => {
      // Пользователи
      const usersSnap = await getDocs(collection(db, 'users'))
      users.value = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }))

      // Заказы (реактивный слушатель)
      onSnapshot(collection(db, 'orders'), async (ordersSnap) => {
        orders.value = await Promise.all(
          ordersSnap.docs.map(async o => {
            const itemsSnap = await getDocs(collection(o.ref, 'items'))
            return {
              id: o.id,
              createdAt: o.data().createdAt,
              name: o.data().name,
              email: o.data().email,
              phone: o.data().phone,
              status: o.data().status || 'новый',
              items: itemsSnap.docs.map(i => i.data())
            }
          })
        )
      })

      // Контакты (реактивный слушатель)
      onSnapshot(collection(db, 'contacts'), (contactsSnap) => {
        contacts.value = contactsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      })
    })

    const toggleUsers = () => { showUsers.value = !showUsers.value }
    const toggleOrders = () => { showOrders.value = !showOrders.value }
    const toggleContacts = () => { showContacts.value = !showContacts.value }

    const makeAdmin = async (uid) => {
      await updateDoc(doc(db, 'users', uid), { role: 'admin' })
      users.value = users.value.map(u => (u.uid === uid ? { ...u, role: 'admin' } : u))
    }

    const makeCustomer = async (uid) => {
      await updateDoc(doc(db, 'users', uid), { role: 'customer' })
      users.value = users.value.map(u => (u.uid === uid ? { ...u, role: 'customer' } : u))
    }

    const updateOrderStatus = async (orderId, status) => {
      await updateDoc(doc(db, 'orders', orderId), { status })
    }

    const deleteOrder = async (orderId) => {
      await deleteDoc(doc(db, 'orders', orderId))
      orders.value = orders.value.filter(o => o.id !== orderId)
    }

    const deleteContact = async (contactId) => {
      await deleteDoc(doc(db, 'contacts', contactId))
      contacts.value = contacts.value.filter(c => c.id !== contactId)
    }

    const replyToContact = async (contact) => {
  const text = prompt('Введите ответ пользователю:', contact.reply || '')
  if (text !== null) {
    await updateDoc(doc(db, 'contacts', contact.id), { reply: text })
    // локально не обновляем, onSnapshot сам подтянет изменения
  }
  }

    const onFileChange = (e) => { file.value = e.target.files[0] }

    const addProduct = async () => {
      let image = newProduct.value.image
      if (file.value) {
                const imgRef = storageRef(storage, `products/${Date.now()}_${file.value.name}`)
        await uploadBytes(imgRef, file.value)
        image = await getDownloadURL(imgRef)
      }
      await addDoc(collection(db, 'products'), {
        ...newProduct.value,
        image,
        createdAt: new Date()
      })
      newProduct.value = { title: '', description: '', material: '', price: 0, image: '' }
      file.value = null
    }

    const formatDate = (date) => {
      if (!date) return ''
      const d = date.toDate ? date.toDate() : new Date(date)
      return d.toLocaleString('ru-RU')
    }

    return {
      users, orders, contacts,
      showUsers, showOrders, showContacts,
      newProduct, file,
      makeAdmin, makeCustomer,
      updateOrderStatus, deleteOrder, deleteContact,
      replyToContact, onFileChange, addProduct, formatDate,
      toggleUsers, toggleOrders, toggleContacts
    }
  }
}
</script>

<style src="@/styles/admin.css"></style>
