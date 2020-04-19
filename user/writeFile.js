'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const {Wallets, Gateway} = require('fabric-network');
const path = require('path');

async function main() {
    const gateway = new Gateway();

    try {
        const args = process.argv.slice(2);
        if (args.length !== 2) {
            console.log(`2 parameters expected, got ${args.length}`);
            process.exit(1);
        }
        const user = args[0];
        const file = args[1];
        const wallet = await Wallets.newFileSystemWallet('./wallet');
        // const label = 'user';
        const connProfile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../connection-org1.yaml'), 'utf8'));
        const connOpt = {
            identity: user,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true},
        };
        // 连接网络
        await gateway.connect(connProfile, connOpt);
        // 获取channel连接
        const channel = await gateway.getNetwork('rbacchannel');
        // 获取合约
        const contract = channel.getContract('rbac', 'org.rammiah.rbac');
        // 执行合约
        const resp = await contract.evaluateTransaction('writeFile', file);
        console.log(`request file resp: ${resp.toString()}`);
    } catch (err) {
        console.log(`request error: ${err.message}`);
    } finally {
        gateway.disconnect();
    }
}


main().then(() => {
    console.log('done');
}).catch(err => {
    console.log(`request file permission error: ${err.message}`)
    console.log(err.stack);
});
