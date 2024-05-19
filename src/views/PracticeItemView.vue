<script setup lang="ts">
defineProps(['item', 'id']);
</script>

<template>
  <main class="practice">
    <!-- 补充面包屑组件 -->
    <iframe
      :name="id"
      :src="`https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/blog_website/${item.replaceAll('-', '_')}_html/${id}.html`"
    />
  </main>
</template>

<style scoped>
@media (min-width: 1024px) {
  iframe {
    width: 100%;
    height: 80vh;
    background-color: var(--color-background);
  }
}
</style>