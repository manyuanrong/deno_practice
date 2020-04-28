import * as Base32 from "https://deno.land/std/encoding/base32.ts";
import { hmac } from "https://raw.githubusercontent.com/chiefbiiko/hmac/master/mod.ts";

export default function (key: string) {
  const counter = Math.floor(Date.now() / 1000 / 30);
  const message = new ArrayBuffer(8);
  const view = new DataView(message);
  view.setBigUint64(0, BigInt(counter), false);
  const messageBytes = new Uint8Array(message);
  const keyBytes = Base32.decode(key);
  
  const hmacResult = hmac("sha1", keyBytes, messageBytes) as Uint8Array;

  // Truncate 截断函数
  const offset: number = hmacResult[19] & 15; // 选取最后一个字节的低字节位4位的整数值作为偏移量

  // 从指定偏移位开始，连续截取 4 个字节（32 位），最后返回 32 位中的后面 31 位
  const cas1: number = hmacResult[offset] & 127;
  const cas2: number = hmacResult[offset + 1] & 255;
  const cas3: number = hmacResult[offset + 2] & 255;
  const cas4: number = hmacResult[offset + 3] & 255;
  const p: number = (cas1 << 24) | (cas2 << 16) | (cas3 << 8) | cas4;
  const result = p % Math.pow(10, 6);

  return `${result}`;
}
