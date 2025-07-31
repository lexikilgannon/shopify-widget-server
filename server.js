const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

// 📦 ScriptTag registration endpoint
app.post('/register-scripttag', async (req, res) => {
  try {
    const response = await axios.post(
      `https://${process.env.SHOPIFY_STORE_NAME}/admin/api/2024-04/script_tags.json`,
      {
        script_tag: {
          event: 'onload',
          src: 'https://shopify-widget-pn3n.onrender.com/checkout-plus-widget.js',
        },
      },
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).send("✅ ScriptTag registered successfully!");
  } catch (error) {
    console.error("❌ ScriptTag registration failed:", error.response?.data || error.message);
    res.status(500).send("❌ Failed to register ScriptTag");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
