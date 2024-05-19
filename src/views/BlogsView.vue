<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const list = ref([
  {
    title: "IP 协议简述",
    date: "2022-04-18",
    desc: "简单描述 IP 协议及其部首设计",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "TCP 协议简述",
    date: "2022-04-03",
    desc: "简单描述 TCP 协议及其部首设计",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "UDP 协议简述",
    date: "2022-04-05",
    desc: "简单描述 UDP 协议及其部首设计",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "JavaScript Array 对象是如何工作的",
    date: "2021-11-30",
    desc: "从 V8 源码简单了解 JavaScript Array 对象的实现",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "如何实现 Express 中间件",
    date: "2021-07-22",
    desc: "介绍 Express 中间件的原理，并实现一个简版中间件模块",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "如何实现 Koa 中间件",
    date: "2021-08-10",
    desc: "介绍 Koa 中间件的原理，并实现一个简版中间件模块",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "如何使用 immer",
    date: "2021-01-27",
    desc: "简单介绍 immer 的使用及优点",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "JavaScript Sandbox",
    date: "2022-04-27",
    desc: "简单梳理了下 JS 沙盒的概念、场景和几种实现",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "nestjs tdd —— 前置准备",
    date: "2021-06-25",
    desc: "nestjs 项目启动前的准备",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "nestjs tdd —— service",
    date: "2021-06-27",
    desc: "nestjs 项目 service 单测和开发",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "nestjs tdd —— controller",
    date: "2021-06-29",
    desc: "nestjs 项目 controller 单测和开发",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "nestjs tdd —— e2e",
    date: "2021-07-04",
    desc: "nestjs 项目端到端测试",
    path: 'a-brief-description-of-ip-protocol',
  },
  {
    title: "TypeScript 类型随记",
    date: "2020-12-10",
    desc: "罗列一些实际场景及接口的类型优化方式",
    path: 'a-brief-description-of-ip-protocol',
  }
]);
</script>

<template>
  <main class="blogs">
    <RouterLink class="blog-item" v-for="item of list" :key="item.title" :to="item.path">
      <h3>{{ item.title }}</h3>
      <div>{{ item.date }}</div>
      <div>{{  item.desc }}</div>
    </RouterLink>
  </main>
</template>

<style scoped>
@media (min-width: 1024px) {
  .blogs {
    max-height: 80vh;
    overflow-y: auto;
  }

  .blog-item {
    display: block;
    color: var(--color-text);
    margin: 0 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid;
  }
  .blog-item:last-child {
    border-bottom: 0;
  }
  .blog-item:hover {
    transform: scale(1.01);
    background-color: var(--color-background);
  }
}
</style>