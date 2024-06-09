在做 node 开发过程中，知道 koa 中间件是洋葱模型，不过对其执行的细节原理产生了兴趣，所以进行了解和记录。

## 洋葱模型

要理解 koa 中间件，就要了解其洋葱模型的表现：

```javascript
const Koa = require("koa");
const app = new Koa();

app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(2);
});

app.use(async (ctx, next) => {
  console.log(3);
  await next();
  console.log(4);
});

app.use(async (ctx, next) => {
  console.log(5);
  await next();
  console.log(6);
});

app.listen(3000);

// 1
// 3
// 5
// 6
// 4
// 2
```

由上面的输出顺序，我们可以知道：

- 中间件函数的执行是像栈一样，先进后出的
- 中间件的 next 函数会调用下一个中间件函数入栈
- next 返回一个 promise

知道了洋葱模型的表现后，我们可以根据 koa 的源码，对其中间件的实现做一个简单分析，并摘录部分源码形成一个简版 koa。

## 服务启动

跟 express 类似，koa 的服务启动也是封装 http.createServer 和 server.listen。

```javascript
// j-koa.js
const http = require('http');
const compose = require('koa-compose');
const Emitter = require('events');
const context = require('./context');
const request = require('./request'); 
const response = require('./response');

module.exports = class Application extends Emitter {
  constructor(options) {
    super();
    // ...
    this.middleware = [];
    this.context = Object.create('context'); 
    this.request = Object.create('request'); 
    this.response = Object.create('response');
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
  
  callback() {
    // 合并中间件
    const fn = compose(this.middleware);
    // 生成请求处理函数
    const handleRequest = (req, res) => {
      // 生成上下文对象
      const ctx = this.createContext(req, res);
      // 处理请求
      return this.handleRequest(ctx, fn)
    }
    return handleRequest;
  }
  
  createContext(req, res) {
    const context = Object.create(this.context);
    // ...
    return context;
  }
  
  handleRequest(ctx, fnMiddleware) {
    // ...
    return fnMiddleware(ctx).then(...).catch(...);
  }
}
```

由于只分析中间件的实现，所以先不关注 context、request、response 模块。

callback 函数先通过 compose 函数聚合中间件，产生一个中间件执行函数，并构造一个处理请求的函数用于传入 http.createServer，在 http 服务接收到请求时，使用 req 和 res 构造上下文对象，并将上下文对象及中间件执行函数传入请求处理函数。

由于是分析中间件模块，所以此处忽略一些不太重要的细节，将重点放在 compose 函数及其返回的 fnMiddleware 函数上，compose 函数将中间件数组经过一些处理后返回一个可执行函数，该函数在被执行时会按照洋葱模型顺序执行中间件，保证 ctx 的传输以及 next 逻辑；

至此，服务启动相关逻辑就有了，接下来关注中间件相关逻辑。

## 中间件注册

koa 通过 use 方法注册中间件，use 方法内部对传入的函数做一个简单的判断后将其塞入中间件数组，所以可以简单将 use 方法理解为：

```javascript
// ...
module.exports = class Application extends Emitter {
  // ...
  use(fn) {
    // ...
    this.middleware.push(fn);
    return this;
  }
  // ...
}
```

## 中间件聚合

在服务启动之前，中间件已经通过 use 方法添加到 middleware 数组中了，在执行 listen 方法的时候，会通过 compose 函数对中间件数组进行聚合，并产生中间件执行函数，接下来简单看看 compose 的实现。

compose 来自一个叫 koa-compose 的 npm 库，里面只有一个简单的 js 文件，对函数进行了声明：

```javascript
function compose (middleware) {
  // ... 省略数组校验逻辑
  return function (context, next) {
    let index = -1;
    return dispatch(0);
    
    function dispatch (i) {
      // 防止同一个 next 被多次调用
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      // 在中间件数组执行完后，可指定下一个执行的中间件函数（可多次聚合）
      if (i === middleware.length) fn = next;
      // 执行到最后一个中间件后，开始 resolve
      if (!fn) return Promise.resolve();
      try {
        // 执行当前中间件，并将 next 的执行绑定到下一个中间件
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
  }
}
```

由上面的函数可知，我们在执行完 compose 后，会拿到一个可按洋葱模型执行传入的中间件数组的函数。

## 中间件执行

在上面已经得到了中间件执行函数了，那么中间件的执行就非常的简单了，我们上面提到，callback 方法会返回一个函数传给 http.createServer 方法用于处理请求，http 服务接收到每个请求都会调用这个函数，而该函数则会对每个请求构建 ctx，将 ctx 和中间件执行函数都传给 handleRequest 方法执行：

```javascript
// ...
module.exports = class Application extends Emitter {
  // ...
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
  // ...
}

function respond(ctx) {
// ... 省略各种校验逻辑
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' === typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);
  
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```

由上面的代码可以看出，handleRequest 方法对每个请求，将 ctx 传入中间件执行函数，在所有中间件执行完之后，调用 respond 函数处理响应。

而 respond 函数中，则是对 res.body 的各种格式进行判断，并做不同的响应处理。

好了，koa 中间件简单讲到这里，如果对 koa 其他部分源码有兴趣的可以自行去看。