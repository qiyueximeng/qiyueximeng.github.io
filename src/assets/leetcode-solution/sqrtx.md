---
title: "x 的平方根"
date: "2022-07-31"
desc: "x 的平方根"
---

# 69. x 的平方根

## 题目

> [中文站](https://leetcode.cn/problems/sqrtx/)

## 题解

### 二分查找

```typescript
function mySqrt(x: number): number {
  if (x < 2) return x;

  let [left, right, ans] = [0, x, 0];
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (mid * mid > x) {
      right = mid - 1;
    } else {
      ans = mid;
      left = mid + 1;
    }
  }
  return ans;
}
```