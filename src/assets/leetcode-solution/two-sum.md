---
title: "两数之和"
date: "2022-02-20"
desc: "两数之和"
---

# 1. 两数之和

## 题目

> [中文站](https://leetcode-cn.com/problems/two-sum/description/) [国际站](https://leetcode.com/problems/two-sum/description/)

给定一个整数数组 `nums`  和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** `target`  的那  **两个**  整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

**示例 1：**

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

**示例 2：**

```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

**示例 3：**

```
输入：nums = [3,3], target = 6
输出：[0,1]
```

**提示：**

- 2 <= nums.length <= 104
- -109 <= nums[i] <= 109
- -109 <= target <= 109
- 只会存在一个有效答案

**进阶：** 你可以想出一个时间复杂度小于 `O(n2)` 的算法吗？

## 解法

### 一次哈希表 O(n)

通过一次遍历，完成遍历过内容的维护以及结果的判断。
在遍历过程中，对每个元素与 `target` 进行计算，并判断结果是否在哈希表中：

- 若不存在，说明未找到结果，将当前值作为 `key`，下标作为 `value` 存入哈希表
- 若存在，说明找到了结果，从哈希表中取出对应下标，与当前下标一起返回

```typescript
function twoSum(nums: number[], target: number): number[] {
  const dict: Map<number, number> = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (dict.has(diff)) {
      return [dict.get(diff), i];
    } else {
      dict.set(nums[i], i);
    }
  }
}
```