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
const depositCount = 650000;
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
    <div class="presentation">
      <p>真正意义上的自由不可实现，但我仍然希望达到尽可能的自由</p>
      <p>在存款的数额能保障我正常生活到 80 岁时，开始想对自由的过</p>
      <p>对能保障一个家庭正常开支的金额预算为每月 8000 元，需要将存款利息以及通胀都纳入计算</p>
      <p>以我当前的存款，每月可支配金额为 {{ consumeCountEveryMonth }} 元，任重道远</p>
    </div>
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

.home > h1 {
  margin-bottom: 2rem;
}

.home > h3 {
  margin-bottom: 1rem;
}

.presentation > p {
  text-align: center;
  margin-bottom: 0.5rem;
}
}
</style>
