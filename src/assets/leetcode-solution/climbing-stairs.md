---
title: "爬楼梯"
date: "2022-07-31"
desc: "爬楼梯"
---

# 70. 爬楼梯

## 题目

> [中文站](https://leetcode-cn.com/problems/climbing-stairs/) [国际站](https://leetcode.com/problems/climbing-stairs/)

假设你正在爬楼梯。需要 `n`  阶你才能到达楼顶。

每次你可以爬 `1` 或 `2` 个台阶。你有多少种不同的方法可以爬到楼顶呢？

**示例 1：**

```
输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶
```

**示例 2：**

```
输入：n = 3
输出：3
解释：有三种方法可以爬到楼顶。
1. 1 阶 + 1 阶 + 1 阶
2. 1 阶 + 2 阶
3. 2 阶 + 1 阶
```

**提示：**

- `1 <= n <= 45`

## 解法

爬楼梯问题是典型的数学归纳法问题，根据题目描述可知，要爬到第 `n` 层楼梯，要么从第 `n - 1` 层往上爬一层，要么从第 `n - 2` 层往上爬两层，则爬到第 `n` 层楼梯的方法数为爬到第 `n - 1` 层的方法数加上爬到第 `n - 2` 层楼梯的方法数，可得推导公式：

- `f(1) = 1`
- `f(2) = 2`
- `f(k) = f(k - 1) + f(k - 2)`

### 递归 + 记忆化搜索（自顶向下）

> time: O(n), space: O(n)

通过递归方法天然满足这种自推导的公式，但是如果直接递归的话，会变成有多个同值的数据被重复计算的傻递归，其时间复杂度为 `2^n`，故可通过一个字典数据结构存储计算结果，避免重复计算。

```typescript
function climbStairs(n: number): number {
  const nums: number[] = new Array(n + 1);
  return helper(n);

  function helper(n: number) {
    if (n <= 3) return nums[n] = n;
    if (!nums[n]) {
      nums[n] = helper(n - 1) + helper(n - 2);
    }
    return nums[n];
  }
};
```

### 动态规划 + 数组推导（自底向上）

> time: O(n), space: O(n)

除了递归外，可通过迭代的方式进行公式推导，并使用一个数组维护推导过的结果值。

```typescript
function climbStairs(n: number): number {
  const result: number[] = [0, 1, 2, 3];
  for (let i = 4; i <= n; i++) {
    result[i] = result[i - 1] + result[i - 2];
  }
  return result[n];
}
```

### 动态规划 + 指针推导（自底向上）

> time: O(n), space: O(1)

根据题目意思，其实我们只需要获取推导完的最终结果值，并不需要推导期间产生的中间值，所以我们可以通过几个指针支持我们的推导，避免额外的存储空间。

```typescript
function climbStairs(n: number): number {
  if (n <= 3) return n;

  let [x, y, z] = [2, 3, 0];
  for (let i = 4; i <= n; i++) {
    z = x + y;
    [x, y] = [y, z];
  }
  return z;
};
```

### 矩阵快速幂/通项公式

> time: O(log(n)), space: O(1)

不会，有空可以去 `LeetCode` 看大神题解。