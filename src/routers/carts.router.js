const CartManager = require('../cart-manager');
const express = require('express');
const router = express.Router();
const cartManager = new CartManager('./carts.json');


router.post('/carts', (req, res) => {
    cartManager.addCart()
        .then(() => {
            res.status(201).json({ message: 'Carrito creado exitosamente' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al crear carrito.' });
        })
});

// Ruta GET para listar los productos en un carrito específico (por ID de carrito)
router.get('/carts/:cid', (req, res) => {
    const cartId = req.params.cid;
    cartManager.getCartById(parseInt(cartId))
        .then(products => {
            if (products === -1) {
                res.status(404).json({ error: 'No existe un carrito con ese ID.' });
            } else {
                res.json(products);
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error obteniendo producto.' });
        });
});


// Ruta POST para agregar un producto a un carrito
router.post('/carts/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; // La cantidad predeterminada es 1
    cartManager.addProductToCart(parseInt(cartId), parseInt(productId), parseInt(quantity))
        .then(() => {
            res.status(201).json({ message: `Product id ${productId} added to Cart id ${cartId}!😎` });
        })
        .catch(error => {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).json({ error: 'Error al agregar producto al carrito' });
        });
});

module.exports = router;