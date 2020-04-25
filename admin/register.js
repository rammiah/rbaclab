/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Create a new file system based wallet for managing identities.
        // 将数据写到用户文件夹里，当然也可以直接输出当前文件夹，为了区分开
        // const walletPath = path.join(process.cwd(), '../user/wallet');
        const adminWallet = await Wallets.newFileSystemWallet('./wallet');
        const userWallet = await Wallets.newFileSystemWallet('../user/wallet');
        // console.log(`Wallet path: ${walletPath}`);
        // load the network configuration
        const registerUser = async (username) => {
            const ca = new FabricCAServices(caURL);
            // Check to see if we've already enrolled the user.
            // const userIdentity = await userWallet.get(username);
            // if (userIdentity) {
            //     console.log(`An identity for the user "${username}" already exists in the wallet`);
            //     return;
            // }

            // Check to see if we've already enrolled the admin user.
            const adminIdentity = await adminWallet.get('admin');
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Run the addWallet.js application before retrying');
                return;
            }

            // build a user object for authenticating with the CA
            const provider = adminWallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({
                enrollmentID: username,
                role: 'client'
            }, adminUser);
            // 登记用户
            const enrollment = await ca.enroll({
                enrollmentID: username,
                enrollmentSecret: secret
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            // 写入钱包
            await userWallet.put(username, x509Identity);
            console.log(`register ${username} done`);
        };
        const ccpPath = path.resolve(__dirname, '../connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.rammiah.org'].url;
        
        const users = new Array(5).fill(0).map((v, idx) => 'user' + (1 + idx));
        console.log(users);
        const ps = users.map(user => registerUser(user));
        await Promise.all(ps);
    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        process.exit(1);
    }
}

main().then(() => {
    console.log('all done');
}).catch(err => {
    console.error(err.stack);
});
