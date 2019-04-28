const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const assets = path.join(__dirname, '../assets');

const geojson = JSON.parse(fs.readFileSync(path.join(assets, 'geo', 'geo.json')));
router.get('/geo/search', function (req, res) {
  let result = geojson.filter((value) => value.displayName.includes(req.query.q));
  console.debug(`geo/search q=${req.query.q}, res=${JSON.stringify(result)}`);
  res.json(result);
});

module.exports = router;