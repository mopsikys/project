<template>
  <footer class="site-footer">
    <p>© 2026 Кузница. Огонь и металл — наше ремесло</p>
  </footer>
</template>

<script>
export default {
  name: "SiteFooter"
}
</script>

<style>
/* Общая структура страницы */
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;          /* высота экрана */
  display: flex;
  flex-direction: column;     /* контент сверху, футер снизу */
}

/* Основной контент должен иметь flex:1 */
#app {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Подвал */
.site-footer {
  margin-top: auto;           /* прижимает футер вниз */
  background: #0b0b0b;
  color: #d4af37;
  text-align: center;
  padding: 16px;
  border-top: 2px solid #b7410e;
  font-size: 14px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .site-footer {
    font-size: 13px;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .site-footer {
    font-size: 12px;
    padding: 10px;
  }
}
</style>
