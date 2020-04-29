# deno_practice

DENO 开发实践源码

## twvpn

调用 AnyConnect 一键连接到 ThoughtWorks VPN 的工具

用户密码和 key 未上传，需要自己在 twvpn 目录下 建立 `pwd.ts` 内容为

```ts
export const password = "你的登录密码";
export const key = "你的 Auth Key";
```

## todo-api

使用 Deno 开发的 API Server
数据库使用 MongoDB

## todo-web

TodoList 前端项目
