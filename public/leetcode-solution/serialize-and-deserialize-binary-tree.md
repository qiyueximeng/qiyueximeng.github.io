# 297. 二叉树的序列化与反序列化

## 题目

> [中文站](https://leetcode-cn.com/problems/serialize-and-deserialize-binary-tree/) [国际站](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者内存中，同时也可以通过网络传输到另一个计算机环境，采取相反方式重构得到原数据。

请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。

**示例 1：**

![](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/leetcode-solution/leetcode_297_image_1.jpeg)

```
输入：root = [1,2,3,null,null,4,5]
输出：[1,2,3,null,null,4,5]
```

**示例 2：**

```
输入：root = []
输出：[]
```

**示例 3：**

```
输入：root = [1]
输出：[1]
```

**示例 4：**

```
输入：root = [1,2]
输出：[1,2]
```

**提示：**

- 树的高度不会超过 `1000`
- 树的节点总数在 `[0, 10^4]` 之间
- `-1000 <= Node.val <= 1000`

## 解法

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

### 深度优先遍历

二叉树序列化的本质是对其结构进行编码，需要遍历树来完成编码任务，可以选择深度优先的前序遍历来完成这一操作。

- 序列化通过深度优先前序遍历完成。
- 遍历到当前节点为空时，返回字符串 X 替代，作为边界。
- 反序列化时，对之前序列化的结果进行遍历还原。
- 遇到非 X 值，创建节点，由于之前是前序遍历，故先创建节点，再递归左右节点。
- 遇到 X 值，返回空节点。

```typescript
function serialize(root: TreeNode | null): string {
  const list: (number | string)[] = [];
  helper(root, list);
  return list.join(",");
  function helper(node: TreeNode | null, list: (number | string)[]) {
    if (!node) {
      list.push("X");
      return;
    }

    list.push(node.val);
    helper(node.left, list);
    helper(node.right, list);
  }
}

function deserialize(data: string): TreeNode | null {
  // 此处做了个调整，每次遍历都要将当前节点推出数组，将数组翻转后推出操作为 O(1)
  return helper(data.split(",").reverse());
  function helper(list: string[]): TreeNode | null {
    const val = list.pop();
    if (val === "X") return null;
    const node = new TreeNode(parseInt(val));
    node.left = helper(list);
    node.right = helper(list);
    return node;
  }
}
```

### 广度优先遍历

相比于深度优先遍历，广度优先遍历会按层遍历节点，回复时也需要安层恢复。

序列化：通过一个队列维护遍历顺序，队列中初始为根节点

- 若出队列的是 null，则将 'X' 入结果集
- 若出队列的是节点，则将其值入结果集，并将左右子节点入队列
- 遍历完成后，将结果集转为字符串输出

反序列化：除开根节点为单个节点外，其他节点都是成对的（包括 null）

- 将字符串转为数组，再创建一个队列维护广度优先遍历顺序，通过一个变量 pointer 维护遍历到的位置
- 先构建根节点并推入队列，此时 pointer 移向下一个位置（根节点的左子节点）
- pointer 小于数组长度时，循环
  - 从队列推出节点，可知此时 pointer 位置的值为该节点的左子节点值，pointer + 1 位置的值为该节点右子节点值
  - 若左子节点值非 'X'，需构建左子节点，关联其父节点，并推入队列，为 'X' 不作处理
  - 右子节点同上。
- 将根节点返回

```typescript
function serialize(root: TreeNode | null): string {
  const queue: (TreeNode | null)[] = [root];
  const list: (string | number)[] = [];
  while (queue.length) {
    const node = queue.shift();
    if (!node) {
      list.push("X");
      continue;
    }
    list.push(node.val);
    queue.push(node.left, node.right);
  }
  return list.join(",");
}

function deserialize(data: string): TreeNode | null {
  if (data === "X") return null;

  const list = data.split(",");
  const root = new TreeNode(parseInt(list[0]));
  const queue = [root];
  let pointer = 1;
  while (pointer < list.length) {
    const node = queue.shift();
    if (list[pointer] !== "X") {
      const left = new TreeNode(parseInt(list[pointer]));
      node.left = left;
      queue.push(left);
    }
    if (list[pointer + 1] !== "X") {
      const right = new TreeNode(parseInt(list[pointer + 1]));
      node.right = right;
      queue.push(right);
    }
    pointer += 2;
  }
  return root;
}

// 通过指针访问减少数组频繁 shift 消耗的时间
function serialize(root: TreeNode | null): string {
  let pointer = 0;
  const queue: (TreeNode | null)[] = [root];
  const list: (string | number)[] = [];
  while (pointer < queue.length) {
    const node = queue[pointer++];
    if (!node) {
      list.push("X");
      continue;
    }
    list.push(node.val);
    queue.push(node.left, node.right);
  }
  return list.join(",");
}

function deserialize(data: string): TreeNode | null {
  if (data === "X") return null;

  const list = data.split(",");
  const root = new TreeNode(parseInt(list[0]));
  const queue = [root];
  let p1 = 1;
  let p2 = 0;
  while (p1 < list.length) {
    const node = queue[p2++];
    if (list[p1] !== "X") {
      const left = new TreeNode(parseInt(list[p1]));
      node.left = left;
      queue.push(left);
    }
    if (list[p1 + 1] !== "X") {
      const right = new TreeNode(parseInt(list[p1 + 1]));
      node.right = right;
      queue.push(right);
    }
    p1 += 2;
  }
  return root;
}
```