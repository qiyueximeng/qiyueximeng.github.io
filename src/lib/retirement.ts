// https://www.kylc.com/stats/global/yearly_per_country/g_inflation_consumer_prices/chn.html
const inflation = [
  0.35, // 2000
  0.72, // 2001
  -0.73,// 2002
  1.13, // 2003
  3.82, // 2004
  1.78, // 2005
  1.65, // 2006
  4.82, // 2007
  5.93, // 2008
  -0.73,// 2009
  3.18, // 2010
  5.55, // 2011
  2.62, // 2012
  2.62, // 2013
  1.92, // 2014
  1.44, // 2015
  2,    // 2016
  1.59, // 2017
  2.07, // 2018
  2.9,  // 2019
  2.42, // 2020
  0.98, // 2021
  1.97, // 2022
];

// 通货膨胀率的正态平均数，取中间 80% 计算平均
const normalRate = 0.1;
const normalCount = Math.ceil(inflation.length * normalRate);
const normalInflation = Array.from(inflation).sort().slice(normalCount, inflation.length - normalCount);
const inflationRateAvg = (normalInflation.reduce((res, item) => res + item, 0) / normalInflation.length / 100 + 1).toFixed(4);
// 平均存款利率，以大额存单估算
const depositInterestRateAvg = 1.03;


// 计算阶乘
function factorial(multiple: number, count = 1) {
  let base = 1;
  for (let i = 0; i < count; i++) {
    base = base * multiple;
  }
  return base;
}

// 计算包含通胀总价值
function calcConsume(consume: number, multiple: number, count: number) {
  let base = 0;
  for (let i = 1; i <= count; i++) {
    base += consume * factorial(multiple, i);
  }
  return base;
}

/**
 * 计算存款消耗情况
 * @param {number} deposit 存款
 * @param {number} depositMultiple 平均存款利率
 * @param {number} consume 每年消耗
 * @param {number} consumeMultiple 平均每年通胀率
 * @param {number} count 期望年限
 * @returns {{ years: number; surplus: number }} 返回结余金额和已用年限
 */
function calcDepositConsume(deposit: number, depositMultiple: number, consume: number, consumeMultiple: number, count: number) {
  for (let i = 1; i <= count; i++) {
    if (deposit < consume) return { years: i - 1, surplus: deposit };
    deposit -= consume;
    deposit *= depositMultiple;
    // console.log(`>>> 第 ${i} 年消耗 ${(consume).toFixed(0)} 结余 ${(deposit).toFixed(0)} ${Math.floor(deposit / 10000)} 万`)
    consume *= consumeMultiple;
  }
  return { years: count, surplus: deposit };
}

/**
 * 计算存款可用年限
 * @param {number} deposit 存款
 * @param {number} depositMultiple 平均存款利率
 * @param {number} consume 每年消耗
 * @param {number} consumeMultiple 平均每年通胀
 * @returns {{ years: number; surplus: number }} 返回年限和结余金额, 年限上限为 100 年
 */
function calcDepositConsumeYear(deposit: number, depositMultiple: number, consume: number, consumeMultiple: number) {
  let years = 0;
  while (years < 100) {
    if (deposit < consume) return { years, surplus: deposit };
    deposit -= consume;
    deposit *= depositMultiple;
    consume *= consumeMultiple;
    years++;
  }
  return { years, surplus: deposit };
}

function dichotomyCalcDeposit(depositMultiple: number, consume: number, consumeMultiple: number, count: number) {
  let value = consume;
  const GAP = 1000;
  const range = [value, Infinity];
  while (true) {
    const { years } = calcDepositConsume(value, depositMultiple, consume, consumeMultiple, count);
    // console.log(`>>> 价值 ${(value).toFixed(0)} 结余 ${(res).toFixed(0)}`);
    if (years < count) {
      range[0] = value;
      if (range[1] === Infinity) {
        value *= 2;
      } else {
        value = range[0] + (range[1] - range[0]) / 2;
      }
    } else {
      if (range[1] - range[0] <= GAP) {
        return value;
      } else {
        range[1] = value;
        value = range[0] + (range[1] - range[0]) / 2;
      }
    }
  }
}

function dichotomyCalcDeposit2(depositMultiple: number, consume: number, consumeMultiple: number, count: number) {
  let value = consume;
  const GAP = 1000;
  const range = [value, Infinity];
  while (true) {
    const { years, surplus } = calcDepositConsume(value, depositMultiple, consume, consumeMultiple, count);
    // console.log(`>>> 价值 ${(value).toFixed(0)} 结余 ${(res).toFixed(0)}`);
    if (years < count || surplus < value) {
      range[0] = value;
      if (range[1] === Infinity) {
        value *= 2;
      } else {
        value = range[0] + (range[1] - range[0]) / 2;
      }
    } else {
      if (range[1] - range[0] <= GAP) {
        return value;
      } else {
        range[1] = value;
        value = range[0] + (range[1] - range[0]) / 2;
      }
    }
  }
}

function dichotomyCalcConsume(deposit: number, depositMultiple: number, consumeMultiple: number, count: number) {
  let value = deposit;
  const GAP = 100;
  const range = [0, value];
  while (true) {
    const { years } = calcDepositConsume(deposit, depositMultiple, value, consumeMultiple, count);
    if (years < count) {
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

function dichotomyCalcConsume2(deposit: number, depositMultiple: number, consumeMultiple: number, count: number) {
  let value = deposit;
  const GAP = 100;
  const range = [0, value];
  while (true) {
    const { years, surplus } = calcDepositConsume(deposit, depositMultiple, value, consumeMultiple, count);
    if (years < count || surplus < deposit) {
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

function main() {
  const endYear = 2084;
  const startYear = 2024;
  const count = endYear - startYear;

  const deposit = 629 * 10000;
  const consume = 10 * 10000;
  const consumeMultiple = 1.025;
  const depositMultiple = 1.03;

  /* const res = calcConsume(consume, consumeMultiple, count);
  console.log('>>> 总消耗：', res, Math.ceil(res / 10000), '万');

  const value = deposit * factorial(depositMultiple, count);
  console.log('>>> 总价值：', value, Math.ceil(value / 10000), '万'); */

  const { years: years2, surplus: surplus2 } = calcDepositConsume(deposit, depositMultiple, consume, consumeMultiple, count);
  console.log(`>>> ${deposit} 每年消耗 ${consume}, ${years2} 年预估结余: ${surplus2} ${Math.floor(surplus2 / 10000)} 万`);

  const value3 = dichotomyCalcDeposit(depositMultiple, consume, consumeMultiple, count);
  console.log(`>>> 每年消耗 ${consume}, ${count} 年不保本需: ${(value3).toFixed(0)} ${Math.ceil(value3 / 10000)} 万`);

  const value4 = dichotomyCalcDeposit2(depositMultiple, consume, consumeMultiple, count);
  console.log(`>>> 每年消耗 ${consume}, ${count} 年保本需: ${(value4).toFixed(0)} ${Math.ceil(value4 / 10000)} 万`);

  const deposit5 = 50 * 10000;
  const value5 = dichotomyCalcConsume(deposit5, depositMultiple, consumeMultiple, count);
  console.log(`>>> ${deposit5} ${count} 年不保本, 每年可用: ${(value5).toFixed(0)} 元`);

  const value6 = dichotomyCalcConsume2(deposit5, depositMultiple, consumeMultiple, count);
  console.log(`>>> ${deposit5} ${count} 年保本, 每年可用: ${(value6).toFixed(0)} 元`);

  const { years: years7, surplus: surplus7 } = calcDepositConsumeYear(deposit, depositMultiple, consume, consumeMultiple);
  console.log(`>>> ${deposit} 每年消耗 ${consume}, ${years7} 年预估结余: ${surplus7} ${Math.floor(surplus7 / 10000)} 万`);
}
