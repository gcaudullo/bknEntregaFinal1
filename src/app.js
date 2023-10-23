const express = require('express');
const productsRouter = require('./routers/products.router');
const cartsRouter = require('./routers/carts.router');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', productsRouter, cartsRouter);

app.listen(8080, () => {
    console.log('Servidor http escuchando en el puerto 8080')
})



