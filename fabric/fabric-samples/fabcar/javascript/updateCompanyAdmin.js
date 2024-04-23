'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function main(params) {
    try {
        // Load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network
        const contract = network.getContract('fabcar');
 
        // Gathering payload data
        const companyID = params.companyID;
        const newName = params.name;
        const newCompanyType = params.companyType;
        const newCashOutFlow = params.cashOutFlow;
        const newCashInflow = params.cashInflow;
        const newEmployeeCount = params.employeeCount;
        const newCountryOfOrigin = params.countryOfOrigin;
        const newCompanyReputation = params.companyReputation;
        const newPoorRepMonth = params.poorRepMonth;

        
        // Submit the specified transaction
        console.log(params.poorRepMonth)
        console.log(newName, newCompanyType, newCashInflow, newCashOutFlow, newEmployeeCount, newCountryOfOrigin, newCompanyReputation, newPoorRepMonth)
        await contract.submitTransaction('updateCompanyDetailsAdmin', companyID, newName, newCompanyType, newCashInflow, newCashOutFlow, newEmployeeCount, newCountryOfOrigin, newCompanyReputation, newPoorRepMonth);
        console.log('Update Company Transaction has been submitted');



        // Disconnect from the gateway
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit update company transaction: ${error}`);
        process.exit(1);
    }
}

module.exports = { main };
