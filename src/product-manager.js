const fs = require('fs');
const { json } = require('stream/consumers');
class ProductManager {
    constructor(path) {
        this.path = path;
        this.counter = 1; 
        this.initializeIdCounter();
    }

    async initializeIdCounter() {
        try {
            const products = await getJsonFromFile(this.path);
            if (products.length > 0) {
                // Encuentra el máximo ID actualmente utilizado
                const maxId = Math.max(...products.map(product => product.id));
                this.counter = maxId + 1; // Establece el contador al siguiente ID disponible
            }
        } catch (error) {
            console.error('Error initializing ID counter:', error);
        }
    }

    // Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado,
    // asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).

    async addProduct(productData) {
        const { title, description, code, price, status, stock, category, thumbnails } = productData;
        
        if (!title, !description, !code, !price, !status, !stock, !category) {
            console.error('The title, description, price, thumbnail, code, and stock fields are required 🎯');
            return;
        }
        try {
            const products = await getJsonFromFile(this.path);
            const existingProduct = products.find(product => product.code === code);
            if (existingProduct) {
                console.error(`There is already a product with that code ${code}`);
                return;
            } else {
                const newProduct = {
                    id: this.counter,
                    title,
                    description,
                    code,
                    price,
                    status: true,
                    stock,
                    category,
                    thumbnails: thumbnails || [] // Si no se proporciona thumbnails, establece un array vacío
                    
                }
                this.counter++
                products.push(newProduct)
                await saveJsonInFile(this.path, products)
                console.log(`The product with code ${code} was added 😎`)
            }
        } catch (error) {
            console.error('Error adding product:', error)
        }
    }

    // Debe tener un método getProducts, el cual debe leer el archivo de productos y
    // devolver todos los productos en formato de arreglo.
    async getProducts() {
        try {
            return getJsonFromFile(this.path)
        } catch (error) {
            console.error(error)
        }

    }

    // Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo,
    // // debe buscar el producto con el id especificado y devolverlo en formato objeto
    async getProductById(productId) {
        try {
            const products = await getJsonFromFile(this.path)
            const product = products.find(product => product.id === productId);
            if (!product) {
                return `Product with id ${productId} Not found! 😨`;
            } else {
                return product
            }
        } catch (error) {
            console.error(error)
        }

    }

    // Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar,
    // así también como el campo a actualizar (puede ser el objeto completo, como en una DB),
    // y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID
    async updateProduct(id, data) {
        const { title, description, code, price, status, stock, category, thumbnails } = data;
        const products = await getJsonFromFile(this.path);
        const position = products.findIndex((u) => u.id === id);
        if (position === -1) {
            console.error(`Product id ${id} not found 😨`);
            return;
        }
        if (title) {
            products[position].title = title;
        }
        if (description) {
            products[position].description = description;
        }
        if (code) {
            products[position].code = code;
        }
        if (price) {
            products[position].price = price;
        }
        if (status) {
            products[position].status = status;
        }
        if (stock) {
            products[position].stock = stock;
        }
        if (category) {
            products[position].category = category;
        }
        if (thumbnails) {
            products[position].thumbnail = thumbnail;
        }       
        await saveJsonInFile(this.path, products);
        console.log(`Product id ${id} updated! 😎`);
    }


    // Debe tener un método deleteProduct, el cual debe recibir un id y
    // debe eliminar el producto que tenga ese id en el archivo.
    async deleteProduct(id) {
        const products = await getJsonFromFile(this.path);
        const position = products.findIndex((product) => product.id === id);
        if (position >= 0) {
            products.splice(position, 1);
            await saveJsonInFile(this.path, products);
            console.log(`Product id ${id} deleted! 😎`);
        } else {
            console.log('There is no product with that Id')
        }

    }
}
const getJsonFromFile = async (path) => {
    if (!fs.existsSync(path)) {
        return [];
    }
    const content = await fs.promises.readFile(path, 'utf-8');
    return JSON.parse(content);
};

const saveJsonInFile = (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    return fs.promises.writeFile(path, content, 'utf-8');
}


//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
async function test() {
    //Creo una instancia de la clase “ProductManager”
    const productManager = new ProductManager('./products.json');
    //Llamo “getProducts” recién creada la instancia
    // console.log('Ejecuto getProducts');
    // await productManager.getProducts()
    //     .then(products => {
    //         console.log(products);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
    // console.log('Agrego Products');
    await productManager.addProduct('Apple Ipad 10 9 10th', 'Tablet de ultima generación', 5698, 959, true, 20, 'Tablet',  ['./img/cel-tecno/apple-ipad-10-9-10th-gen-wifi-1', './img/cel-tecno/apple-ipad-10-9-10th-gen-wifi-2'])

    // console.log('Ejecuto getProducts');
    // await productManager.getProducts()
    //     .then(products => {
    //         console.log(products);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });

    // Pruebo agregar un producto sin un parametro obligatorio.
    // await productManager.addProduct('Apple Ipad 10 9 10th', 959, './img/cel-tecno/apple-ipad-10-9-10th-gen-wifi', 5698, 20);
    // Agrego producto con todos los parametros.
    // await productManager.addProduct('Apple Ipad 10 9 10th', 'Tablet de ultima generación', 959, './img/cel-tecno/apple-ipad-10-9-10th-gen-wifi', 5698, 20);
    // Me fijo si lo agrego al array de productos
    // console.log('Ejecuto getProducts');
    // await productManager.getProducts()
    //     .then(products => {
    //         console.log(products);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });


    //Pruebo agregar un producto con un codigo ya existente.
    // await productManager.addProduct('Cel Samsung Galaxy A04', 'Uno de los celulares mas venididos del 2022', 179, './img/cel-tecno/cel-samsung-galaxy-a04', 5698, 20);
    // Agrego segundo producto
    await productManager.addProduct('Cel Samsung Galaxy A04', 'Uno de los celulares mas venididos del 2022', 5699, 179, true, 20, 'Celular',['./img/cel-tecno/cel-samsung-galaxy-a04-1', './img/cel-tecno/cel-samsung-galaxy-a04-2']);
    //Me fijo si lo agrego al array de productos
    // console.log('Ejecuto getProducts');
    // await productManager.getProducts()
    //     .then(products => {
    //         console.log(products);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });

    // Agrego dos productos más.
    await productManager.addProduct('Cel Xiaomi Redmi 10a', 'Uno de los celulares mas venididos del 2021', 5700, 153, true, 20, 'Celular',['./img/cel-tecno/xiaomi-redmi-10a-1', './img/cel-tecno/xiaomi-redmi-10a-2']);
    await productManager.addProduct('ASUS Vivobook m513ia bq322t', 'Computador portatil de gran performace', 5701, 800, true, 10, 'Notebook', ['./img/notebooks/asus-vivobook-m513ia-1','./img/notebooks/asus-vivobook-m513ia-2']);
    await productManager.addProduct('HP-14\" dq2088wm HD Core i5', 'Computador portatil de gran procesador', 5702, 849, true, 10, 'Notebook',['./img/notebooks/hp-14-dq2088wm']);
    await productManager.addProduct('Enxuta smart tv 24\" ledenx1224d1k', 'TV Smart la mas vendida de 2022', 5703, 134, true, 10, 'TV&Video',['./img/tv-video/enxuta-smart-tv-24-ledenx1224d1k']);
    await productManager.addProduct('JBL wave 300 tws headphone', 'Excelentes auriculares', 5704, 89, true, 10, 'TV&Video', ['./img/tv-video/jbl-wave-300-tws']);
    await productManager.addProduct('Minicomponente LG Cl88', 'Gran potencia de sonido', 5705, 780, true, 10, 'TV&Video', ['./img/tv-video/minicomponente-lg-cl88']);
    await productManager.addProduct('Nintendo Switch Oled 64gb', 'La mejor Consola de Nintendo', 5706, 800, true, 10, 'TV&Video', ['./img/tv-video/nintendo-switch-oled-64gb']);
    await productManager.addProduct('Smart TV LG 55\" oled oled55c2psa', 'TV de ultima generación', 5707, 2849, true, 10, 'TV&Video');

    console.log('Ejecuto getProducts');
    await productManager.getProducts()
        .then(products => {
            console.log(products);
        })
        .catch(error => {
            console.error(error);
        });

    // // Pruebo traer un producto de id inexistente
    await productManager.getProductById(15)
        .then(product => {
            console.log('Product By Id:', product);
        })
        .catch(error => {
            console.error(error);
        });
    // // Pruebo traer un producto de id existente
    await productManager.getProductById(3)
        .then(product => {
            console.log('Product By Id:', product);
        })
        .catch(error => {
            console.error(error);
        });

    // const data = {
    //     id: 1,
    //     title: 'Prueba 1',
    //     description: 'Ningun',
    //     price: 100000000,
    //     thumbnail: 'no tengo',
    //     code: 2315,
    //     stock: 0
    // }
    // await productManager.updateProduct(1, data)

    // console.log('Ejecuto getProducts');
    // await productManager.getProducts()
    //     .then(products => {
    //         console.log(products);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });

    // await productManager.deleteProduct(1);

    // console.log('Ejecuto getProducts');
    // await productManager.getProducts()
    //     .then(products => {
    //         console.log(products);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
 }

test();

// Exporta la clase ProductManager para que esté disponible en otros archivos
module.exports = ProductManager;