const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const assets = path.join(__dirname, '../assets');

router.get('/czml', function (req, res) {
  var mergedCzml = JSON.parse(fs.readFileSync(path.join(assets, 'sample.czml')));
  res.json(mergedCzml);
});

module.exports = router;