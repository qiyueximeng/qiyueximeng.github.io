---
title: "数据结构和算法"
date: "2023-07-08"
desc: "数据结构和算法"
---

# 数据结构和算法

## 算法类型

### 二分查找

使用二分查找算法的前提条件是：

- 目标函数的单调性（单调增/减）
- 存在上下界
- 能够通过索引访问

代码模板为：

```js
const [left, right] = [0, array.length - 1];

while (left <= right) {
  const mid = Math.floor((left + right) / 2);
  if (array[mid] === target) {
    // find the target
    break or return result
  } else if (array[mid] < target) {
    left = mid + 1;
  } else {
    right = mid - 1;
  }
}
```

相关练习题目有：

- [69. x 的平方根](/practice/leetcode-solution/sqrtx)
- [367. 有效的完全平方数](/practice/leetcode-solution/valid-perfect-square)
- [33. 搜索旋转排序数组](/practice/leetcode-solution/search-in-rotated-sorted-array)
- [74. 搜索二维矩阵](/practice/leetcode-solution/search-a-2d-matrix)
- [153. 寻找旋转排序数组中的最小值](/practice/leetcode-solution/find-minimum-in-rotated-sorted-array)





