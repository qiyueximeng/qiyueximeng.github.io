---
title: "有效地完全平方数"
date: "2022-07-31"
desc: "有效地完全平方数"
---

# 367. 有效地完全平方数

## 题目

> [中文站](https://leetcode.cn/problems/valid-perfect-square/)

## 题解

### 二分查找

### 牛顿迭代法

```typescript
function isPerfectSquare(num: number): boolean {
  let y = num;
  while (y * y > num) y = ((y + num / y) / 2) | 0;
  return y * y === num;
}
```