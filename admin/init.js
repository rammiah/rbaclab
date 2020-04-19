'use strict';

const {Wallets, Gateway} = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
// const {File} = require('./entity.js');

async function addFile(file, connArgs) {
    const gateway = new Gateway();
    try {
        // console.log('connect to the gateway');
        await gateway.connect(...connArgs);
        const channel = await gateway.getNetwork('rbacchannel');
        const contract = channel.getContract('rbac', 'org.rammiah.rbac');
        await contract.submitTransaction('addFile', JSON.stringify(file));
    } catch (err) {
        console.log(`addFile error: ${err.message}`)
    } finally {
        gateway.disconnect();
    }
}

async function addFiles(files, connArgs) {
    try {
        const ps = files.map(file => addFile(file, connArgs));
        await Promise.all(ps);
    } catch (err) {
        console.log(`addFiles error: ${err.message}`);
    }
}

async function addPermission(permission, connArgs) {
    const gateway = new Gateway();
    try {
        // console.log('connect to the gateway');
        await gateway.connect(...connArgs);
        const channel = await gateway.getNetwork('rbacchannel');
        const contract = channel.getContract('rbac', 'org.rammiah.rbac');
        await contract.submitTransaction('addPermission', JSON.stringify(permission));
    } catch (err) {
        console.log(`addPermission error: ${err.message}`)
    } finally {
        gateway.disconnect();
    }
}

async function addPermissions(permissions, connArgs) {
    try {
        const ps = permissions.map(permission => addPermission(permission, connArgs));
        await Promise.all(ps);
    } catch (err) {
        console.log(`addPermissions error: ${err.message}`);
    }
}

async function addRole(role, connArgs) {
    const gateway = new Gateway();
    try {
        // console.log('connect to the gateway');
        await gateway.connect(...connArgs);
        const channel = await gateway.getNetwork('rbacchannel');
        const contract = channel.getContract('rbac', 'org.rammiah.rbac');
        await contract.submitTransaction('addRole', JSON.stringify(role));
    } catch (err) {
        console.log(`addRole error: ${err.message}`)
    } finally {
        gateway.disconnect();
    }
}

async function addRoles(roles, connArgs) { 
    try {
        const ps = roles.map(role => addRole(role, connArgs));
        await Promise.all(ps);
    } catch (err) {
        console.log(`addRoles error: ${err.message}`);
    }
}

async function addUser(user, connArgs) {
    const gateway = new Gateway();
    try {
        // console.log('connect to the gateway');
        await gateway.connect(...connArgs);
        const channel = await gateway.getNetwork('rbacchannel');
        const contract = channel.getContract('rbac', 'org.rammiah.rbac');
        await contract.submitTransaction('addUser', JSON.stringify(user));
    } catch (err) {
        console.log(`addUser error: ${err.message}`)
    } finally {
        gateway.disconnect();
    }
}

async function addUsers(users, connArgs) {
    try {
        const ps = users.map(user => addUser(user, connArgs));
        await Promise.all(ps);
    } catch (err) {
        console.log(`addUsers error: ${err.message}`);
    }
}

async function main() {
    // const gateway = new Gateway();
    try {
        const wallet = await Wallets.newFileSystemWallet('./wallet');
        const label = 'admin';
        const connProfile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../connection-org1.yaml'), 'utf8'));
        const connOpt = {
            identity: label,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true},
        };
        const js = JSON.parse(fs.readFileSync('./rbac.json', 'utf8'));
        // console.log(JSON.stringify(js, null, 2));
        const connArgs = [connProfile, connOpt];
        await Promise.all([addFiles(js['files'],connArgs), addPermissions(js['permissions'], connArgs),
                      addRoles(js['roles'], connArgs), addUsers(js['users'], connArgs)]);
    } catch (err) {
        console.log(`Init system error: ${err}`)
    }
}

main().then(() => {
    console.log('done');
}).catch(err => {
    console.log(err);
    console.log(e.stack);
});