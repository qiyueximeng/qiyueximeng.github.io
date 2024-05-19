---
title: "翻转二叉树"
date: "2022-03-06"
desc: "翻转二叉树"
---

# 226. 翻转二叉树

## 题目

> [中文站](https://leetcode-cn.com/problems/invert-binary-tree/) [国际站](https://leetcode.com/problems/invert-binary-tree/)

给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。

**示例 1：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_226_image_1.jpeg)

```
输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]
```

**示例 2：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_226_image_2.jpeg)

```
输入：root = [2,1,3]
输出：[2,3,1]
```

**示例 3：**

```
输入：root = []
输出：[]
```

**提示：**

- 树中节点数目在范围 `[0, 100]` 内
- `-100 <= Node.val <= 100`

## 解法

**节点数据结构：**

```
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */
```

**解题思路：**

对二叉树的翻转，可以做出以下总结：

- 要对节点的左右节点进行交换
- 所有的左子树和右子树也都需要重复上面的交换动作

### 递归

> time: O(n), space: O(n)

根据解题思路分析，这种最近重复性很明显的题目，天然可以通过递归完成。

```typescript
function invertTree(root: TreeNode | null): TreeNode | null {
  // 终止条件
  if (!root) return root;

  // 交换节点
  [root.left, root.right] = [root.right, root.left];

  // 左右子树下探
  invertTree(root.left);
  invertTree(root.right);

  return root;
}
```

### 栈迭代 + 类型区分 O(n)

> time: O(n), space: O(n)

递归的方式是通过系统维护的调用栈来维持节点访问顺序的，故也可手动通过栈维护节点调用关系。

```typescript
function invertTree(root: TreeNode | null): TreeNode | null {
  // 创建栈
  const stack: (TreeNode | null)[] = [root];

  // 栈内有节点时，说明未访问完成
  while (stack.length) {
    const node = stack.pop();
    // 对不存在的节点跳过
    if (!node) continue;

    // 交换子节点
    [node.left, node.right] = [node.right, node.left];

    // 将子节点推入栈，等待访问
    stack.push(node.left, node.right);
  }
  return root;
}
```