/*
A continuacion podemos encontrar el código de un supermercado que vende productos.
El código contiene
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
   ok a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    ok b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
   ok c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
​
*/

// Cada producto que vende el super es creado con esta clase
class Producto {
  sku; // Identificador único del producto
  nombre; // Su nombre
  categoria; // Categoría a la que pertenece este producto
  precio; // Su precio
  stock; // Cantidad disponible en stock

  constructor(sku, nombre, precio, categoria, stock) {
    this.sku = sku;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;

    // Si no me definen stock, pongo 10 por default
    if (stock) {
      this.stock = stock;
    } else {
      this.stock = 10;
    }
  }
}

// Creo todos los productos que vende mi super
const queso = new Producto("KS944RUR", "Queso", 10, "lacteos", 4);
const gaseosa = new Producto("FN312PPE", "Gaseosa", 5, "bebidas");
const cerveza = new Producto("PV332MJ", "Cerveza", 20, "bebidas");
const arroz = new Producto("XX92LKI", "Arroz", 7, "alimentos", 20);
const fideos = new Producto("UI999TY", "Fideos", 5, "alimentos");
const lavandina = new Producto("RT324GD", "Lavandina", 9, "limpieza");
const shampoo = new Producto("OL883YE", "Shampoo", 3, "higiene", 50);
const jabon = new Producto("WE328NJ", "Jabon", 4, "higiene", 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [
  queso,
  gaseosa,
  cerveza,
  arroz,
  fideos,
  lavandina,
  shampoo,
  jabon,
];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
  productos; // Lista de productos agregados
  categorias; // Lista de las diferentes categorías de los productos en el carrito
  precioTotal; // Lo que voy a pagar al finalizar mi compra

  // Al crear un carrito, empieza vació
  constructor() {
    this.precioTotal = 0;
    this.productos = [];
    this.categorias = [];
  }

  /**
   * función que agrega @{cantidad} de productos con @{sku} al carrito
   */
  async agregarProducto(sku, cantidad) {
    console.log(`Agregando al carrito ${cantidad} ${sku}`);

    // Busco el producto en la "base de datos"
    const producto = await findProductBySku(sku);
    console.log("Producto encontrado en super", sku);
    // Busco el producto en el carrito
    const existeEnCarrito = await findProductBySkuencarrito(sku);
    console.log("Producto encontrado en carrito", sku);
    let indicesuper = null;
    // Buscar el índice del producto correspondiente al SKU buscado
    for (let i = 0; i < productosDelSuper.length; i++) {
      if (productosDelSuper[i].sku === sku) {
        indicesuper = i;
        break;
      }
    }
    if (productosDelSuper[indicesuper].stock >= 1) {
      if (existeEnCarrito) {
        let indicecarrito = null;
        // Buscar el índice del producto correspondiente al SKU buscado
        for (let i = 0; i < carrito.productos.length; i++) {
          if (carrito.productos[i].sku === sku) {
            indicecarrito = i;
            break;
          }
        }

        productosDelSuper[indicesuper].stock -= cantidad;
        carrito.productos[indicecarrito].cantidad += cantidad;
        carrito.precioTotal =
          carrito.precioTotal + productosDelSuper[indicesuper].precio;
      } else {
        const nuevoProducto = new ProductoEnCarrito(
          sku,
          producto.nombre,
          cantidad
        );
        this.productos.push(nuevoProducto);
        this.precioTotal = this.precioTotal + producto.precio * cantidad;
        productosDelSuper[indicesuper].stock -= cantidad;
        console.log(producto.categoria);
        console.log(carrito.categorias);
        const found = carrito.categorias.find(
          (element) => (element = producto.categoria)
        );

        console.log(found);

        if (found != producto.categoria) {
          this.categorias.push(producto.categoria);
        }
      }
    } else {
      console.log("no hay mas en stock");
    }
  }
  eliminarProducto(sku, cantidad) {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          const indiceProducto = this.productos.findIndex(
            (producto) => producto.sku === sku
          );

          if (indiceProducto === -1) {
            // El producto no está en el carrito
            reject(Error("El producto no está en el carrito"));
          } else {
            const precioDelProducto = (sku) => {
              const producto = productosDelSuper.find(
                (product) => product.sku === sku
              );
              return producto.precio;
            };
            let precioProdAEliminar = precioDelProducto(sku);
            const productoEnCarrito = this.productos[indiceProducto];
            console.log(productoEnCarrito.cantidad);
            if (cantidad < productoEnCarrito.cantidad) {
              // La cantidad es menor a la cantidad del producto en el carrito
              productoEnCarrito.cantidad -= cantidad;
              this.precioTotal -= precioProdAEliminar * cantidad;
            } else {
              // La cantidad es mayor o igual a la cantidad del producto en el carrito
              this.productos.splice(indiceProducto, 1);
              this.precioTotal -=
                precioProdAEliminar * productoEnCarrito.cantidad;

              // Verificar si la categoría del producto ya no está en el carrito y eliminarla de la lista de categorías
              const categoriaProducto = productoEnCarrito.categoria;
              const categoriaIndex = this.categorias.indexOf(categoriaProducto);
              if (categoriaIndex !== -1) {
                this.categorias.splice(categoriaIndex, 1);
              }
            }

            resolve();
          }
        }, 3000);
      } catch (error) {
        console.log(Error);
      }
    });
  }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
  sku; // Identificador único del producto
  nombre; // Su nombre
  cantidad; // Cantidad de este producto en el carrito

  constructor(sku, nombre, cantidad) {
    this.sku = sku;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }
}

// Función que busca un producto por su sku en "la base de datos"

function findProductBySku(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = productosDelSuper.find(
        (product) => product.sku === sku
      );
      if (foundProduct) {
        resolve(foundProduct);
      } else {
        reject(`Product ${sku} not found`);
      }
    }, 1500);
  });
}
function findProductBySkuencarrito(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const prodenchanguito = carrito.productos;

      const foundProductcarrito = prodenchanguito.find(
        (product) => product.sku === sku
      );

      if (foundProductcarrito) {
        resolve(foundProductcarrito);
      } else {
        resolve(foundProductcarrito);
      }
    }, 1500);
  });
}
const eliminar = (sku, cantidad) => {
  carrito
    .eliminarProducto(sku, cantidad)
    .then(() => {
      console.log("Producto eliminado correctamente del carrito");
    })
    .catch((error) => {
      console.error("Error al eliminar el producto del carrito:", error);
    });
};
const carrito = new Carrito();

carrito.agregarProducto("WE328NJ", 1);
carrito.agregarProducto("WE328NJ", 1);
carrito.agregarProducto("FN312PPE", 1);
carrito.agregarProducto("OL883YE", 1);

eliminar("WE328NJ", 1);
