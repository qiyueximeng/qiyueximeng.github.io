<script setup lang="ts">
defineProps(['id']);
</script>

<template>
  <main class="blog">
    <iframe
      :name="id"
      :src="`https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/blog_website/posts_html/${id}.html`"
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