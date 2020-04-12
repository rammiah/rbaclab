'use strict';

const {Wallets, Gateway} = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const {File} = require('./entity.js');

async function addFiles(contract, files) {
    try {
        // console.log(JSON.stringify(files));
        for (let file of files) {
            console.log(JSON.stringify(file))
            await contract.submitTransaction('addFile', JSON.stringify(file));
        }
    } catch (err) {
        console.log(`addFiles error: ${err.message}`);
    }
}

async function addPermissions(contract, permissions) {
    for (let permission of permissions) {
        await contract.submitTransaction('addPermission', JSON.stringify(permission));
    }
}

async function addRoles(contract, roles) { 
    for (let role of roles) {
        await contract.submitTransaction('addRole', JSON.stringify(role));
    }

}

async function addUsers(contract, users) {
    for (let user of users) {
        await contract.submitTransaction('addUser', JSON.stringify(user));
    }
}

async function main() {
    const gateway = new Gateway();
    try {
        const wallet = await Wallets.newFileSystemWallet('./wallet');
        const label = 'admin';
        const connProfile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../connection-org1.yaml'), 'utf8'));
        const connOpt = {
            identity: label,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true},
        };
        console.log('connect to the gateway');
        await gateway.connect(connProfile, connOpt);
        const channel = await gateway.getNetwork('rbacchannel');
        const contract = channel.getContract('rbac', 'org.rammiah.rbac');

        console.log('add file');
        const file = new File('file-a', 'permission-a');
        console.log(JSON.stringify(file));
        const resp = await contract.submitTransaction('addFile', JSON.stringify(file));
        console.log(`add file response: ${resp}`);
        // const js = JSON.parse(fs.readFileSync('./rbac.json', 'utf8'));
        // console.log(JSON.stringify(js, null, 2));
        // await addFiles(contract, js['files']);
        // await addPermissions(contract, js['permissions']);
        // await addRoles(contract, js["roles"]);
        // await addUsers(contract, js["users"]);
    } catch (err) {
        console.log(`add file error: ${err}`)
    } finally {
        gateway.disconnect();
    }
}

main().then(() => {
    console.log('done');
}).catch(err => {
    console.log(err);
    console.log(e.stack);
});