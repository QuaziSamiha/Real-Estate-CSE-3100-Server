const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT || 3144

const app = express()
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello Real Estate Customers!!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnk0j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const adminCollection = client.db("SFR_Agency").collection("Admin");
    const propertyCollection = client.db("SFR_Agency").collection("Property");

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount);
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                console.log(admins.length);
                res.send(admins.length > 0)
            })
    })

    app.post('/addNewProperty', (req, res) => {
        const newProperty = req.body;
        propertyCollection.insertOne(newProperty)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/allProperties', (req, res) => {
        propertyCollection.find()
            .toArray((err, properties) => {
                res.send(properties)
            })
    })
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})