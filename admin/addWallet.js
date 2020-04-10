'use strict';

const fs = require('fs');
const path = require('path');
const {Wallets} = require('fabric-network');

async function main() {
    try {
        const wallet = await Wallets.newFileSystemWallet('./wallet');
        const credPath = path.join(__dirname, '../crypto-config/peerOrganizations/org1.rammiah.org/users/Admin@org1.rammiah.org');
        const certificate = fs.readFileSync(path.join(credPath, 'msp/signcerts/Admin@org1.rammiah.org-cert.pem')).toString();
        const privateKey = fs.readFileSync(path.join(credPath, 'msp/keystore/priv_sk')).toString();
        const identity = {
            credentials: {
                certificate,
                privateKey,
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        }
        const label = "admin";
        await wallet.put(label, identity);
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