const ProductManager = require('../product-manager');
const express = require('express');
const router = express.Router();
const productManager = new ProductManager('./products.json');



router.get('/products', (req, res) => {
    const { query } = req;
    const { limit } = query;
    productManager.getProducts()
        .then(products => {
            if (!limit) {
                res.json(products);
            } else {
                const result = products.slice(0, parseInt(limit));
                res.status(200).json(result);
            }
        })
        .catch(error => {
            console.error(error);
        });
});

router.get('/products/:pId', (req, res) => {
    const { pId } = req.params;
    productManager.getProductById(parseInt(pId))
        .then(product => {
            if (product === 'Product Not found! 😨') {
                res.status(404).json({ error: product });
            } else {
                res.json(product);
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error obteniendo producto.' });
        });
});

router.post('/products', (req, res) => {
    productManager.addProduct(req.body)
        .then(() => {
            res.status(201).json(req.body);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al agregar el producto.' });
        });
});

router.put('/products/:pid', (req, res) => {
    const { pid } = req.params; // Obtiene el ID del producto de la URL
    const productData = req.body; // Obtiene los datos a actualizar desde el cuerpo de la solicitud

    // Llama al método updateProduct de ProductManager para actualizar el producto
    productManager.updateProduct(parseInt(pid), productData)
        .then(() => {
            res.json({ message: 'Producto actualizado exitosamente' });
        })
        .catch(error => {
            console.error('Error al actualizar el producto:', error);
            res.status(500).json({ error: 'Error al actualizar el producto' });
        });
});

router.delete('/products/:pid', (req, res) => {
    const { pid } = req.params; // Obtiene el ID del producto de la URL

    // Llama al método deleteProduct de ProductManager para eliminar el producto
    productManager.deleteProduct(parseInt(pid))
        .then(() => {
            res.json({ message: 'Producto eliminado exitosamente' });
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        });
});



module.exports = router;