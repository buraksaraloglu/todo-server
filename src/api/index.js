const express = require('express');

const todos = require('./todos');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - Working',
  });
});

router.use('/todos', todos);

module.exports = router;
