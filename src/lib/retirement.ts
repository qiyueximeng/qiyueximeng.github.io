export interface IDeposit {
  depositCount: number; // 存款
  depositRate: number; // 存款利率
}

export interface IConsume {
  consumeCount: number; // 消耗
  consumeRate: number; // 消耗通胀率
}

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
export const inflationRateAvg = +(normalInflation.reduce((res, item) => res + item, 0) / normalInflation.length / 100 + 1).toFixed(4);
// 平均存款利率，以大额存单估算
export const depositInterestRateAvg = 1.03;


// 计算阶乘
export function factorial(multiple: number, count = 1) {
  let base = 1;
  for (let i = 0; i < count; i++) {
    base *= multiple;
  }
  return base;
}

// 计算包含通胀总消耗
export function calcConsume(consume: number, rate: number, count: number) {
  let base = 0;
  for (let i = 1; i <= count; i++) {
    base += consume;
    consume *= rate;
  }
  return base;
}

/**
 * 计算存款消耗情况
 * 返回结余金额和经过年限
 */
function calcDepositConsume(
  { depositCount, depositRate, consumeCount, consumeRate, count }: IDeposit & IConsume & { count: number; }
) {
  let i = 0;
  while (i < count) {
    if (depositCount < 0) {
      break;
    }
    depositCount -= consumeCount;
    depositCount *= depositRate;
    // console.log(`>>> 第 ${i + 1} 年消耗 ${(consume).toFixed(0)} 结余 ${(deposit).toFixed(0)} ${Math.floor(deposit / 10000)} 万`)
    consumeCount *= consumeRate;
    i++;
  }

  return { count: i, depositCount };
}

/**
 * 固定年限和每年消耗，计算需要多少存款才能支撑
 * needKeepDeposit: 是否在最后需要保本
 */
export function dichotomyCalcDeposit(
  { depositRate, consumeCount, consumeRate, count }: IConsume & { depositRate: number; count: number; },
  needKeepDeposit = false,
) {
  const GAP = 1000;
  const range = [consumeCount, Infinity];
  let endDeposit = 0;
  let depositCount = consumeCount;
  while (range[1] - range[0] > GAP) {
    depositCount = range[0] + range[1] === Infinity ? range[0] : (range[1] - range[0]) / 2;
    if (needKeepDeposit) {
      endDeposit = depositCount;
    }
    const { depositCount: deposit } = calcDepositConsume({ depositCount, depositRate, consumeCount, consumeRate, count });
    if (deposit <= endDeposit) {
      range[0] = depositCount;
    } else if(range[1] - range[0] > GAP) {
      range[1] = depositCount;
    }
  }
  return depositCount;
}

/**
 * 固定年限和存款，计算每年能使用多少钱
 * needKeepDeposit: 是否在最后需要保本
 */
export function dichotomyCalcConsume(
  { depositCount, depositRate, consumeRate, count }: IDeposit & { consumeRate: number; count: number; },
  needKeepDeposit = false,
) {
  const range = [0, depositCount];
  const GAP = 100;
  const endDeposit = needKeepDeposit ? depositCount : 0;
  let consumeCount = depositCount;
  let deposit = 0;
  while (range[1] - range[0] > GAP) {
    consumeCount = range[0] + (range[1] - range[0]) / 2;
    const res = calcDepositConsume({
      depositCount,
      depositRate,
      consumeCount, 
      consumeRate,
      count
    });
    deposit = res.depositCount;
    if (deposit <= endDeposit) {
      range[1] = consumeCount;
    } else if (range[1] - range[0] > GAP) {
      range[0] = consumeCount;
    }
  }
  return { consumeCount, status: deposit > endDeposit };
}
