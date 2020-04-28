# deno_practice

DENO 开发实践源码

## twvpn 

调用 AnyConnect 一键连接到 ThoughtWorks VPN 的工具

用户密码和key未上传，需要自己在 twvpn 目录下 建立 `pwd.ts` 内容为

```ts
export const password = "你的登录密码";
export const key = "你的 Auth Key";
```
