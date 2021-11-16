const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const cors = require('cors');
//DECLARE PORT
const port = process.env.PORT || 5000;
app.use(express.json());

app.use(cors());


// databse connection INFO
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

//DB CONNECTION URI
const uri = ` mongodb+srv://${dbUser}:${dbPass}@cluster0.ugy5t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//use mongodb database
async function run() {
    try {
        await client.connect();
        // database 
        const database = client.db("dream-camara");
        //product collection
        const productsCollection = database.collection("products");
        //carusel collection
        const caruselCollection = database.collection("carusel");
        //users collection
        const usersCollection = database.collection("users");
        //post for all order
        const allOrderCollection = database.collection("allOrders")
        //// post rating 
        const ratingCollection = database.collection("rating")
        // post method for add product collection

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            // add data server to database
            const result = await productsCollection.insertOne(newProduct);
            res.json(result);
        });

        //get method for get all products 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        //get method for find one product
        app.get('/product', async (req, res) => {
            const id = req.query.id;
            const query = { _id: objectId(id) }
            const result = await productsCollection.findOne(query)
            res.json(result)

        })
        //update product method
        app.put('/updateproduct', async (req, res) => {
            const updateProduct = req.body;
            if (updateProduct?._id) {
                const find = { _id: objectId(updateProduct._id) }
                console.log(find)
                const updatedItem = {
                    $set: {

                        title: updateProduct.title,
                        imgUrl: updateProduct.imgUrl,
                        price: updateProduct.price,
                        description: updateProduct.description

                    }
                }

                const result = await productsCollection.updateOne(find, updatedItem)

                res.json(result)
            }

        })
        //products delete method
        app.delete('/product', async (req, res) => {
            const id = req.query.id;
            const find = { _id: objectId(id) }
            const result = await productsCollection.deleteOne(find)
            res.json(result);
            console.log(result)

        })
        // add carusel item
        app.post('/carusel', async (req, res) => {
            const newCarusel = req.body;
            const result = await caruselCollection.insertOne(newCarusel);
            res.json(result);
        })
        //get carusel item
        app.get('/carusel', async (req, res) => {
            const cursor = caruselCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        //get method for find one carusel
        app.get('/caruselitem', async (req, res) => {
            const id = req.query.id;
            console.log(id)
            const query = { _id: objectId(id) }
            const result = await caruselCollection.findOne(query)
            console.log(result)
            res.json(result)

        })
        //update carusel method
        app.put('/updatecarusel', async (req, res) => {
            const updatecarusel = req.body;
            if (updatecarusel?._id) {
                const find = { _id: objectId(updatecarusel._id) }
                console.log(find)
                const updatedItem = {
                    $set: {

                        title: updatecarusel.title,
                        imgUrl: updatecarusel.imgUrl,


                    }
                }

                const result = await caruselCollection.updateOne(find, updatedItem)
                console.log(result)
                res.json(result)
            }

        })
        //carusel delete method
        app.delete('/carusel', async (req, res) => {
            const id = req.query.id;
            const find = { _id: objectId(id) }
            const result = await caruselCollection.deleteOne(find)
            res.json(result);
            console.log(result)

        })

        //user information
        app.put('/users', async (req, res) => {

            const email = req.body.email;
            const filter = { email: email };
            const options = { upsert: true };
            const updateUserInfo = {
                $set: {
                    displayName: req.body.displayName,
                    email: req.body.email,

                },
            };
            const result = await usersCollection.updateOne(filter, updateUserInfo, options);
            res.json(result)


        });
        //get a single user
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const filter = { email: email }
            const result = await usersCollection.findOne(filter)
            console.log(result)
            res.json(result)
        })
        //make admin
        app.put('/makeadmin', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            console.log(req.query)
            const makeAdmin = {
                $set: {
                    role: "admin"
                }
            }
            const result = await usersCollection.updateOne(filter, makeAdmin)
            res.json(result)
            console.log(result)

        })
        //post order item
        app.post('/orders', async (req, res) => {
            const orderInfo = req.body;
            const result = await allOrderCollection.insertOne(orderInfo)
            res.json(result)
            console.log(result)
        })
        //update order status 
        app.put('/order', async (req, res) => {
            const orderId = req.query.orderId;
            const filter = { productId: orderId }
            const updateStatus = {
                $set: {
                    status: "Deliverd"
                }
            }
            const result = await allOrderCollection.updateOne(filter, updateStatus);
            console.log(result)
        })
        //delete order item
        app.delete('/order', async (req, res) => {
            const id = req.query.id;
            const filter = { _id: objectId(id) }
            const result = await allOrderCollection.deleteOne(filter);
            res.json(result)
            console.log(result)
        })
        // all order get
        app.get('/orders', async (req, res) => {
            const result = await allOrderCollection.find({}).toArray()
            res.json(result)

        })
        // get single item for single person filter by email
        app.get('order', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            const result = await allOrderCollection.findOne(filter);
            res.json(result);
            console.log(result)
        })
        app.post('/rate', async (req, res) => {
            const rate = req.body;
            const result = await ratingCollection.insertOne(rate)
            res.json(result)
            console.log(req)
        })
        app.get('/rate', async (req, res) => {
            const result = await ratingCollection.find({}).toArray();
            res.json(result)
        })

    }
    finally {
        // await client.close;
    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send("server running")
})

app.listen(port, () => {
    console.log(`lisitinign port :${port}`)
})