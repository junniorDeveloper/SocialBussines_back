// src/routes/updateProduct.js
const express = require('express');
const pool = require('../db'); // Importa la conexión a la base de datos
const router = express.Router();

// Ruta para modificar un producto
router.put('/:id', async (req, res) => {
  const productId = req.params.id;
  const { name, descriptions, price, state, id_category, images } = req.body;

  try {
    // Actualiza el producto en la tabla products
    await pool.query(`
      UPDATE products
      SET name = $1, descriptions = $2, price = $3, state = $4, id_category = $5
      WHERE id_product = $6
    `, [name, descriptions, price, state, id_category, productId]);

    // Elimina imágenes existentes del producto
    await pool.query(`
      DELETE FROM images WHERE id_product = $1
    `, [productId]);

    // Inserta nuevas imágenes si se proporcionan
    if (images && images.length > 0) {
      const imageQueries = images.map(image => {
        return pool.query(`
          INSERT INTO images (content, id_product)
          VALUES ($1, $2)
        `, [image.content, productId]);
      });

      await Promise.all(imageQueries); // Espera a que todas las inserciones de imágenes terminen
    }

    res.status(200).json({ message: 'Producto modificado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al modificar el producto' });
  }
});

module.exports = router; // Exporta el router
