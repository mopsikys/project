<template>
  <section class="home">
    <div class="hero">
      <div class="hero-content">
        <span class="hero-label">Artisanal Metalwork</span>
        <h1>Мастерство, закаленное в огне</h1>
        <p>Создаем уникальные изделия из металла, которые станут историей вашей семьи. От фамильных клинков до массивных интерьерных решений.</p>
        <div class="hero-actions">
          <router-link to="/products"><button class="btn-main">Исследовать коллекцию</button></router-link>
          <router-link to="/contacts" style="margin-left: 10px;"><button class="btn-outline">Связаться с мастером</button></router-link>
        </div>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-card">
        <span class="stat-num">15+</span>
        <span class="stat-desc">Лет опыта</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">1200°C</span>
        <span class="stat-desc">Жар горна</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">3000+</span>
        <span class="stat-desc">Работ создано</span>
      </div>
    </div>

    <div class="services-overview">
      <h2 class="section-title">Наши направления</h2>
      <div class="features">
        <div class="feature-card">
          <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800" alt="Кузнец за работой" class="card-img">
          <h3>Художественная ковка</h3>
          <p>Интерьерный декор и мебель в стиле лофт с уникальным рисунком молота.</p>
        </div>
        <div class="feature-card">
          <img src="https://outdor.ru/image/catalog/Tech_img/Articles/damask.fw.png" alt="Дамасский нож" class="card-img">
          <h3>Оружейное дело</h3>
          <p>Ножи и топоры из дамасской стали с идеальным балансом и закалкой.</p>
        </div>
        <div class="feature-card">
          <img src="https://3dprintlabs.ru/wp-content/uploads/2020/05/lite-metallov.jpg" alt="Литейный процесс" class="card-img">
          <h3>Литье и Сварка</h3>
          <p>Создание сложных металлоконструкций: от ворот до монументальных лестниц.</p>
        </div>
      </div>
    </div>

    <div class="visual-journal">
      <div class="journal-header">
        <h2 class="section-title">Энергия металла</h2>
      </div>
      <div class="journal-grid">
        <div class="grid-item tall">
          <img src="https://prometresurs.by/wp-content/uploads/2023/05/Process-proizvodstva-stali.jpeg" alt="Раскаленный металл на наковальне">
          <div class="overlay-text">Ритм стали</div>
        </div>
        <div class="grid-item">
          <img src="https://thumbs.dreamstime.com/b/%D0%BF%D0%BB%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-%D0%BC%D0%B5%D1%82%D0%B0%D0%BB%D0%BB%D0%B0-%D0%B2-%D0%B7%D0%B0%D0%B2%D0%BE%D0%B4%D0%B5-%D0%BF%D0%BE-%D0%B8%D0%B7%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8E-%D1%81%D1%82%D0%B0%D0%BB%D0%B8-%D0%B2%D1%8B%D1%81%D0%BE%D0%BA%D0%B0%D1%8F-%D1%82%D0%B5%D0%BC%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D1%83%D1%80%D0%B0-130486393.jpg" alt="Плавка металла">
          <div class="overlay-text">Жидкий жар</div>
        </div>
        <div class="grid-item">
          <img src="https://kizlyar-moscow.ru/image/cache/catalog/oooppkizljar/03098/3f1a0678-1200x800.jpg" alt="Интерьер кузницы">
          <div class="overlay-text">Финальный блеск</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style src="@/styles/home.css"></style>
