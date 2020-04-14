'use strict';

const fs = require('fs');
const path = require('path');
const {Wallets} = require('fabric-network');

async function addIdentity(wallet, label, user) {
    const credPath = path.join(__dirname, `../crypto-config/peerOrganizations/org1.rammiah.org/users/${user}@org1.rammiah.org`);
    const certificate = fs.readFileSync(path.join(credPath, `msp/signcerts/${user}@org1.rammiah.org-cert.pem`)).toString();
    const privateKey = fs.readFileSync(path.join(credPath, 'msp/keystore/priv_sk')).toString();
    const identity = {
        credentials: {
            certificate,
            privateKey,
        },
        mspId: 'Org1MSP',
        type: 'X.509'
    }
    await wallet.put(label, identity);
    console.log(`add identity ${user} success`);
}


async function main() {
    try {
        const wallet = await Wallets.newFileSystemWallet('./wallet');
        const users = new Array(5).fill(0).map((v, i) => 'User' + (i + 1));
        const ps = users.map(user => addIdentity(wallet, user, user));
        await Promise.all(ps);
    } catch (err) {
        console.log(`addWallet failed, err: ${err.toString()}`);   
    }
}

main().then(() => {
    console.log('done');
}).catch(err => {
    console.log(err);
    console.log(e.stack);
});