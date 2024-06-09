<script setup lang="ts">
import MdPathPreview from '@/components/MdPathPreview.vue';

defineProps(['id']);
</script>

<template>
  <main class="blog">
    <!-- 补充面包屑组件 -->
    <MdPathPreview :id :path="`/posts/${id}.md`" />
  </main>
</template>

<style scoped>
/* iframe {
  width: 100%;
  height: calc(100vh - 7rem);
} */
.blog {
  padding-bottom: 2rem;
}
@media (min-width: 1024px) {
}
</style>