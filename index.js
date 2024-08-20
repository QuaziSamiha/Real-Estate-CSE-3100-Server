const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3144;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello Real Estate Customers!!");
});

const uri = `mongodb+srv://fahadRashik:rashik144@cluster144.dnk0j.mongodb.net/SFR_Agency?retryWrites=true&w=majority&appName=Cluster144`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  if (err) {
    console.error("Failed to connect to MongoDB:", err);
    return;
  }
  console.log("Connected successfully to MongoDB");

  const adminCollection = client.db("SFR_Agency").collection("Admin");
  const propertyCollection = client.db("SFR_Agency").collection("Property");

  app.post("/addAdmin", (req, res) => {
    const newAdmin = req.body;
    adminCollection
      .insertOne(newAdmin)
      .then((result) => {
        res.send(result.insertedCount);
      })
      .catch((error) => {
        console.error("Error inserting admin:", error);
        res.status(500).send("Internal Server Error");
      });
  });

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, admins) => {
      if (err) {
        console.error("Error finding admin:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.send(admins.length > 0);
    });
  });

  app.post("/addNewProperty", (req, res) => {
    const newProperty = req.body;
    propertyCollection
      .insertOne(newProperty)
      .then((result) => {
        res.send(result.insertedCount > 0);
      })
      .catch((error) => {
        console.error("Error adding property:", error);
        res.status(500).send("Internal Server Error");
      });
  });

  app.get("/allProperties", (req, res) => {
    propertyCollection.find().toArray((err, properties) => {
      if (err) {
        console.error("Error fetching properties:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.send(properties);
    });
  });

  app.delete("/deleteProperty/:id", (req, res) => {
    propertyCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      })
      .catch((error) => {
        console.error("Error deleting property:", error);
        res.status(500).send("Internal Server Error");
      });
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// const express = require('express')
// const cors = require('cors');
// const bodyParser = require('body-parser');
// require('dotenv').config()
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const ObjectId = require('mongodb').ObjectID;
// const port = process.env.PORT || 3144

// const app = express()
// app.use(cors());
// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send('Hello Real Estate Customers!!')
// })

// // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnk0j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://fahadRashik:rashik144@cluster144.dnk0j.mongodb.net/SFR_Agency?retryWrites=true&w=majority&appName=Cluster144`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const adminCollection = client.db("SFR_Agency").collection("Admin");
//     const propertyCollection = client.db("SFR_Agency").collection("Property");

//     app.post('/addAdmin', (req, res) => {
//         const newAdmin = req.body;
//         adminCollection.insertOne(newAdmin)
//             .then(result => {
//                 res.send(result.insertedCount);
//             })
//     })

//     app.post('/isAdmin', (req, res) => {
//         const email = req.body.email;
//         adminCollection.find({ email: email })
//             .toArray((err, admins) => {
//                 console.log(admins.length);
//                 res.send(admins.length > 0)
//             })
//     })

//     app.post('/addNewProperty', (req, res) => {
//         const newProperty = req.body;
//         propertyCollection.insertOne(newProperty)
//             .then(result => {
//                 res.send(result.insertedCount > 0)
//             })
//     })

//     app.get('/allProperties', (req, res) => {
//         propertyCollection.find()
//             .toArray((err, properties) => {
//                 res.send(properties)
//             })
//     })

//     app.delete('/deleteProperty/:id', (req, res) => {
//         propertyCollection.deleteOne({ _id: ObjectId(req.params.id) })
//             .then(result => {
//                 console.log(result);
//             })
//     })
// });

// app.listen(port, () => {
//     console.log(`listening on port ${port}`)
// })
