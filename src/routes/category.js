// src/routes/category.js
const express = require('express');
const pool = require('../db'); // Importa la conexión a la base de datos
const router = express.Router();

// Ruta para obtener productos por categoría y estado
router.get('/:state/:id', async (req, res) => {
  const categoryId = req.params.id;
  const productState = req.params.state; // Obtiene el estado desde la URL

  try {
    const result = await pool.query(`
      SELECT p.id_product, p.name, p.descriptions, p.price, p.state,
             c.id_category, c.name AS category_name,
             i.id_image, i.content AS image_content
      FROM products p
      LEFT JOIN categories c ON p.id_category = c.id_category
      LEFT JOIN images i ON p.id_product = i.id_product
      WHERE p.id_category = $1 AND p.state = $2  -- Filtra por estado
      ORDER BY p.id_product
    `, [categoryId, productState]); // Usa el estado y el ID de categoría en la consulta

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
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
  }
});

module.exports = router; // Exporta el router
