# 62. 不同路径

## 题目

> [中文站](https://leetcode.cn/problems/unique-paths/)

一个机器人位于一个 `m x n` 网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？

**示例 1：** 

```
输入：m = 3, n = 7
输出：28
```

**示例 2：** 

```
输入：m = 3, n = 2
输出：3
```

**提示：** 

- `1 <= m, n <= 100`
- 题目数据保证答案小于等于 `2 * 109`

## 解法

### 动态规划

由于机器人每次只能向右或向下走一步，则当前位置的路径数等于其右侧位置的路径数加上下方位置的路径数，即递推公式为：`a[i][j] = a[i][j + 1] + a[i + 1][j + 1]`。

其中有一些特殊情况要注意的是，在机器人已经到最右侧或者最下方的时候，只能验证剩下的一个方向一直走，此时的路径数固定为 1，即 `a[m - 1][n - 2] === a[m - 2][n - 1] === 1`

根据上面的分析得出我们的代码：

```typescript
function uniquePaths(m: number, n: number): number {
  const arr: number[][] = new Array(m).fill(0).map(() => new Array(n).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (i === m - 1 || j === n - 1) {
        arr[i][j] = 1;
      } else {
        arr[i][j] = arr[i + 1][j] + arr[i][j + 1];
      }
    }
  }
  return arr[0][0];
};
```