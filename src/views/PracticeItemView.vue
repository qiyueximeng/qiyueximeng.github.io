<script setup lang="ts">
import MdPathPreview from '@/components/MdPathPreview.vue';

defineProps(['item', 'id']);
</script>

<template>
  <main class="practice">
    <!-- 补充面包屑组件 -->
    <MdPathPreview :id :path="`/${item}/${id}.md`"/>
    <!-- <iframe
      :name="id"
      :src="`https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/blog_website/${item.replaceAll('-', '_')}_html/${id}.html`"
    /> -->
  </main>
</template>

<style scoped>
.practice {
  padding-bottom: 2rem;
}
@media (min-width: 1024px) {
}
</style>