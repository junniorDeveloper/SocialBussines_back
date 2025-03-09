// src/routes/registerProduct.js
const express = require('express');
const pool = require('../db'); // Importa la conexión a la base de datos
const router = express.Router();

// Ruta para registrar un nuevo producto
router.post('/', async (req, res) => {
  const { name, descriptions, price, state, id_category, images } = req.body;

  try {
    // Inserta el nuevo producto en la tabla products
    const result = await pool.query(`
      INSERT INTO products (name, descriptions, price, state, id_category)
      VALUES ($1, $2, $3, $4, $5) RETURNING id_product
    `, [name, descriptions, price, state, id_category]);

    const id_product = result.rows[0].id_product;

    // Inserta las imágenes relacionadas
    if (images && images.length > 0) {
      const imageQueries = images.map(image => {
        return pool.query(`
          INSERT INTO images (content, id_product)
          VALUES ($1, $2)
        `, [image.content, id_product]);
      });

      await Promise.all(imageQueries); // Espera a que todas las inserciones de imágenes terminen
    }

    res.status(201).json({ id_product, message: 'Producto registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el producto' });
  }
});

module.exports = router; // Exporta el router
