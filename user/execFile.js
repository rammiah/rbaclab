'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const {Wallets, Gateway} = require('fabric-network');
const path = require('path');

module.exports = execFile;

// export {execFile};

async function execFile(username, filename) {
    const gateway = new Gateway();

    try {
        const wallet = await Wallets.newFileSystemWallet('./wallet');
        const connProfile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../connection-org1.yaml'), 'utf8'));
        const connOpt = {
            identity: username,
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
        const resp = await contract.evaluateTransaction('execFile', filename);
        // console.log(`request file resp: ${resp.toString()}`);
        return resp.toString() === 'true';
    } catch (err) {
        console.log(`request error: ${err.message}`);
        return false;
    } finally {
        gateway.disconnect();
    }
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.log(`2 parameters expected, got ${args.length}`);
        process.exit(1);
    }
    const user = args[0];
    const file = args[1];
    const resp = await execFile(user, file);
    console.log(`request file resp: ${resp.toString()}`);
}

if (process.argv[1] === 'execFile.js') {
    main().then(() => {
        console.log('done');
    }).catch(err => {
        console.log(`request file permission error: ${err.message}`)
        console.log(err.stack);
    });
}
