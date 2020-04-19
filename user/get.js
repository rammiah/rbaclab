'use strict';

const {Wallets, Gateway} = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

async function main() {
    const gateway = new Gateway();

    try {
        const args = process.argv.slice(2);
        const validActions = ['getUser', 'getFile', 'getRole', 'getPermission'];
        if (validActions.indexOf(args[0]) === -1) {
            console.log(`不支持的操作：${args[0]}`);
            process.exit(1);
        }
        // console.log(args.slice(2));
        const wallet = await Wallets.newFileSystemWallet('./wallet');
        const label = args[1];
        const connProfile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../connection-org1.yaml'), 'utf8'));
        const connOpt = {
            identity: label,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true},
        };
        await gateway.connect(connProfile, connOpt);
        const channel = await gateway.getNetwork('rbacchannel');
        const contract = channel.getContract('rbac', 'org.rammiah.rbac');
        
        const resp = await contract.evaluateTransaction(args[0], args[2]);
        console.log(`${args[0]} respose: ${resp.toString()}`);
    } catch (err) {
        console.log(`get error: ${err.message}`);
    } finally {
        gateway.disconnect();
    }
}

main().then(() => {
    console.log('done');
}).catch(err => {
    console.log(`get error: ${err.message}`);
    console.log(err.stack);
});
