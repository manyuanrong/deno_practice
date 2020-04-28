import { password, key } from "./pwd.ts";
import totp from "./totp.ts";

const config = {
  username: "yuanrong.man@thoughtworks.com",
  authMethodIndex: 4,
  password,
  key,
};

async function connect() {
  const cmd = Deno.run({
    cmd: [
      "/opt/cisco/anyconnect/bin/vpn",
      "-s",
      "connect",
      "xdc.vpn.thoughtworks.com",
    ],
    stdin: "piped",
    stdout: "inherit",
  });

  const encoder = new TextEncoder();
  const { username, password, authMethodIndex } = config;

  const code = totp(config.key);

  console.log("======================");
  console.log("Auth Code", code);
  console.log("======================");

  const input = encoder.encode(
    `${username}\n${password}\n${authMethodIndex}\n${code}`
  );

  await cmd.stdin!.write(input);
}

async function close() {
  const cmd = Deno.run({
    cmd: ["/opt/cisco/anyconnect/bin/vpn", "disconnect"],
    stdin: "inherit",
    stdout: "inherit",
  });
  await cmd.status();
}

// 获取参数
const [command] = Deno.args;

switch (command) {
  case "close":
    await close();
    break;

  default:
    await connect();
}
