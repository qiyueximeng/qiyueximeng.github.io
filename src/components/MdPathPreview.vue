<script setup lang="ts">
import { ref } from 'vue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

const props = defineProps(['id', 'path']);
// console.log('>>> path:', props.path);

const text = ref();
fetch(props.path)
  .then(res => res.text())
  .then(val => text.value = val);
</script>

<template>
  <MdPreview
    class="md-preview"
    :editor-id="id"
    :model-value="text"
    theme="dark"
    previewTheme="vuepress"
    codeTheme="atom"
    :autoFoldThreshold="200"
  />
</template>

<style scoped>
.md-preview {
  /* height: 100%; */
}
</style>
