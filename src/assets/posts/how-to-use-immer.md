---
title: "如何使用 immer"
date: "2021-01-27"
desc: "简单介绍 immer 的使用及优点"
---

immer 是 mobx 的作者在 immutable 方面做的新的尝试，核心实现是利用 ES6 的 proxy，以几乎最小的成本实现了 js 的不可变数据结构。

## 入门

### 1、用操作可变数据的方式实现不可变数据操作 

基于 copy-on-write 机制，可以通过简单地修改数据来与数据进行交互，同时保持不可变数据的好处。
涉及的基本概念如下：

- currentState：原始对象。
- draftState：代理 currentState 的草稿对象，用于修改属性，不影响 currentState 对象。
- nextState：根据修改完成的 draftState 产生的新对象。
  - 在结构上共享了未修改的内容。
  - 跟 currentState 相比修改的部分会被冻结（内部使用 Object.freeze ），直接修改会报错。
- produce：生产函数，用来生成 nextState 或 producer 的函数。
- producer：通过柯里化调用 produce 生成，固化了 recipe 的生产者，每次调用执行相同的操作生成 nextState。
- recipe：生产机器，传递给 produce 的回调函数，用于操作 draftState。
  - 无返回值，nextState 根据 draftState 生成。
  - 有返回值，nextState 根据返回值生成。

![how_to_use_immer_1](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/how_to_use_immer_1.png)

### 2、基础使用

语法：

`produce(currentState, recipe: (draftState) => void | draftState): nextState`

```javascript
import produce from "immer";

const baseState = [
    {
        todo: "Learn typescript",
        done: true
    },
    {
        todo: "Try immer",
        done: false
    }
];

const nextState = produce(baseState, draftState => {
    draftState.push({todo: "Tweet about it", done: false})
    draftState[1].done = true
});
```

```javascript
// 新值只在 nextState 中添加，baseState 并未修改
expect(baseState.length).toBe(2)
expect(nextState.length).toBe(3)
// 「done」属性修改也只在 nextState
expect(baseState[1].done).toBe(false)
expect(nextState[1].done).toBe(true)
// 未修改的数据被共享
expect(nextState[0]).toBe(baseState[0])
expect(nextState[1]).not.toBe(baseState[1])
```

![how_to_use_immer_2](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/how_to_use_immer_2.png)

### 3、柯里化使用

利用高阶函数的特点，生成一个 producer。

语法：

`produce(recipe: (draftState) => void | draftState)(currentState): nextState`

柯里化？固化参数？预绑定生成器

```javascript
const currentState = { x: 0, y: 0 };

// producer 的签名为 (state, index) => state
const producer = produce((draft, val) => {
    draft.x = val
});

const nextState = producer(currentState, 1);
// { x: 1, y: 0 }
```

柯里化产生一个预绑定操作的生成器，后续使用仅需传递初始状态即可获得修改后的状态，提高了复用性。

### 4、时间旅行

```javascript
const { applyPatches, enablePatches, produceWithPatches } = require("immer");

enablePatches();

let state = { x: 1 };
let historyList = [];
let p = -1;

const producer = produceWithPatches((draftState, action) => {
  draftState[action.key] = action.value;
});

// mode: redo/undo/cancelUndo
function dispatch({ action, mode = "redo" }) {
  if (mode === "redo") {
    const [newState, patches, inversePatches] = producer(state, action);
    state = newState;
    p++;
    // 若有回退过的历史记录，则抹去
    if (p < historyList.length) {
      historyList.length = p;
    }
    historyList.push({ patches, inversePatches });
  } else if (mode === "undo" && p >= 0) {
    state = applyPatches(state, historyList[p--].inversePatches);
  } else if (mode === "cancelUndo" && p < historyList.length - 1) {
    state = applyPatches(state, historyList[++p].patches);
  }
} 

console.log("init state: ", state); // { x: 1 }

dispatch({ action: { key: "x", value: 2 } });
console.log("x = 2", state); // { x: 2 }

dispatch({ action: { key: "y", value: 1 } });
console.log("y = 1", state); // { x: 2, y: 1 }

dispatch({ action: { key: "x", value: -1 } });
console.log("x = -1", state); // { x: -1, y: 1 }

dispatch({ mode: "undo" });
console.log("command + z", state); // { x: 2, y: 1 }

dispatch({ mode: "undo" });
console.log("command + z", state); // { x: 2 }

dispatch({ mode: "cancelUndo" });
console.log("command + shift + z", state); // { x: 2, y: 1 }

dispatch({ action: { key: "y", value: 2 } });
console.log("y = 2", state); // { x: 2, y: 2 }
```

通过维护每次 state 更改产生的 patches，以及一个指针，实现保存历史记录的功能。

### 5、在 React setState 中使用

对于深层对象 state 更新的优化。

```javascript
const demo = () => {
    const [state, setState] = useState({
        members: [
            {
                name: '路人甲',
                age: 12
            },
            {
                name: '路人乙',
                age: 15
            }
        ]
    });
    
    const addFirstAge = useCallback(() => {
        // 正常写法
        setState(({ members }) => ({
            members: [
                {
                    ...members[0],
                    age: members[0] + 1
                },
                ...members.slice(1)
            ]
        })); 

        // immer 写法
        setState(produce(draft => {
            draft.members[0].age++;
        }));
    }, [state])
    
    
    return <Button onClick={addFirstAge}>add first man age</Button>
}
```

### 6、简化 reducer

```javascript
import produce from "immer";

// 假设 state 结构
const initState = {
    fetching: false,
    list: [],
    pagination: {
        page: 1, 
        pageSize: 10,
        total: 0
    }
};

// 正常 reducer
const byId = (state = initState, action) => {
    switch (action.type) {
        case ADD_NEXT_PAGE:
            return {
                ...state,
                fetching: false,
                list: [ ...state.list, action.list]
                pagination: action.pagination
            }
        default:
            return state
    }
}

// 普通方式使用 immer
const byId = (state = initState, action) => produce(state, draft => {
    switch (action.type) {
        case ADD_NEXT_PAGE:
            draft.fetching = false;
            draft.list.push(...action.list);
            draft.pagination = action.pagination;
    }
});

// 柯里化方式使用 immer
const byId = produce((draft, action) => {
    // ...
}, initState);
```

[immer 的不可变性原理](https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3)

[immer.js 简介及源码简析](https://zhangzhao.name/posts/immer-immutable/)

### [ImmutableJS](https://github.com/immutable-js/immutable-js)

ImmutableJS 也是一个不错的不可变数据结构库，但跟 Immer 相比有两方面的不足：

- 它通过自己的数据结构实现不可变数据，对使用者有较高的使用成本，Immer 提供使用原生对象的操作方式，更简单、易用。
- 操作结果需要通过 toJS 方法产生原生对象，除了在性能方面比较不足外，要时刻注意操作的对象是否原生，避免意外 BUG。

## 优点

提几个较明显的：

- 在 JavaScript 原生数据结构基础上实现了 immutable，没有学习成本。
- 简单的使用方式，让开发人员避免大多数的对象创建和解构操作。
- 可让 Redux Reducers、React State 及其他需要数据不可变的场景相关代码更加简洁清晰，提高可读性和可维护性。
- 会自动冻结修改后的状态数，以避免开发人员误修改，这是 immutable 的最佳实践。

[官方文档对性能解释](https://immerjs.github.io/immer/docs/performance)

## 性能

>实际上，Immer 有时比手写的 reducer 要快得多。因为 immer 会检测「no-op」状态变更，如果没有任何实际变化，则返回原始状态，这可以避免大量的重渲染。所以只需使用 immer 就能解决关键的性能问题。

借用一张官方图

![how_to_use_immer_3](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/how_to_use_immer_3.png)
