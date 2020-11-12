const express = require('express')
  , router = express.Router(),
  { sendJSON } = require('../helpers/helper.js'),
  categoryViseQuery = require('./categoryViseQuery.js');

router.use('/topCategoryInCity', categoryViseQuery)

router.get('/test', (req, res) => {
  return res.status(200).json(sendJSON("working"));
})

module.exports = router
