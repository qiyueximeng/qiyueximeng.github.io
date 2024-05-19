---
title: "TypeScript 类型随记"
date: "2020-12-10"
desc: "罗列一些实际场景及接口的类型优化方式"
---

## 接口设计

### 符合 DRY 原则的 TypeScript 接口定义

在实际开发过程中往往存在很多接口或数据类型被重复定义的情况，以下罗列一些实际场景及接口的优化方式：

**1. 多处使用相同的数据结构：**

将该数据结构抽象为接口

```typescript
// bad
function distance(a: { x: number, y: number }, b: { x: number, y: number }) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
// good
interface Point2D {
    x: number;
    y: number;
}
function distance(a: Point2D, b: Point2D) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
```

**2. 函数共享签名类型：**

将函数签名抽象为接口

```typescript
// bad
function get(url: string, opts: Options): Promise<Response> { /* ... */ }
function post(url: string, opts: Options): Promise<Response> { /* ... */ }
// good
interface HTTPFunction {
    (url: string, opts: Options): Promise<Response>;
}
const get: HTTPFunction = (url, opts) => { /* ... */ };
const post: HTTPFunction = (url, opts) => { /* ... */ };
```

**3. 一个接口在另一个接口的基础上多一些字段：**

通过接口继承或交叉类型复用

```typescript
interface Person {
    firstName: string;
    lastName: string;
}
// bad
interface PersonWithBirthData {
    firstName: string;
    lastName: string;
    birth: Date;
}
// good
// 接口继承
interface PersonWithBirthData extends Person {
    birth: Date;
}
// 交叉类型
type PersonWithBirthData = Person & { brith: Date }
```

**4. 一个接口用到另一个接口的部分字段：**

```typescript
interface Person {
    firstName: string;
    lastName: string;
    age: number;
}
// bad
interface PersonWithBirthData {
    firstName: string;
    lastName: string;
    birth: Date;
}
// good
// 引用接口字段
interface PersonWithBirthData {
    firstName: Person['firstName'];
    lastName: Person['lastName'];
    birth: Date;
}
// 映射类型
type PersonWithBirthData = {
    [k in 'firstName' | 'lastName']: Person[k];
}
// 工具类型
type PersonWithBirthData = Pick<Person, 'firstName' | 'lastName'>
```

**5. 为一个初始值对象定义一个匹配的类型：**

使用 typeof 操作符快速定义类型接口

```typescript
const INIT_OPTIONS = {
    width: 640,
    height: 480,
    color: "#00FF00",
    label: "VGA",
};
// bad
interface Options {
    width: number;
    height: number;
    color: string;
    label: string;
}
// good
type Options = typeof INIT_OPTIONS;
```

## 类型

### 操作符

**typeof**

用于获取一个变量声明或对象的类型；

```typescript
function toArray(x: number): number[] {
    return [x];
}
type Func = typeof toArray; // (x: number) => number[]
```

**keyof**

用于获取类型对象中的所有 key 值；

```typescript
interface Person {
    name: string;
    age: number;
}
type K1 = keyof Person; // "name" | "age"
type K2 = keyof { [x: string]: Person }; // string | number
```

**in**

用于遍历枚举类型；

```typescript
type Keys = "a" | "b" | "c";
type Obj = {
    [p in Keys]: any
} // { a: any, b: any, c: any }
```

**infer**

在条件语句中，用于声明一个类型变量并对它进行使用；

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

**extends**

定义一个类型扩展至另一个类型，也可用作条件判断。

```typescript
interface Name {
    name: string;
}
interface Person extends Name {
    age: number;
} // Person 类型在 Name 类型基础上扩展了字段，同时有 name、age 两个字段

let goodName: Name = { name: 'davi', isGood: true }; // 成立，类型匹配支持「鸭子模型」
```


若 `A` 类型可赋值给 `B` 类型，就可以说 `A extends B`，如：

- `Person extends Named`
- `{ name: string; location: string } extends { name: string }`
- `() => {name: string; location: string} extends () => {name: string}`
- `({ name: string }) => string extends ({ name: string; location: string }) => string`
- `A extends A | B`

### 内置工具类型

**Partial<T>**

生成基于指定类型的新类型，每个属性都变成可选项；

```typescript
type Partial<T> = { [k in keyof T]?: T[k] };
```

**Required<T>**

生成基于指定类型的新类型，每个属性都变成必选项；

```typescript
type Required<T> = { [k in keyof T]-?: T[k] };
```

**Readonly<T>**

生成基于指定类型的新类型，每个属性都变成只读属性；

```typescript
type Readonly<T> = { readonly [k in keyof T]: T[k] };
```

若将 readonly 改为 -readonly 则是移除子属性的 readonly 标识；

**Record<K, T>**

生成基于 K 类型的新类型，每个属性都重新指定为 T 类型；

```typescript
type Record<K extends keyof any, T> = { [P in K]: T };
```

**Pick<T, K extends T>**

生成包含指定类型的部分属性的子类型；

```typescript
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

**Exclude<T, U>**

生成基于 T 类型的子类型，其中 U 类型包含的属性会被移除掉，T extends U 时返回 never；

```typescript
type Exclude<T, U> = T extends U ? never : T;
```

**Extract<T, U>**

生成基于 T 类型的子类型，其属性指包含 T 和 U 中共有的属性；

```typescript
type Extract<T, U> = T extends U ? T : never;
```

**Omit<T, K extends keyof any>**

使用 T 类型中除了 K 类型的所有属性，构造一个新类型；

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

**NonNullable<T>**

过滤类型 T 中的 null 及 undefined 类型，返回新生成的类型；

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
```

**ReturnType<T extends (...args: any) => any>**

获取函数 T 的返回类型；

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

**InstanceType<T extends new (...args: any) => any>**

获取构造函数类型的实例类型；

```typescript
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;
```

**ThisType<T>**

用于指定上下文对象的类型；

```typescript
interface ThisType<T> { }
// 示例
interface Person {
    name: string;
    age: number;
}
const obj: ThisType<Person> = {
    dosth() {
        this.name // string
    }
}
```

**Parameters<T>**

用于获得函数的参数类型组成的元组类型；

```typescript
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

**ConstructorParameters<T>**

用于提取构造函数类型的所有参数的元组类型；

```typescript
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;
```
