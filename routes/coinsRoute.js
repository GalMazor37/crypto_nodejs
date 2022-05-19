const express = require('express');

const cryptoCoinsController = require('../controllers/cryptoCoins');

const router = express.Router();

router.get('/', cryptoCoinsController.getMain);

router.get('/coins', cryptoCoinsController.getCoins);
router.post('/coins', cryptoCoinsController.postCoins);

router.get('/coins/:symbol', cryptoCoinsController.getCoinInfoBySymbol);

router.get('/cachettl', cryptoCoinsController.getCachettl);
router.post('/cachettl', cryptoCoinsController.setCachettl);

module.exports = router;
