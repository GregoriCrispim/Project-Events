const express = require('express');

const router = express.Router();

router.get(['/', '/playground'], (req, res) => {
  res.render('ui/index', {
    appName: 'Gestão de Eventos',
    apiBaseHint: `${req.protocol}://${req.get('host')}`,
  });
});

module.exports = router;


