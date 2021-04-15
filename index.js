const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const FileUpload = require('express-fileupload');
const imageToBase64 = require('image-to-base64');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('service'));
app.use(FileUpload());

const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.356j9.mongodb.net/${ process.env.DB_NAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const services = client.db(`${ process.env.DB_NAME }`).collection("services");
    const orders = client.db(`${ process.env.DB_NAME }`).collection("orders");

    app.post('/addservice', (req, res) => {
        const newImg = req.files.image.data;

        const image = {
            contentType: req.files.image.mimetype,
            size: req.files.image.size,
            img: Buffer.from(newImg).toString('base64')
        };
        req.body.image = image;
        services.insertOne(req.body)
            .then(response => {
                console.log(response);
                res.send(response);
            })
    })

    app.get('/services', (req, res) => {
        services.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/serviceDelete', (req, res) => {
        services.deleteOne({ _id: ObjectID(req.query.id) })
            .then(response => {
                console.log(response);
            })
    })

    app.get('/service', (req, res) => {
        services.find({
            _id: ObjectID(req.query.id)
        })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/order', (req, res) => {
        orders.insertOne(req.body)
            .then(response => {
                res.send(response);
            })
    })

});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${ port }`)
})