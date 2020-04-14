'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const {Wallets, Gateway} = require('fabric-network');
const path = require('path');

async function main() {
    const gateway = new Gateway();

    try {
        const user = process.argv[2];
        const file = process.argv[3];
        const wallet = await Wallets.newFileSystemWallet('./wallet');
        // const label = 'user';
        const connProfile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../connection-org1.yaml'), 'utf8'));
        const connOpt = {
            identity: user,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true},
        };
        await gateway.connect(connProfile, connOpt);
        const channel = await gateway.getNetwork('rbacchannel');
        const contract = channel.getContract('rbac', 'org.rammiah.rbac');
        const resp = await contract.evaluateTransaction('requestFile', file);
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