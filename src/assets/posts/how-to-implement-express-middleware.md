---
title: "如何实现 Express 中间件"
date: "2021-07-22"
desc: "介绍 Express 中间件的原理，并实现一个简版中间件模块"
---

## 前言

由于最近项目在使用 Nest.js 框架，创建 express 应用，所以对 express 的中间件处理起了点兴趣，所以就开始折腾且记录点东西。

## 功能分析

express 的主要特性是通过设置中间件来处理请求，支持通过不同路由匹配执行的中间件，并且可以通过模板渲染页面。

由于只做中间件分析，所以这篇文章仅关注中间件处理相关的内容，对各种中间件的内部实现不做讨论（如静态资源、模板渲染等）。

如下一个 express 简单的使用例子：

```javascript
var app = express();

app.use(function (req, res, next) {
  console.log(">>> use /");
  next();
});

app.use("/user", function (req, res, next) {
  console.log(">>> use /user");
  next();
});

app.get("/user", function (req, res) {
  console.log(">>> get /user");
  res.json({ path: "/user" });
});

app.post("/user", function (req, res) {
  console.log(">>> post /user");
  res.json({ path: "/user" });
});

app.use(function (req, res, next) {
  console.log(">>> use not found");
  res.end("not found");
});

app.listen(3000, () => {
  console.log("Express started on port 3000");
});
```

## 中间件实现

接下来准备实现一个简单的，仅包含中间件和服务启动的 express，我们称之为 JExpress ，在实现完成后，会用上面的 demo 进行测试。

先将 JExpress 类准备好：

```javascript
// j-express.js
const http = require('http');

class JExpress {
}
```

### 服务启动

此时，JExpress 中没有任何东西，在实现中间件之前，先要将服务跑起来，所以先实现 listen 方法。

- listen 在被调用时，需要启动 httpServer 服务
- 传入 listen 的参数会被透传给 server.listen 方法；

```javascript
// j-express.js
const http = require('http');

class JExpress {
  listen(...args) {
    const server = http.createServer((req, res) => {
      console.log("收到请求：", req.method, req.url);
      res.end("hello world!");
    });

    server.listen(...args);
  }
}

module.exports = () => new JExpress();
```

这样，一个简单的 express 类就实现了，先尝试下简单的调用：

```javascript
// index.js
const jExpress = require('./j-express');

const app = jExpress();

app.listen(3000, () => console.log('listen 3000');
```

通过 node 运行该文件，可以看到控制台中打印出了 listen 3000，说明 httpServer 已经成功启动了。
再简单请求一下这个端口：`curl http://localhost:3000/api`，可以看到控制台中打印出了「收到请求： GET /api」，至此 listen 方法的简单实现就完成了。

### 中间件注册

对开发者来讲，编写的中间件只是一个接收了固定参数的函数，而中间件的使用有下几个步骤：

- 将中间件函数传给 express 的 use、get 、post 方法后，会被注册到中间件数组中
- express 在收到请求后，根据请求 method 和 path 匹配需要被调用的中间件
- 依次执行匹配到的中间件

接下来讲讲中间件的注册流程，也就是实现上面三个方法。

简单看看方法的签名：`app.use([path,] callback[, callback...])`，app.get 和 app.post 类似，不赘述。

可以发现 path 参数是可选的，callback 支持单个函数、多个函数、函数数组的混搭的方式，由于是简单实现，所以我们仅专注于核心流程，仅实现多个函数参数的支持。

由于三个函数的逻辑类似，都是注册中间件，很明显需要抽象一个中间件注册方法，而多个中间件可以放到一个数组中存储，以支持按顺序执行，先把架子搭起来：

```javascript
// j-express.js
class JExpress {
  _middlewares = [];
  _register(method, ...fns) {}

  use(...args) {}
  get(...args) {}
  post(...args) {}

  // ...
}
```

接下来完成注册函数，由于中间件的匹配需要关注请求方法和路径，所以注册方法的实现可以是：

```javascript
// j-express.js
class JExpress {
  _middlewares = [];
  _register(method, ...fns) {
    const path = typeof fns[0] === 'string' && fns[0] ? fns.shift() : '/';
    this._middlewares.push(...fns.map(fn => ({
      method,
      path,
      fn,
    })))
  }

  // ...
}
```

中间件注册函数有了，接下来完善调用注册的方法：

```javascript
// j-express.js
class JExpress {
  // ...
  
  use(...args) {
    this._register('all', ...args);
  }
  get(...args) {
    this._register('get', ...args);
  }
  post(...args) {
    this._register('post', ...args);
  }

  // ...
}
```

至此，我们的中间件就已经注册完成了，多次调用注册方法，会将多个中间件按照调用顺序注册到中间件数组中。

### 中间件匹配执行

接下来需要实现在接收到请求时，匹配对应的中间件列表并按顺序执行的逻辑，由于匹配需要关注请求方法及路径，所以可以将匹配规则抽离成一个方法，接收请求方法和路径，返回匹配到的中间件数组。

```javascript
// j-express.js
class JExpress {
  // ...

  _match(method, path) {
    return this._middlewares.filter(
      (mid) => ["all", method].includes(mid.method) && path.startsWith(mid.path)
    );
  }

  // ...
  
  listen(...args) {
    const server = http.createServer((req, res) => {
      console.log("收到请求：", req.method, req.url);

      const mids = this._match(req.method.toLowerCase(), req.url);
      console.log(mids);
      res.end("hello world!");
    });

    server.listen(...args);
  }
}
```
将 JExpress 引入到文档前面的使用 demo，运行起来，然后访问 `curl http://localhost:3000/user`，可以发现控制台打印了

```bash
收到请求： GET /user
[
  { method: 'all', path: '/', fn: [Function (anonymous)] },
  { method: 'all', path: '/user', fn: [Function (anonymous)] },
  { method: 'get', path: '/user', fn: [Function (anonymous)] },
  { method: 'all', path: '/', fn: [Function (anonymous)] }
]
```

JExpress 已经按照我们期望的规则匹配了要执行的中间件，中间件的匹配就完成了，接下来需要按照 express 的方式按顺序执行中间件：

```javascript
// j-express.js
class JExpress {
  // ...

  _handle(req, res, mids = []) {
    mids.reverse();
    const next = () => {
      const mid = mids.pop();
      mid && mid(req, res, next);
    }
    next();
  }

  // ...
  
  listen(...args) {
    const server = http.createServer((req, res) => {
      console.log("收到请求：", req.method, req.url);
      
      res.json = (data) => {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(data));
      };

      const mids = this._match(req.method.toLowerCase(), req.url);
      this._handle(req, res, mids);
    });

    server.listen(...args);
  }
}
```

上面的代码可以看到，我们去除了 createServer 回调中的 res.end 调用，增加了 _handle 调用，将响应操作交给了中间件处理。
另外，由于 demo 中有 res.json 调用，而 httpServer 中的 res 并没有 json 方法，所以封装一个。
此时再跑一次 demo，会看到控制台的打印：

```bash
listen 3000
收到请求： GET /user
>>> use /
>>> use /user
>>> get /user
```

中间件已经被按注册顺序执行了。

完整代码

```javascript
const http = require("http");

class JExpress {
  _middlewares = [];

  _register(method, ...fns) {
    const path = typeof fns[0] === "string" && fns[0] ? fns.shift() : "/";
    this._middlewares.push(
      ...fns.map((fn) => ({
        method,
        path,
        fn,
      }))
    );
  }

  _match(method, path) {
    return this._middlewares.filter(
      (mid) => ["all", method].includes(mid.method) && path.startsWith(mid.path)
    );
  }

  _handle(req, res, mids = []) {
    mids.reverse();
    const next = () => {
      const mid = mids.pop();
      mid && mid.fn(req, res, next);
    };
    next();
  }

  use(...args) {
    this._register("all", ...args);
  }
  get(...args) {
    this._register("get", ...args);
  }
  post(...args) {
    this._register("post", ...args);
  }

  listen(...args) {
    const server = http.createServer((req, res) => {
      console.log("收到请求：", req.method, req.url);

      res.json = (data) => {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(data));
      };

      const mids = this._match(req.method.toLowerCase(), req.url);
      this._handle(req, res, mids);
    });

    server.listen(...args);
  }
}
```

Express 中间件的部分就简单讲到这，有兴趣的可以看看 [express 源码](https://github.com/expressjs/express) 的实现。