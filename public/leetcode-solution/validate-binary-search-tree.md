# 98. 验证二叉搜索树

## 题目

> [中文站](https://leetcode-cn.com/problems/validate-binary-search-tree/) [国际站](https://leetcode.com/problems/validate-binary-search-tree/)

给你一棵二叉树的根节点 `root` ，判断其是否是一个有效的二叉搜索树。

**有效** 二叉搜索树定义如下：

- 节点的左子树只包含 **小于** 当前节点的数。
- 节点的右子树只包含 **大于** 当前节点的数。
- 所有左子树和右子树自身必须也是二叉搜索树。

**示例 1：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_98_image_1.jpeg)

```
输入：root = [2,1,3]
输出：true
```

**示例 2：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_98_image_2.jpeg)

```
输入：root = [5,1,4,null,null,3,6]
输出：false
解释：根节点的值是 5 ，但是右子节点的值是 4 。
```

**示例 3：**

```
输入：root = []
输出：[]
```

**提示：**

- 树中节点数目在范围 `[0, 10^4]` 内
- `-2^31 <= Node.val <= 2^31 - 1`

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

### 中序遍历

> time: O(n), space: O(n)

这里有一个结论：一棵二叉搜索树的中序遍历结果是升序的。所以这里只需要对树进行中序遍历，并验证其是否升序的，即可完成判断。

可以使用一个数组存储中序遍历的结果，并在遍历到每个节点时，判断其是否比数组中前一个节点大即可，不过我们会发现，其实我们只需要对比当前遍历的节点以及上一个遍历到的节点就行，无需再多存一个数组。

思路如下：

- 声明一个变量用于存储上一个节点的值
- 对树进行中序遍历（任意遍历方式都行，这里取了最简单的递归）
- 遍历到的节点与前一个节点值进行比较：
  - 若比前一节点值大，说明符合要求，将前一节点值更新为当前值，继续遍历
  - 否则，停止遍历，返回 false
- 遍历完成后，返回 true

```typescript
function isValidBST(root: TreeNode | null): boolean {
  // 初始化变量存储前一节点值，由于使用递归，通过一个变量维护结果
  let preVal = -Infinity;
  let result = true;

  helper(root);
  return result;

  function helper(node: TreeNode | null) {
    // 节点不存在或结果已为 false 则终止递归
    if (!node || !result) return;
    helper(node.left);
    if (node.val <= preVal) result = false;
    preVal = node.val;
    helper(node.right);
  }
}

// 另一种写法
function isValidBST(root: TreeNode | null): boolean {
  let preVal = -Infinity;
  return helper(root);

  function helper(node: TreeNode | null) {
    if (!node) return true;
    if (!helper(node.left)) return false;
    if (node.val <= preVal) return false;
    preVal = node.val;
    if (!helper(node.right)) return false;
    return true;
  }
}
```

### 递归

根据题目给出的信息，我们可以知道，我们需要判断一个节点是否满足要求，在知道其正确的左右边界时，再在一个函数 f(node,left,right) 内判断该节点是否在这个边界内即可。要判断整棵树是否满足要求，只需要递归调用函数检查左右子树即可。

根据搜索二叉树的性质，当我们调用左子树时，需要将右边界改为父节点的值，调用右子树时，需要将左边界改为父节点的值。

```typescript
function isValidBST(
  root: TreeNode | null,
  left = -Infinity,
  right = Infinity
): boolean {
  if (!root) return true;
  if (root.val <= left || root.val >= right) return false;
  return (
    isValidBST(root.left, left, root.val) &&
    isValidBST(root.right, root.val, right)
  );
}
```