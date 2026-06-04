<template>
   <div class="card">
    <img v-if="image" :src="image" alt="product" />

    <h3>{{ title }}</h3>

    <p v-if="description">{{ description }}</p>

    <p v-if="material">
      <strong>Материал:</strong> {{ material }}
    </p>

    <p class="price">
      <strong>{{ price }} ₸</strong>
    </p>

    <button @click="$emit('order')">
      Заказать
    </button>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    material: {
      type: String,
      default: ''
    },
    price: {
      type: [Number, String],
      default: null
    },
    showOrderButton: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
}

.card img {
  width: 100%;
  height: 220px;       /* фиксированная высота */
  object-fit: cover;   /* увеличивает маленькие картинки */
  border-radius: 8px;
  border: 2px solid #ff6b00; /* огненный акцент */
  box-shadow: 0 0 8px rgba(255, 107, 0, 0.4);
}



.description {
  margin: 8px 0;
}

.material,
.price {
  margin: 4px 0;
  font-size: 14px;
}

.order-btn {
  margin-top: 10px;
}
</style>