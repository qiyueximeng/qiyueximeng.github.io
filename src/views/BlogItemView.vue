<script setup lang="ts">
defineProps(['id']);
</script>

<template>
  <main class="blog">
    <!-- 补充面包屑组件 -->
    <iframe
      :name="id"
      :src="`https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/blog_website/posts_html/${id}.html`"
    />
  </main>
</template>

<style scoped>
iframe {
  width: 100%;
  height: calc(100vh - 7rem);
}
@media (min-width: 1024px) {
}
</style>