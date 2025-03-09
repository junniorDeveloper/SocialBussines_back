// src/index.js
const express = require('express');
const cors = require('cors'); // Importa el paquete cors
const pool = require('./db');
const productRoutes = require('./routes/product'); // Importa las rutas de productos
const categoryRoutes = require('./routes/category'); // Importa las rutas de categorías
const registerProductRouter = require('./routes/registerProduct');
const updateProductRouter = require('./routes/updateProduct');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Usa las rutas de productos activos
app.use('/api/products', productRoutes);

// Usa las rutas de categorías activos
app.use('/api/categories', categoryRoutes);

// registro de productos
app.use('/api/register', registerProductRouter);

//actualizacion de productos
app.use('/api/update', updateProductRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
