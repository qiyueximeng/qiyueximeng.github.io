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
@media (min-width: 1024px) {
  .item {
    display: block;
    position: relative;
    color: var(--color-text);
    margin: 0.5rem 0;
    padding: 0 0.5rem;
  }
  .item:hover {
    transform: translate(1%, 0);
    background-color: var(--color-background);
  }
  .item::after {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    border-left: 1px solid;
    height: 100%;
  }
}
</style>