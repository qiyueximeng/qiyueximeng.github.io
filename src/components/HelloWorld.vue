<script setup lang="ts">
defineProps<{
  msg: string
}>()

const words = [
  "人生本身没有意义，有意义的是这一生经历了什么",
  "人有无限的可能，所以重复的事情要交给机器。",
  "天下熙熙，皆为利来；天下攘攘，皆为利往。"
];
const word = words[Math.floor(Math.random() * words.length)];

const endYear = 2074;
const curYear = (new Date()).getFullYear();
const diffYear = endYear - curYear;
const count = (dichotomyCalcConsume({
  deposit: 500000,
  depositMultiple: 1.03,
  consumeMultiple: 1.025,
  count: diffYear
}) / 12).toFixed(0);

function dichotomyCalcConsume({
  deposit, depositMultiple, consumeMultiple, count
}: {
  deposit: number;
  depositMultiple: number;
  consumeMultiple: number;
  count: number;
}) {
  let value = deposit;
  const GAP = 100;
  const range = [0, value];
  while (true) {
    const res = calcDepositConsume({deposit, depositMultiple, consume: value, consumeMultiple, count});
    if (res <= deposit) {
      range[1] = value;
      value = range[0] + (range[1] - range[0]) / 2;
    } else {
      if (range[1] - range[0] <= GAP) {
        return value;
      } else {
        range[0] = value;
        value = range[0] + (range[1] - range[0]) / 2;
      }
    }
  }
}

function calcDepositConsume({
  deposit, depositMultiple, consume, consumeMultiple, count
}: {
  deposit: number;
  depositMultiple: number;
  consume: number;
  consumeMultiple: number;
  count: number;
}) {
  for (let i = 1; i <= count; i++) {
    if (deposit < 0) return 0;
    deposit -= consume;
    deposit *= depositMultiple;
    // console.log(`>>> 第 ${i} 年消耗 ${(consume).toFixed(0)} 结余 ${(deposit).toFixed(0)} ${Math.floor(deposit / 10000)} 万`)
    consume *= consumeMultiple;
  }
  return deposit > 0 ? deposit : 0;
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>{{ word }}</h3>
    <div>每月可支配金额为 {{ count }} 元</div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
