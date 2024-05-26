<script setup lang="ts">
defineProps(['item']);
</script>

<template>
  <RouterLink class="item" :to="item.path">
    <h3>{{ item.title }}</h3>
    <div>{{ item.date }}</div>
    <div>{{  item.desc }}</div>
  </RouterLink>
</template>

<style scoped>
.item {
  display: block;
  position: relative;
  color: var(--color-text);
  margin: 1rem 0;
  padding: 0 1rem;
}
@media (min-width: 1024px) {
  .item:hover {
    background-color: #1E1E1E;
  }
}
</style>