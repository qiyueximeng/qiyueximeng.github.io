<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ListItem from '../components/ListItem.vue';

const route = useRoute();
const router = useRouter();

const dataStructurePath = `${route.path}/data-structure`;
const dataStructure = ref({
  title: '数据结构和算法',
  date: '2023-07-08',
  desc: '',
  path: `${dataStructurePath}/index`,
});
const dataStructures = ref([
  {
    title: "跳表",
    date: "2021-11-12",
    desc: "跳表，一个能够进行跳跃性查找的链表",
    path: `${dataStructurePath}/skip-list`,
  },
]);

const leetcodeSolutionPath = `${route.path}/leetcode-solution`;
const leetcodeSolution = ref({
  title: 'LeetCode 刷题页面',
  date: '',
  desc: '',
  path: `${leetcodeSolutionPath}/index`,
});
const leetcodeSolutions = ref([
  {
    title: "二叉树中序遍历",
    date: "2022-02-27",
    desc: "二叉树中序遍历",
    path: `${leetcodeSolutionPath}/binary-tree-inorder-traversal`,
  },
  {
    title: "二叉树后序遍历",
    date: "2022-03-05",
    desc: "二叉树后序遍历",
    path: `${leetcodeSolutionPath}/binary-tree-postorder-traversal`,
  },
  {
    title: "二叉树前序遍历",
    date: "2022-02-27",
    desc: "二叉树前序遍历",
    path: `${leetcodeSolutionPath}/binary-tree-preorder-traversal`,
  },
  {
    title: "爬楼梯",
    date: "2022-07-31",
    desc: "爬楼梯",
    path: `${leetcodeSolutionPath}/climbing-stairs`,
  },
  {
    title: "从前序与中序遍历序列构造二叉树",
    date: "2022-03-23",
    desc: "从前序与中序遍历序列构造二叉树",
    path: `${leetcodeSolutionPath}/construct-binary-tree-from-preorder-and-inorder-traversal`,
  },
  {
    title: "寻找旋转排序数组中的最小值",
    date: "2022-07-31",
    desc: "寻找旋转排序数组中的最小值",
    path: `${leetcodeSolutionPath}/find-minimum-in-rotated-sorted-array`,
  },
  {
    title: "括号生成",
    date: "2022-03-05",
    desc: "括号生成",
    path: `${leetcodeSolutionPath}/generate-parentheses`,
  },
  {
    title: "字母异位词分组",
    date: "2022-02-19",
    desc: "字母异位词分组",
    path: `${leetcodeSolutionPath}/group-anagrams`,
  },
  {
    title: "翻转二叉树",
    date: "2022-03-06",
    desc: "翻转二叉树",
    path: `${leetcodeSolutionPath}/invert-binary-tree`,
  },
  {
    title: "二叉树的最近公共祖先",
    date: "2022-03-13",
    desc: "二叉树的最近公共祖先",
    path: `${leetcodeSolutionPath}/lowest-common-ancestor-of-a-binary-tree`,
  },
  {
    title: "二叉树的最大深度",
    date: "2022-03-08",
    desc: "二叉树的最大深度",
    path: `${leetcodeSolutionPath}/maximum-depth-of-binary-tree`,
  },
  {
    title: "二叉树的最小深度",
    date: "2022-03-08",
    desc: "二叉树的最小深度",
    path: `${leetcodeSolutionPath}/minimum-depth-of-binary-tree`,
  },
  {
    title: "N叉树的层序遍历",
    date: "2022-03-05",
    desc: "N叉树的层序遍历",
    path: `${leetcodeSolutionPath}/n-ary-tree-level-order-traversal`,
  },
  {
    title: "N 叉树后序遍历",
    date: "2022-03-05",
    desc: "N 叉树后序遍历",
    path: `${leetcodeSolutionPath}/n-ary-tree-postorder-traversal`,
  },
  {
    title: "N 叉树的前序遍历",
    date: "2022-03-05",
    desc: "N 叉树的前序遍历",
    path: `${leetcodeSolutionPath}/n-ary-tree-preorder-traversal`,
  },
  {
    title: "搜索二维矩阵",
    date: "2022-07-31",
    desc: "搜索二维矩阵",
    path: `${leetcodeSolutionPath}/search-a-2d-matrix`,
  },
  {
    title: "搜索旋转排序数组",
    date: "2022-07-31",
    desc: "搜索旋转排序数组",
    path: `${leetcodeSolutionPath}/search-in-rotated-sorted-array`,
  },
  {
    title: "二叉树的序列化与反序列化",
    date: "2022-03-13",
    desc: "二叉树的序列化与反序列化",
    path: `${leetcodeSolutionPath}/serialize-and-deserialize-binary-tree`,
  },
  {
    title: "x 的平方根",
    date: "2022-07-31",
    desc: "x 的平方根",
    path: `${leetcodeSolutionPath}/sqrtx`,
  },
  {
    title: "两数之和",
    date: "2022-02-20",
    desc: "两数之和",
    path: `${leetcodeSolutionPath}/two-sum`,
  },
  {
    title: "不同路径II",
    date: "2022-07-31",
    desc: "不同路径II",
    path: `${leetcodeSolutionPath}/unique-paths-ii`,
  },
  {
    title: "不同路径",
    date: "2022-07-31",
    desc: "不同路径",
    path: `${leetcodeSolutionPath}/unique-paths`,
  },
  {
    title: "有效的字母异位词",
    date: "2022-02-19",
    desc: "有效的字母异位词",
    path: `${leetcodeSolutionPath}/valid-anagram`,
  },
  {
    title: "有效地完全平方数",
    date: "2022-07-31",
    desc: "两数有效地完全平方数之和",
    path: `${leetcodeSolutionPath}/valid-perfect-square`,
  },
  {
    title: "验证二叉搜索树",
    date: "2022-03-07",
    desc: "验证二叉搜索树",
    path: `${leetcodeSolutionPath}/validate-binary-search-tree`,
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