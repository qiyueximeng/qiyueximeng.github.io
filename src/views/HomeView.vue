<script setup lang="ts">
// import HelloWorld from '../components/HelloWorld.vue'
// import TheWelcome from '../components/TheWelcome.vue'
import { inflationRateAvg, depositInterestRateAvg, dichotomyCalcConsume } from '@/lib/retirement';

const words = [
  "人生本身没有意义，有意义的是这一生经历了什么",
  "人有无限的可能，所以重复的事情要交给机器。",
  "天下熙熙，皆为利来；天下攘攘，皆为利往。"
];
const word = words[Math.floor(Math.random() * words.length)];

const endYear = 2074;
const curYear = (new Date()).getFullYear();
const diffYear = endYear - curYear;
const depositCount = 600000;
const { consumeCount } = dichotomyCalcConsume({
  depositCount,
  depositRate: depositInterestRateAvg,
  consumeRate: inflationRateAvg,
  count: diffYear
});
const consumeCountEveryMonth = (consumeCount / 12).toFixed(0);
</script>

<template>
  <main class="home">
    <h1 class="green">幽涯</h1>
    <h3>{{ word }}</h3>
    <div>每月可支配金额为 {{ consumeCountEveryMonth }} 元</div>
  </main>
</template>

<style scoped>
@media (min-width: 1024px) {
  /* .greetings h1,
  .greetings h3 {
    text-align: left;
  } */
.home {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.home > h1,
.home > h3 {
  margin-bottom: 1rem;
}
}
</style>
