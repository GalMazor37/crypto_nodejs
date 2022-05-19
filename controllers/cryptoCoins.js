const coinsModel = require('../models/coinsModel');

exports.getMain = (req, res) => {
    res.render('crypto/main', {
        pageTitle: 'Crypto',
        path: '/',
    });
};

const getCoinsShare = (coinSym, coinAlgo, res) => {
    const callbackFun = (data) => {
        res.render('crypto/coins', {
            coinsList: data,
            coinDetails: undefined,
            pageTitle: 'All Coins',
            path: '/coins',
        });
    };

    if (coinSym) {
        coinsModel.getCoinsBySymbol(coinSym, callbackFun);
    } else if (coinAlgo) {
        coinsModel.getCoinsByAlgorithm(coinAlgo, callbackFun);
    } else {
        coinsModel.getAllCoins(callbackFun);
    }
};

exports.getCoins = (req, res) => {
    const coinSym = req.query.symbol;
    const coinAlgo = req.query.algorithm;

    getCoinsShare(coinSym, coinAlgo, res);
};

exports.postCoins = (req, res) => {
    const coinSym = req.body.symbols;
    const coinAlgo = req.body.algo;
    getCoinsShare(coinSym, coinAlgo, res);
};

exports.getCoinInfoBySymbol = (req, res) => {
    const coinSym = req.params.symbol;
    coinsModel.getSpecificCoinInfoBySymbol(coinSym, (data) => {
        res.render('crypto/coins', {
            coinDetails: data,
            coinsList: undefined,
            pageTitle: coinSym,
            path: '/coins',
        });
    });
};

exports.getCachettl = (req, res) => {
    res.render('crypto/cachettl', {
        pageTitle: 'cachettl',
        path: '/cachettl',
    });
};

exports.setCachettl = (req, res) => {
    const newCache = req.body.cachettlUpdate;
    coinsModel.changeCachettl(newCache, () => {
        res.redirect('/');
    });
};
