/*
 * Module dependencies
 */
const express = require('express')
const cors = require('cors')
const query = require('./query');
const createCar = require('./createCar')
const changeOwner = require('./changeOwner')
const bodyParser = require('body-parser')
const queryCompany = require('./queryCompany')
const createCompany = require('./createCompany');
const updateCompanyScript = require('./updateCompany');
const searchByCompanyID = require('./searchByCompanyID');
const updateCompanyAdmin = require('./updateCompanyAdmin')

const app = express()

// To control CORSS-ORIGIN-RESOURCE-SHARING( CORS )
app.use(cors())
app.options('*', cors()); 

// To parse encoded data
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


// get all car
app.get('/get-car', function (req, res) {
    query.main( req.query )
    .then(result => {
        const parsedData = JSON.parse( result )
        let carList

        // if user search car
        if(  req.query.key ){
            carList = [
                {
                    Key: req.query.key,
                    Record: {
                        ...parsedData
                    }
                }
            ]
            res.send( carList )
            return
        }

        carList = parsedData
        res.send( carList )
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO GET DATA!')
    })
})

// GET request for searching by companyID
app.get('/searchByCompanyID', async (req, res) => {
    try {
        const companyID = req.query.companyID;
        const companyData = await searchByCompanyID.main(companyID);
        res.json(companyData);
    } catch (error) {
        console.error(`Failed to search by companyID: ${error}`);
        res.status(500).send('Failed to search by companyID');
    }
});

// Endpoint to get all companies or a specific company
app.get('/get-company', function (req, res) {
    queryCompany.main(req.query)
        .then(result => {
            const parsedData = JSON.parse(result);
            let companyList;

            // If user searched for a specific company
            if (req.query.key) {
                companyList = [{
                    Key: req.query.key,
                    Record: {
                        ...parsedData
                    }
                }];
                res.send(companyList);
                return;
            }

            // Send all companies if no specific key is provided
            companyList = parsedData;
            res.send(companyList);
        })
        .catch(err => {
            console.error({ err });
            res.send('FAILED TO GET COMPANY DATA!');
        });
});

// Endpoint to create a new company
app.post('/create-company', function (req, res) {
    createCompany.main(req.body)
        .then(result => {
            res.send({ message: 'Company created successfully' });
        })
        .catch(err => {
            console.error({ err });
            res.send('FAILED TO CREATE COMPANY!');
        });
});


// updating company details
app.post('/updateCompany', async (req, res) => {
    try {
        const { companyID, name, companyType, employeeCount, countryOfOrigin } = req.body;
        await updateCompanyScript.main({ companyID, name, companyType, employeeCount, countryOfOrigin });
        res.send({ message: 'Company details updated successfully' });
    } catch (err) {
        console.error({ err });
        res.status(500).send('Failed to update company details!');
    }
});


// updating company details by admin
app.post('/updateCompanyAdmin', async (req, res) => {
    try {
        const { companyID, name, companyType, cashInflow, cashOutFlow, employeeCount, countryOfOrigin, companyReputation, poorRepMonth } = req.body;
        await updateCompanyAdmin.main({ companyID, name, companyType, cashInflow, cashOutFlow, employeeCount, countryOfOrigin, companyReputation, poorRepMonth });
        res.send({ message: 'Company details updated successfully' });
    } catch (err) {
        console.error({ err });
        res.status(500).send('Failed to update company details!');
    }
});

// create a new car
app.post('/create', function (req, res) {
    createCar.main( req.body  )
    .then(result => {
        res.send({message: 'Created successfully'})
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO LOAD DATA!')
    })
})

// change car owner
app.post('/update', function (req, res) {
    changeOwner.main( req.body  )
    .then(result => {
        res.send({message: 'Updated successfully'})
    })
    .catch(err => {
        console.error({ err })
        res.send('FAILED TO LOAD DATA!')
    })
})

app.listen(3000, () => console.log('Server is running at port 3000'))