<script setup lang="ts">
defineProps(['list']);

import ListItem from './ListItem.vue';
</script>

<template>
  <section class="list">
    <ListItem v-for="item of list" :key="item.title" :item />
  </section>
</template>

<style scoped>
  @media (min-width: 1024px) {
    .list {
      max-height: 80vh;
      overflow-y: auto;
    }
  }
</style>