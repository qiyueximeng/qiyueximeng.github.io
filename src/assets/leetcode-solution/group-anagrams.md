---
title: "字母异位词分组"
date: "2022-02-19"
desc: "字母异位词分组"
---

# 49. 字母异位词分组

## 题目

> [中文站](https://leetcode-cn.com/problems/group-anagrams/) [国际站](https://leetcode.com/problems/group-anagrams/)

给你一个字符串数组，请你将 **字母异位词** 组合在一起。可以按任意顺序返回结果列表。

**字母异位词** 是由重新排列源单词的字母得到的一个新单词，所有源单词中的字母通常恰好只用一次。



**示例 1:**

```
输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

**示例 2:**

```
输入: strs = [""]
输出: [[""]]
```

**示例 3:**

```
输入: strs = ["a"]
输出: [["a"]]
```

**提示：**

- `1 <= strs.length <= 104`
- `0 <= strs[i].length <= 100`
- `strs[i]`  仅包含小写字母

## 解法

### 哈希表 + 计数 O(n(k + ∣Σ∣))

n 为数组长度，k 为数组中字符串最大长度，∣Σ∣ 为字符集大小；遍历 n 个字符串，每个字符串要遍历 k 个字符统计数量，每个字符串需 ∣Σ∣ 时间生成 key。

遍历源数组，通过哈希表维护各个字母异位词的数组，此时可对每个单词的字母出现次数进行统计，统计结果作为哈希表的键，单词本身作为值，此时字母异位词会被存到同一个数组中；
在遍历完成后，将哈希表中的结果推入结果数组返回。

```typescript
function groupAnagrams(strs: string[]): string[][] {
  const dict: Record<string, string[]> = {};
  for (const s of strs) {
    const arr = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
      arr[s.charCodeAt(i) - "a".charCodeAt(0)]++;
    }
    const key = arr.toString();
    if (!dict[key]) dict[key] = [];
    dict[key].push(s);
  }
  return Object.values(dict);
}
```