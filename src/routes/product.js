// src/routes/product.js
const express = require('express');
const pool = require('../db'); // Importa la conexión a la base de datos
const router = express.Router();

// Ruta para obtener productos según su estado
router.get('/:state', async (req, res) => {
  const productState = req.params.state; // Obtiene el estado desde la URL

  try {
    const result = await pool.query(`
      SELECT p.id_product, p.name, p.descriptions, p.price, p.state,
             c.id_category, c.name AS category_name,
             i.id_image, i.content AS image_content
      FROM products p
      LEFT JOIN categories c ON p.id_category = c.id_category
      LEFT JOIN images i ON p.id_product = i.id_product
      WHERE p.state = $1  -- Filtra por estado
      ORDER BY p.id_product
    `, [productState]); // Usa el estado proporcionado en la consulta

    const products = result.rows.reduce((acc, row) => {
      const { id_product, name, descriptions, price, state, id_category, category_name, id_image, image_content } = row;

      let product = acc.find(p => p.id_product === id_product);

      if (!product) {
        product = {
          id_product,
          name,
          descriptions,
          price,
          state,
          category: {
            id_category,
            name: category_name
          },
          images: []
        };
        acc.push(product);
      }

      if (id_image) {
        product.images.push({
          id_image,
          content: image_content
        });
      }

      return acc;
    }, []);

    res.json({ product: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

module.exports = router; // Exporta el router
