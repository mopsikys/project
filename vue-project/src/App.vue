<template>
  <div class="app" :class="appClasses">
    <Sidebar
      @state:change="onSidebarState"
      @overlay:change="onOverlayChange"
    >
      <template #footer>
        © 2026 Кузница. Огонь и металл — наше ремесло
      </template>
    </Sidebar>

    <div v-if="overlayVisible" class="overlay" @click="closeOverlay"></div>

    <main class="content">
      <!-- 🔹 Здесь рендерятся страницы -->
      <RouterView />
      <Footer />
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { auth, db, authState } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: { Sidebar, Footer },
  setup() {
    const overlayVisible = ref(false)
    const expanded = ref(false)
    const mode = ref('overlay-desktop')
    const userData = ref(null)

    const onSidebarState = ({ expanded: e, mode: m }) => {
      expanded.value = e
      mode.value = m
    }
    const onOverlayChange = (v) => {
      overlayVisible.value = v
    }
    const closeOverlay = () => {
      overlayVisible.value = false
    }

    const appClasses = computed(() => ({
      'has-overlay-desktop': mode.value === 'overlay-desktop',
      'is-expanded': expanded.value,
    }))

    onMounted(() => {
      auth.onAuthStateChanged(async (u) => {
        if (u) {
          const snap = await getDoc(doc(db, 'users', u.uid))
          if (snap.exists()) {
            userData.value = snap.data()
          }
        }
      })
    })

    return { overlayVisible, appClasses, onSidebarState, onOverlayChange, closeOverlay, userData, authState }
  },
}
</script>

<style src="@/styles/sidebar.css"></style>
<style src="@/styles/main.css"></style>
