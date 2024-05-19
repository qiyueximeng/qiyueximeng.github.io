---
title: "JavaScript Sandbox"
date: "2022-04-27"
desc: "简单梳理了下 JS 沙盒的概念、场景和几种实现"
---

## 概念

沙箱可以理解为一个受限的运行环境，在内部的所有操作都不会影响外部。JS 沙箱即运行 JS 脚本的一个受限环境，内部 JS 脚本的运行是隔离的，不会影响到外部环境的。

## 应用场景

- 解析/执行不可信 JS。（自定义脚本，在线 IDE）
- 隔离被执行代码的执行环境。（jsonp）
- 限制代码可访问对象。（vue 模板表达式）

## 实现

### with + new Function

**eval(str):**

若 `str` 表示的是表达式，`eval` 会对表达式进行求值，若是 `JavaScript` 语句，则会执行这些语句。
直接通过 `eval` 执行代码，代码可沿着作用域链网上找，篡改全局变量。

![js_sandbox_with_function_1](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/js_sandbox_with_function_1.png)

所以需要让沙箱内代码的外部变量访问都在你的监控范围内。

**Function:**

`Function` 构造器是 `eval` 的替代方案，它和 `eval` 主要有两点区别：

- 对传入代码在函数创建时解析，返回的函数被调用时会直接运行代码，不会再解析。
- 不能访问本地闭包变量，但仍然可以访问全局变量。

相比 `eval`，其性能和安全性都更好，但还需屏蔽其对全局作用域的访问。

**with 关键字:**

with 允许一个半沙箱的环境，其声明为一个语句拓展了作用域链。
with 代码块中的代码会先试图从传入的对象中获取变量，未找到再去闭包和全局作用域中查找，闭包通过 Function 构造函数屏蔽了，所以只需要控制全局作用域的访问。
可通过 with + Function + Proxy，暴露可以被访问的变量 exposeObj，并阻断代码对外部的访问：

![js_sandbox_with_function_2](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/js_sandbox_with_function_2.png)

通过 Proxy 的 has 方法监听变量访问，暴露指定的外部变量供代码访问，非指定变量抛出 error。

**新的问题:** 

以上的一切看起来似乎没问题，但是，问题出现在传入的对象上，因为传入的对象中的变量是可访问的，所以 has 方法是无法监听到可访问变量上的属性的。
假设执行的代码时不可信的，只需通过可访问的变量，轻松地访问到 Object 构造函数的原型对象，进行篡改即可影响到外部代码逻辑。

![js_sandbox_with_function_3](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/js_sandbox_with_function_3.png)

- 通过访问原型链的方式实现了沙箱逃逸
- 通过访问箭头函数的 constructor，绕过作用域链查找，从而拿到 Function，此时 Function 内执行的代码将在全局作用域下执行，不再查找作用域链
- 通过篡改原型链上的方法实现 xss 攻击

由上可见，new Function + with + Proxy 的沙箱方式，防君子不防小人。
即使你对传入的代码做全量分析、过滤，对未按照规定数据格式的代码直接抛出错误，以阻止恶意代码的注入，但这始终不是一种安全的做法，而且**成本太高！**

对于有兴趣继续了解的同学，这里有个库是用该方式实现沙箱的 [nx-js/compiler-util](https://github.com/nx-js/compiler-util/blob/master/README.md)

### iframe

`Iframe` 是目前前端最常见的沙箱方式，且更为方便、简单、安全，参照：https://codesandbox.io/s/news；

`sandbox` 是 `H5` 提出的新属性：`<iframe sandbox src="..."></iframe>`。

加上这个属性后的 iframe：
- 不能运行 script 脚本
- 不能发送 ajax 请求
- 不能使用本地存储：localStorage、cookie 等
- 不能创建弹窗和 window
- 不能发送表单
- 不能加载额外插件
- ...

```html
// index.html
<iframe
  sandbox=""
  src="http://localhost:8080/frame.html"
  frameborder="0"
></iframe>

// frame.html
<script>
  console.log("iframe is running!");
</script>
```

![js_sandbox_iframe_1](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/js_sandbox_iframe_1.png)

可以看到，`iframe` 的行为被严格的限制了.不过，可以根据自己的业务需求，配置允许的权限。
具体配置参照 `iframe MDN`，此处根据我们的业务简单看几个属性：
- `allow-scripts`：允许嵌入的文档运行脚本，但不能创建弹窗.

```html
// index.html
<iframe
  sandbox="allow-scripts"
  src="http://localhost:8080/frame.html"
  frameborder="0"
></iframe>

// frame.html
<script>
  console.log("iframe is running!");
</script>
```

![js_sandbox_iframe_2](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/js_sandbox_iframe_2.png)

- allow-same-origin：允许脚本发起同源请求，若无该关键字，文档会被视为独立源，无法发起 ajax 请求。

```html
// index.html
<iframe
  sandbox="allow-scripts"
  src="http://localhost:8080/frame.html"
  frameborder="0"
></iframe>

// frame.html
<script>
  console.log("iframe is running!");
  fetch("http://localhost:8080/data.json")
    .then((res) => res.json())
    .then((data) => console.log(data));
</script>
```

![js_sandbox_iframe_3](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/js_sandbox_iframe_3.png)

在加完 `allow-same-origin` 属性之后：

![js_sandbox_iframe_4](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/js_sandbox_iframe_4.png)

> note: 当嵌入的文档与主页面同源是，强烈不建议使用以上两个属性，否则嵌入文档可通过代码删除 sandbox 属性

```html
<script>
  console.log("iframe is running!");
  fetch("http://localhost:8080/data.json")
    .then((res) => res.json())
    .then((data) => console.log(data));

  const parentWindow = window.parent;
  const frame = parentWindow.frames[0];
  const frameElm = parentWindow.document.getElementsByTagName("iframe")[0];
  console.log(frame === window);
  frameElm.removeAttribute("sandbox");
  console.log(frameElm);
</script>
```

![js_sandbox_iframe_5](https://youyas-cos-1254423828.cos.ap-guangzhou.myqcloud.com/images/js_sandbox_iframe_5.png)

所以建议把这种内容放置到独立的专用域中！

在做好沙箱限制后，可以结合 `postMessage API`，与 `iframe` 进行通信，传递需要交互的数据。

此处有几点需要注意：
- 不要让执行代码访问到父页面的 `contentWindow` 对象，否则其相当于拿到了父页面的控制权。
- 由于需要通过 `postMessage API` 进行通信，所以需要设置 `allow-same-origin`，意味着子页面可以发起同域请求，此时需要注意防范 `CSRF`。

### node.js sandbox

在 `node.js` 中，`vm` 模块可以 `V8` 虚拟机上下文中编译和运行代码，可以利用 `vm` 模块，快速创建沙箱：

```javascript
const vm = require("vm");
const x = 1;
const sandbox = { x: 2 };
vm.createContext(sandbox); // 上下文隔离化对象

const code = "x += 40; var y = 17;"; // x 和 y 是上下文中的全局变量
vm.runInContext(code, sandbox);
console.log(sandbox.x); // 42
console.log(sandbox.y); // 17
console.log(x); // 1, y 没有定义
```

通过上下文隔离化来提供上下文，被调用的代码将上下文中的任何属性都视为全局变量，如上面的 x、y，被调用代码引起的全局变量的更改都将反映在上下文对象中。

- `createContext([obj[, opt]])`：为给定对象 `obj` 设置沙盒，使其可被 `runInContext` 执行，且在执行的脚本中，该对象为全局对象。
  - 除了 `obj` 的属性外，全局对象还具有标准全局对象的内置对象和函数，比如我们常用的 `Math`、`Array`等
  - 主要用于创建能运行多个脚本的上下文，比如模拟网页浏览器窗口
- `runInContext(code, contextifiexObject[, opt])`：该方法会编译 `code`，并在执行的隔离化上下文对象中执行 `code`，然后返回其结果，被执行的代码无法获取本地作用域。

> note: `vm` 模块不是安全机制，不要使用他它来运行不受信任的代码！

以上是 `node.js` 文档的警告，那么，`vm` 模块为什么不安全呢？

接着上面的例子，比如我们可以顺着原型链往上找到 `Function`，然后做一些影响主进程的事：

```javascript
// ...省略前面代码
// 因标准全局对象中不包含 process，所以以下代码 process 未定义
vm.runInContext("process.exit(1)", sandbox);
// 通过原型链实现沙箱逃逸，访问到外部的 Function，此时 Function 内部代码时在外部全局作用域下运行的
vm.runInContext(
  "this.constructor.constructor('return process')().exit(1)",
  sandbox
); // 终止主进程运行
```

对以上问题的解决方案是：切断原型链，同时对传入的暴露对象，只提供基本类型值（ nodejs 中对象没有进行结构化复制，原型链依然保留）

```javascript
const ctx = Object.create(null);
ctx.x = 1; // ctx 上不包含引用类型的属性
vm.createContext(ctx);
vm.runInContext(
  "this.constructor.constructor('return process')().exit(1)",
  ctx
);
```

此时内部通过 this.constructor.constructor 拿到的只是内部全局对象的构造函数，无法实现沙箱逃逸。

即使如此，也不能保证绝对安全，可能还有潜在的沙箱漏洞呢？毕竟：
> note: `vm` 模块不是安全机制，不要使用他它来运行不受信任的代码！

### WebAssembly sandbox

由于 `WebAssembly` 运行在一个安全的沙箱执行环境中，若使用 `WebAssembly` 编译器而不是普通编译器编译不安全的代码，是否可以实现一个足够安全的沙箱环境？

此处附上一个参考文章 [wasmboxc](https://kripken.github.io/blog/wasm/2020/07/27/wasmboxc.html)
