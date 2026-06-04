<template>
  <div class="products-page">
    <section class="products">
      <!-- Экран загрузки -->
      <div v-if="loading" class="loading-screen">
        <video
          class="anvil-animation"
          autoplay
          muted
          loop
          playsinline
        >
          <source src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/vintage-anvil-animation-gif-download-12374675.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <p>Загрузка товаров...</p>
      </div>

      <div v-else>
        <header class="products-header">
          <h1>Товары кузницы</h1>
          <p>Выберите изделие и оформите заказ.</p>

          <!-- Поиск -->
          <input 
            v-model="searchQuery" 
            placeholder="Поиск по названию, описанию или категории" 
            class="search-input" />

          <!-- Фильтрация -->
          <select v-model="selectedCategory" class="filter-select">
            <option value="">Все категории</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>

          <!-- Сортировка -->
          <select v-model="sortBy" class="sort-select">
            <option value="date">По дате</option>
            <option value="price">По цене</option>
            <option value="title">По названию</option>
          </select>
        </header>

        <div class="products-list" :class="{ sorted: sortBy }">
          <div v-for="p in filteredProducts" :key="p.id" class="product-card">
            <img :src="p.image" :alt="p.title" class="product-image" loading="lazy" />
            <h3>{{ p.title }}</h3>
            <p><strong>Материал:</strong> {{ p.material }}</p>
            <p v-if="p.price"><strong>Цена:</strong> {{ p.price }} ₸</p>
            <p v-else class="no-price">Цена не указана</p>
            <button @click="openProduct(p)">Оформить</button>
          </div>
        </div>

        <!-- Модальное окно оформления заказа -->
        <div v-if="selectedProduct" class="modal">
          <div class="modal-content">
            <h2>Оформление заказа: {{ selectedProduct.title }}</h2>
            <img :src="selectedProduct.image" :alt="selectedProduct.title" class="modal-image" />
            <p v-if="selectedProduct.price"><strong>Цена:</strong> {{ selectedProduct.price }} ₸</p>
            <p v-else><strong>Цена:</strong> не указана</p>
            <p><strong>Материал:</strong> {{ selectedProduct.material }}</p>
            <p><strong>Описание:</strong> {{ selectedProduct.description }}</p>

            <div class="form-group">
              <label for="quantity">Количество</label>
              <input type="number" id="quantity" v-model.number="quantity" min="1" />
            </div>

            <div class="form-group" v-if="!userPhone">
              <label>Телефон для связи</label>
              <input v-model="phone" placeholder="Введите номер телефона" />
            </div>

            <div class="modal-actions">
              <button @click="order">Подтвердить</button>
              <button class="close-btn" @click="closeModal">Закрыть</button>
            </div>

            <p v-if="error" class="error">{{ error }}</p>
          </div>
        </div>

        <!-- Сообщение после заказа -->
        <div v-if="orderMessage" class="small-modal">
          <div class="small-modal-content">
            <p>{{ orderMessage }}</p>
            <button class="close-btn" @click="orderMessage = ''">Закрыть</button>
          </div>
        </div>

        <!-- Модалка для незарегистрированных -->
        <div v-if="showAuthModal" class="modal">
          <div class="modal-content">
            <h2>Авторизация</h2>
            <p>Чтобы оформить заказ, нужно войти или зарегистрироваться.</p>
            <RouterLink to="/profile">
              <button>Войти / Регистрация</button>
            </RouterLink>
            <button class="close-btn" @click="showAuthModal = false">Закрыть</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase'

export default {
  name: 'Products',
  setup() {
    const products = ref([])
    const selectedProduct = ref(null)
    const quantity = ref(1)
    const orderMessage = ref('')
    const error = ref('')
    const phone = ref('')
    const userPhone = ref(null)
    const showAuthModal = ref(false)
    const loading = ref(true)

    // поиск/фильтрация/сортировка
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const sortBy = ref('date')
    const categories = ref([])

    onMounted(async () => {
      try {
        const snap = await getDocs(collection(db, 'products'))
        products.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        categories.value = [...new Set(products.value.map(p => p.category).filter(Boolean))]
        if (auth.currentUser) {
          const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid))
          if (userSnap.exists()) {
            userPhone.value = userSnap.data().phone || null
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки товаров:', err)
      } finally {
        loading.value = false
      }
    })

    const filteredProducts = computed(() => {
      let result = products.value

      // поиск
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase().trim()
        result = result.filter(p =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        )
      }

      // фильтрация
      if (selectedCategory.value) {
        result = result.filter(p => p.category === selectedCategory.value)
      }

      // сортировка
      if (sortBy.value === 'price') {
        result = result.sort((a, b) => (a.price || 0) - (b.price || 0))
      } else if (sortBy.value === 'title') {
        result = result.sort((a, b) => a.title.localeCompare(b.title))
      } else if (sortBy.value === 'date') {
        result = result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      }

      return result
    })

    const openProduct = (product) => {
      selectedProduct.value = product
      quantity.value = 1
      phone.value = ''
      error.value = ''
    }

    const closeModal = () => {
      selectedProduct.value = null
    }

    const order = async () => {
      error.value = ''
      if (!auth.currentUser) {
        showAuthModal.value = true
        return
      }
      if (!selectedProduct.value) {
        error.value = 'Не выбран товар для заказа'
        return
      }
      const finalPhone = userPhone.value || phone.value
      if (!finalPhone) {
        error.value = 'Введите номер телефона для связи с вами'
        return
      }
      try {
        const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid))
        const userData = userSnap.data()
        const orderRef = await addDoc(collection(db, 'orders'), {
          userId: auth.currentUser.uid,
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || finalPhone,
          createdAt: serverTimestamp(),
          status: 'новый'
        })
        await addDoc(collection(db, 'orders', orderRef.id, 'items'), {
          productId: selectedProduct.value.id,
          title: selectedProduct.value.title,
          material: selectedProduct.value.material,
          price: selectedProduct.value.price || 0,
          quantity: quantity.value
        })
        orderMessage.value = 'Заявка отправлена! С вами свяжется администратор.'
        closeModal()
      } catch (err) {
        console.error('Ошибка оформления заказа:', err)
        error.value = 'Не удалось оформить заказ'
      }
    }

    return {
      products,
      selectedProduct,
      quantity,
      phone,
      userPhone,
      orderMessage,
      error,
      showAuthModal,
      loading,
      searchQuery,
      selectedCategory,
      sortBy,
      categories,
      filteredProducts,
      openProduct,
      closeModal,
      order
    }
  }
}
</script>

<style src="@/styles/products.css"></style>
