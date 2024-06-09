# 74. 搜索二维矩阵

## 题目

> [中文站](https://leetcode.cn/problems/search-a-2d-matrix/)

编写一个高效的算法来判断  `m x n`  矩阵中，是否存在一个目标值。该矩阵具有如下特性：

- 每行中的整数从左到右按升序排列。
- 每行的第一个整数大于前一行的最后一个整数。

示例 1：

```
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
输出：true
```

示例 2：

```
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
输出：false
```

提示：

- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 100`
- `-104 <= matrix[i][j], target <= 104`

## 题解

### 二分查找

该题的数据结构也满足二分查找的条件，只不过从原来的一维数组提升成了二维矩阵，可以对矩阵的宽和高各做一次二分查找来达到搜索的目的。

```typescript
function searchMatrix(matrix: number[][], target: number): boolean {
  const [mlen, nlen] = [matrix.length, matrix[0].length];

  let [ml, mr] = [0, mlen - 1];
  while (ml < mr) {
    const mmid = Math.ceil(ml + (mr - ml) / 2);
    if (matrix[mmid][0] === target) {
      return true;
    } else if (matrix[mmid][0] > target) {
      mr = mmid - 1;
    } else {
      ml = mmid;
    }
  }

  let [nl, nr] = [0, nlen - 1];
  while (nl <= nr) {
    const nmid = (nl + (nr - nl) / 2) | 0;
    if (matrix[ml][nmid] === target) {
      return true;
    } else if (matrix[ml][nmid] < target) {
      nl = nmid + 1;
    } else {
      nr = nmid - 1;
    }
  }

  return false;
}
```