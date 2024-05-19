---
title: "括号生成"
date: "2022-03-05"
desc: "括号生成"
---

# 22. 括号生成

## 题目

> [中文站](https://leetcode-cn.com/problems/generate-parentheses/) [国际站](https://leetcode.com/problems/generate-parentheses/)

数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。

**示例 1：**

```
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
```

**示例 2：**

```
输入：n = 1
输出：["()"]
```

**提示：**

- `1 <= n <= 8`

## 解法

根据题目解析，主要有以下注意点：

- 有效括号，即左右括号要能完全匹配上
- `n` 对括号可能的所有组合，即把所有可能结果通过数组输出。

### 递归 + 剪枝

> time: O(4^n/√n), space: O(n), 时间复杂度的分析抄的 LeetCode

主要通过递归不停的尝试往字符串中添加左括号或右括号，在满足 `n` 对有效括号的解时，将其添加进结果数组。

- 创建递归函数 `helper`，并将左右括号的数量及当前字符串的值进行传递。
- 在递归函数中：
  - 若左右括号任一数量大于 `n`，或者右括号数量大于左括号，则该结果不满足题意，终止递归。
  - 若左右括号数量相等且等于 `n`，则该结果满足题意，将结果推入结果数组，终止递归。
  - 递归调用函数自身，并尝试给结果添加左括号或者右括号，并将添加的括号数量加一。
- 递归调用完成，返回结果数组。

```typescript
function generateParenthesis(n: number): string[] {
  const result: string[] = [];
  helper(0, 0, "");
  return result;
  function helper(l: number, r: number, str: string) {
    if (l > n || r > l) return;

    if (l === r && r == n) {
      result.push(str);
      return;
    }

    helper(l + 1, r, `${str}(`);
    helper(l, r + 1, `${str})`);
  }
}
```

### 动态规划

> time: O(4^n/√n), space: O(4^n/√n), 由于需要存储中间推导过程的结果，故空间复杂度较高

我们想要知道 `n` 对括号的组合情况，可以从 `n - 1` 对括号进行推导，首先我们可以明确的是，所有有效括号组合的最左边一定是左括号。

那么我们就可以假定第 `n` 对括号的左括号在最左边，右边一定有一个右括号与其匹配。那么将剩下的 `n - 1` 对括号进行排列组合就能生成所有的括号组合。

剩下的 `n - 1` 对括号必定分成有效的括号对 `p`、`q` 两份，`p` 在第 `n` 对括号内，`q` 在第 `n` 对括号右边（`p` `q` 可以为空）。

由于剩下了 `n - 1` 对括号，则 `p + q = n - 1` 且 `0 <= p < n - 1` 且 `0 <= q < n - 1`。

接着，我们通过一个数组，从 `0` 开始推导，并将推导的结果都存起来，直到 `n`。

```typescript
function generateParenthesis(n: number): string[] {
  // 用于存储推导结果的数组
  const arr: string[][] = [[""]];

  // 遍历推导 1 到 n 的结果
  for (let i = 1; i <= n; i++) {
    const res: string[] = [];

    // 从 0 到 i - 1，遍历 p,q 的多有可能组合
    for (let j = 0; j < i; j++) {
      const p = arr[j];
      const q = arr[i - 1 - j];
      for (const pn of p) {
        for (const qn of q) {
          // 将 p,q 的所有组合插入到最后一对括号的指定位置
          res.push(`(${pn})${qn}`);
        }
      }
    }

    // 将某一个位置的推导结果存起来
    arr[i] = res;
  }
  return arr[n];
}
```