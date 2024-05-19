<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ListItem from '../components/ListItem.vue';

const router = useRouter();

const dataStructure = ref({
  title: '数据结构和算法',
  path: '/practice/data-structure/index',
});
const dataStructures = ref([
  {
    title: "跳表",
    date: "2021-11-12",
    desc: "跳表，一个能够进行跳跃性查找的链表",
    path: '/practice/data-structure/skip-list',
  },
]);

const leetcodeSolution = ref({
  title: 'LeetCode 刷题页面',
  path: '/practice/leetcode-solution/index',
});
const leetcodeSolutions = ref([
  {
    title: "二叉树中序遍历",
    date: "2022-02-27",
    desc: "二叉树中序遍历",
    path: '/practice/leetcode-solution/binary-tree-inorder-traversal',
  },
  {
    title: "二叉树后序遍历",
    date: "2022-03-05",
    desc: "二叉树后序遍历",
    path: '/practice/leetcode-solution/binary-tree-postorder-traversal',
  },
]);

function toDataStructure() {
  router.push(dataStructure.value.path);
}
</script>

<template>
  <main class="practice">
    <section class="data-structure">
      <h2 @click="toDataStructure">{{ dataStructure.title }}</h2>
      <ListItem v-for="structure of dataStructures" :key="structure.title" :item="structure" />
    </section>
    <section class="leetcode-solution">
      <h2>{{ leetcodeSolution.title }}</h2>
      <ListItem v-for="solution of leetcodeSolutions" :key="solution.title" :item="solution" />
    </section>
  </main>
</template>

<style scoped>
@media (min-width: 1024px) {
  .data-structure > h2 {
    cursor: pointer;
  }
  .leetcode-solution {
    margin-top: 1rem;
  }
}
</style>