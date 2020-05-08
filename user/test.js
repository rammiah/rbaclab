'use strict';

const assert = require('assert');

const readFile = require('./readFile.js');
const writeFile = require('./writeFile.js');
const execFile = require('./execFile.js');

// 根据论文5.2.3中得出的结果表
const ExpectedUserToFile = [
    ["rwx", "ooo", "ooo", "roo", "ooo"],
    ["ooo", "rwx", "ooo", "ooo", "owo"],
    ["ooo", "ooo", "rwx", "ooo", "ooo"],
    ["roo", "owo", "rwx", "roo", "owo"],
    ["rwx", "roo", "owo", "roo", "ooo"],
];

const Users = ["user1", "user2", "user3", "user4", "user5"];
const Files = ["file-a", "file-b", "file-c", "file-d", "file-e"];

async function testUserFile(username, filename) {
    const read = await readFile(username, filename) ? "r" : "o";
    const write = await writeFile(username, filename) ? "w" : "o";
    const exec = await execFile(username, filename) ? "x" : "o";
    return read + write + exec;
}

async function testUser(username) {
    return await Promise.all(Files.map(file => testUserFile(username, file)));
}

async function main() {
    // 实际运行得出的结果表
    const result = await Promise.all(Users.map(user => testUser(user)));
    // console.log(result);
    // 两者必须相等
    assert.deepStrictEqual(ExpectedUserToFile, result);
}

main().then(()=> {
    console.log('done');
}).catch(err => {
    console.log(err.stack);
});