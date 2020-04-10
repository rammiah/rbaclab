'use strict';

const {Wallets, Gateway} = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const {File, Permission} = require('./entity.js');

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
        const permission = new Permission('read-a');
        const file = new File('file-a', permission);
        console.log(JSON.stringify(file));
        const resp = await contract.submitTransaction('addFile', JSON.stringify(file));
        console.log(`add file response : ${resp}`);
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