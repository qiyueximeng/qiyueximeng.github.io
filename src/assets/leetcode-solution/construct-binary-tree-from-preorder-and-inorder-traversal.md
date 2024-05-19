---
title: "从前序与中序遍历序列构造二叉树"
date: "2022-03-23"
desc: "从前序与中序遍历序列构造二叉树"
---

# 105. 从前序与中序遍历序列构造二叉树

## 题目

> [中文站](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) [国际站](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

给定两个整数数组  `preorder` 和 `inorder` ，其中  `preorder` 是二叉树的 **先序遍历**， `inorder`  是同一棵树的 **中序遍历**，请构造二叉树并返回其根节点。



**示例 1:**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_105_image_1.jpeg)

```
输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
输出: [3,9,20,null,null,15,7]
```

**示例 2:**

```
输入: preorder = [-1], inorder = [-1]
输出: [-1]
```

**提示:**

- `1 <= preorder.length <= 3000`
- `inorder.length == preorder.length`
- `-3000 <= preorder[i], inorder[i] <= 3000`
- `preorder`  和  `inorder`  均 **无重复** 元素
- `inorder`  均出现在  `preorder`
- `preorder` **保证** 为二叉树的前序遍历序列
- `inorder` **保证** 为二叉树的中序遍历序列

## 题解

```typescript
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

### 递归

> time: O(n), space: O(n)

- 前序遍历的结果数组结构为 `[根节点, (左子树), (右子树)]`
- 中序遍历的结果数组结构为 `[(左子树),根节点,(右子树)]`
- 可知在中序遍历结果中找到根节点，就可确定其左右子树节点数量，这样也就可以在前序遍历结果中界定左右子树了
- 在知道中序遍历的左右子树后，就可递归的构造出左右子树，再拼到根节点了
- 又可知前序遍历结果的第一个值为根节点，就可通过这个值在中序遍历的结果中找到根节点
- 由于在中序遍历结果中遍历找到根节点需要 `O(n)` 复杂度，可通过 `map` 存储结果

```typescript
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // 通过 map 存储中序遍历的节点值和索引
  const map = new Map<number, number>();
  inorder.forEach((v, i) => {
    map.set(v, i);
  });

  const n = preorder.length;
  return helper(0, n - 1, 0, n - 1);

  function helper(
    preLeft: number,
    preRight: number,
    inLeft: number,
    inRight: number
  ) {
    // 子树不存在，则终止递归
    if (preLeft > preRight) return null;

    // 构建根节点
    const root = new TreeNode(preorder[preLeft]);
    // 找到中序遍历结果中根节点位置
    const inRootIndex = map.get(preorder[preLeft]);
    // 计算左子树节点数量
    const leftLength = inRootIndex - inLeft;

    // 递归构建左右子树
    root.left = helper(
      preLeft + 1,
      preLeft + leftLength,
      inLeft,
      inRootIndex - 1
    );
    root.right = helper(
      preLeft + leftLength + 1,
      preRight,
      inRootIndex + 1,
      inRight
    );

    return root;
  }
}
```