'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const companies = [
            {
                name: 'Company A',
                ID: 'COMPANYA001',
                companyType: 'private',
                cashOutFlow: 100000,
                cashInflow: 150000,
                employeeCount: 50,
                countryOfOrigin: 'USA',
                companyReputation: 'good',
                poorRepMonth: 0,
            },
            {
                name: 'Company B',
                ID: 'COMPANYB002',
                companyType: 'public',
                cashOutFlow: 200000,
                cashInflow: 300000,
                employeeCount: 100,
                countryOfOrigin: 'UK',
                companyReputation: 'excellent',
                poorRepMonth: 0,
            },
            {
                name: 'Company C',
                ID: 'COMPANYC003',
                companyType: 'NGO',
                cashOutFlow: 50000,
                cashInflow: 80000,
                employeeCount: 20,
                countryOfOrigin: 'Canada',
                companyReputation: 'good',
                poorRepMonth: 0,
            },
            {
                name: 'Company D',
                ID: 'COMPANYD004',
                companyType: 'private',
                cashOutFlow: 150000,
                cashInflow: 200000,
                employeeCount: 75,
                countryOfOrigin: 'Germany',
                companyReputation: 'fair',
                poorRepMonth: 0,
            },
            {
                name: 'Company E',
                ID: 'COMPANYE005',
                companyType: 'public',
                cashOutFlow: 300000,
                cashInflow: 400000,
                employeeCount: 150,
                countryOfOrigin: 'France',
                companyReputation: 'poor',
                poorRepMonth: 2,
            },
            {
                name: 'Company f',
                ID: 'COMPANYE006',
                companyType: 'public',
                cashOutFlow: 30,
                cashInflow: 40,
                employeeCount: 150,
                countryOfOrigin: 'France',
                companyReputation: 'banned',
                poorRepMonth: 0,
            },
        ];

        for (let i = 0; i < companies.length; i++) {
            companies[i].docType = 'company';
            await ctx.stub.putState('COMPANY' + i, Buffer.from(JSON.stringify(companies[i])));
            console.info('Added <--> ', companies[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber);
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, make, model, color, owner) {
        console.info('============= START : Create Car ===========');

        const car = {
            color,
            docType: 'car',
            make,
            model,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllCars(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber);
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

    async queryCompany(ctx, companyID) {
        const companyAsBytes = await ctx.stub.getState(companyID);
        if (!companyAsBytes || companyAsBytes.length === 0) {
            throw new Error(`${companyID} does not exist`);
        }
        console.log(companyAsBytes.toString());
        return companyAsBytes.toString();
    }

    async createCompany(ctx, companyID, name, companyType, cashOutFlow, cashInflow, employeeCount, countryOfOrigin, companyReputation, poorRepMonth) {
        console.info('============= START : Create Company ===========');

        const company = {
            name,
            ID: companyID,
            companyType,
            cashOutFlow,
            cashInflow,
            employeeCount,
            countryOfOrigin,
            companyReputation,
            poorRepMonth,
            docType: 'company',
        };

        await ctx.stub.putState(companyID, Buffer.from(JSON.stringify(company)));
        console.info('============= END : Create Company ===========');
    }

    async queryAllCompanies(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async updateCompanyDetails(ctx, companyID, name, companyType, employeeCount, countryOfOrigin) {
        console.info('============= START : Update Company Details ===========');
    
        const companyAsBytes = await ctx.stub.getState(companyID);
        if (!companyAsBytes || companyAsBytes.length === 0) {
            throw new Error(`${companyID} does not exist`);
        }
        const company = JSON.parse(companyAsBytes.toString());
    
        // Update company details if provided
        if (company.companyReputation !== "banned") {
            if (name) {
                company.name = name;
            }
            if (companyType) {
                company.companyType = companyType;
            }
            if (employeeCount) {
                company.employeeCount = employeeCount;
            }
            if (countryOfOrigin) {
                company.countryOfOrigin = countryOfOrigin;
            }
    }     
        await ctx.stub.putState(companyID, Buffer.from(JSON.stringify(company)));
        console.info('============= END : Update Company Details ===========');
    }

    async updateCompanyDetailsAdmin(ctx, companyID, name, companyType, cashInflow, cashOutFlow, employeeCount, countryOfOrigin, companyReputation, poorRepMonth) {
        console.info('============= START : Update Company Details ===========');
    
        const companyAsBytes = await ctx.stub.getState(companyID);
        if (!companyAsBytes || companyAsBytes.length === 0) {
            throw new Error(`${companyID} does not exist`);
        }
        const company = JSON.parse(companyAsBytes.toString());
    
        // Update company details if provided
        if (company.companyReputation){
            if (company.companyReputation !== 'banned'){
                if (name) {
                    company.name = name;
                }
                if (companyType) {
                    company.companyType = companyType;
                }
                if (cashInflow) {
                    company.cashInflow = cashInflow;
                }
                if (cashOutFlow) {
                    company.cashOutFlow = cashOutFlow;
                }
                if (employeeCount) {
                    company.employeeCount = employeeCount;
                }
                if (countryOfOrigin) {
                    company.countryOfOrigin = countryOfOrigin;
                }
                if (companyReputation) {
                    company.companyReputation = companyReputation;
                }
                if (poorRepMonth) {
                    company.poorRepMonth = poorRepMonth;
                }
            }
        }else{
            if (name) {
                company.name = name;
            }
            if (companyType) {
                company.companyType = companyType;
            }
            if (cashInflow) {
                company.cashInflow = cashInflow;
            }
            if (cashOutFlow) {
                company.cashOutFlow = cashOutFlow;
            }
            if (employeeCount) {
                company.employeeCount = employeeCount;
            }
            if (countryOfOrigin) {
                company.countryOfOrigin = countryOfOrigin;
            }
            if (companyReputation) {
                company.companyReputation = companyReputation;
            }
            if (poorRepMonth) {
                company.poorRepMonth = poorRepMonth;
            }

        }
            
    
        await ctx.stub.putState(companyID, Buffer.from(JSON.stringify(company)));
        console.info('============= END : Update Company Details ===========');
    }

    
}

module.exports = FabCar;
