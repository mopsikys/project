<template>
  <div>
    <!-- Бургер-кнопка -->
    <button
      v-if="!isOpen && !isDesktop"
      class="sidebar__burger"
      aria-label="Открыть меню"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span class="burger__line"></span>
      <span class="burger__line"></span>
      <span class="burger__line"></span>
    </button>

    <!-- Десктопная боковая панель -->
    <aside
      class="sidebar"
      :class="sidebarClasses"
      role="navigation"
      aria-label="Основная панель"
      @mouseenter="onHover(true)"
      @mouseleave="onHover(false)"
    >
      <div class="sidebar__inner">
        <nav class="sidebar__nav">
          <RouterLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="nav__item"
            :class="{ 'is-active': isActive(item.to) }"
            @click="closeMenu"
          >
            <img :src="item.icon" class="nav__icon" alt="" aria-hidden="true" />
            <span v-if="isExpanded" class="nav__label">{{ item.label }}</span>
          </RouterLink>
        </nav>

        <footer class="sidebar__footer">
          <RouterLink
            to="/contacts"
            class="nav__item"
            :class="{ 'is-active': isActive('/contacts') }"
            @click="closeMenu"
          >
            <img :src="contacts" class="nav__icon" alt="" aria-hidden="true" />
            <span v-if="isExpanded" class="nav__label">Контакты</span>
          </RouterLink>
          <slot name="footer"></slot>
        </footer>
      </div>
    </aside>

    <!-- Overlay для мобильного меню -->
    <div v-if="isOpen && !isDesktop" class="overlay" @click="closeMenu"></div>

    <!-- Мобильное меню -->
    <nav v-if="isOpen && !isDesktop" class="mobile-menu">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="nav__item"
        :class="{ 'is-active': isActive(item.to) }"
        @click="closeMenu"
      >
        <img :src="item.icon" class="nav__icon" alt="" aria-hidden="true" />
        <span class="nav__label">{{ item.label }}</span>
      </RouterLink>
      <RouterLink
        to="/contacts"
        class="nav__item"
        :class="{ 'is-active': isActive('/contacts') }"
        @click="closeMenu"
      >
        <img :src="contacts" class="nav__icon" alt="" aria-hidden="true" />
        <span class="nav__label">Контакты</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

import home from '@/assets/icons/home.png'
import products from '@/assets/icons/products.png'
import info from '@/assets/icons/info.png'
import profile from '@/assets/icons/profile.png'
import settings from '@/assets/icons/settings.png'
import contacts from '@/assets/icons/contacts.png'
import panel from '@/assets/icons/panel.png'

export default {
  name: 'Sidebar',
  setup() {
    const route = useRoute()
    const isDesktop = ref(false)
    const isHover = ref(false)
    const isOpen = ref(false)

    const items = ref([
      { to: '/', label: 'Главная', icon: home },
      { to: '/products', label: 'Товары', icon: products },
      { to: '/info', label: 'Инфо', icon: info },
      { to: '/profile', label: 'Профиль', icon: profile },
      { to: '/settings', label: 'Настройки', icon: settings },
    ])

    const addAdminItem = () => {
      if (!items.value.find(i => i.to === '/admin')) {
        items.value.push({
          to: '/admin',
          label: 'Админ панель',
          icon: panel,
        })
      }
    }

    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) return
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists() && snap.data().role === 'admin') {
          addAdminItem()
        }
      })
    })

    const isActive = (to) => route.path === to

    const mqDesktop = window.matchMedia('(min-width: 1024px)')
    const updateViewport = () => {
      isDesktop.value = mqDesktop.matches
      if (isDesktop.value) {
        closeMenu()
      }
    }

    const toggle = () => {
      isOpen.value = !isOpen.value
      document.documentElement.classList.toggle('no-scroll', isOpen.value)
    }

    const closeMenu = () => {
      isOpen.value = false
      document.documentElement.classList.remove('no-scroll')
    }

    const onHover = (val) => {
      if (!isDesktop.value) return
      isHover.value = val
    }

    const isExpanded = computed(() =>
      isDesktop.value ? isHover.value : isOpen.value
    )

    const sidebarClasses = computed(() => ({
      'is-expanded': isExpanded.value,
      'is-overlay': true,
    }))

    onMounted(() => {
      updateViewport()
      mqDesktop.addEventListener('change', updateViewport)
    })

    onBeforeUnmount(() => {
      mqDesktop.removeEventListener('change', updateViewport)
      document.documentElement.classList.remove('no-scroll')
    })

    return {
      items,
      contacts,
      isOpen,
      isExpanded,
      sidebarClasses,
      isActive,
      onHover,
      toggle,
      closeMenu,
      isDesktop,
    }
  },
}
</script>

<style src="../styles/sidebar.css"></style>
