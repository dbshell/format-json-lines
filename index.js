#! /user/bin/env node

const readline = require("readline");
const fs = require("fs");

const logs = [];

async function processFile(file) {
  return new Promise((resolve, reject) => {
    const reader = readline.createInterface({
      input: fs.createReadStream(file),
      // output: process.stdout,
      console: false,
    });

    reader.on("line", function (line) {
      try {
        const json = JSON.parse(line);
        logs.push(json);
      } catch (e) {}

      // const { time, msg } = json;
      // console.log(time, msg);
    });

    reader.on("close", function () {
      resolve();
    });
  });
}

async function readAll() {
  const list = [];
  for (let i = 2; i < process.argv.length; i += 1) {
    list.push(processFile(process.argv[i]));
  }
  return Promise.all(list);
}

async function run() {
  await readAll();
  const logsFiltered = logs.filter((x) => x.time && x.msg);
  logsFiltered.sort((a, b) => {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });
  for (const log of logsFiltered) {
    const { time, msg } = log;
    console.log(time, msg);
  }
}

run();
