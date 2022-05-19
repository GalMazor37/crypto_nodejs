const request = require('postman-request');
const path = require('path');
const fs = require('fs');

const myCache = require('../app');

const myApiKey = 'f7088b3f2add0ebfad3e22460e35b1cd6030d87ba8e2d582ca73499d714bd21d';

const p = path.join(path.dirname(process.mainModule.filename), 'models', 'cachettl.json');

const dataBuffer = fs.readFileSync(p);
const dataJson = dataBuffer.toString();
const dataAuth = JSON.parse(dataJson);

const checkAndGetCache = (itemName) => {
    if (myCache.myCache.has(itemName)) {
        console.log('Found value in cache');
        const existCinCache = myCache.myCache.get(itemName);
        return existCinCache;
    } else {
        return undefined;
    }
};

const setCache = (itemName, item) => {
    myCache.myCache.set(itemName, item, dataAuth.cachettl);
};

const changeCachettl = (newCache, callback) => {
    if (dataAuth.admin_key == 123456){
        const updateCache = { cachettl: newCache, admin_key: dataAuth.admin_key };
        const updateCacheJson = JSON.stringify(updateCache);
        fs.writeFileSync(p, updateCacheJson);
    }
    else{
        console.log("Not Admin");
    }
    
    callback();
};

const getRequest = (callback) => {
    const url = 'https://min-api.cryptocompare.com/data/all/coinlist';
    const item = checkAndGetCache('allCoins');
    if (item) {
        callback(undefined, item);
    } else {
        console.log('new api request');
        request({ url, json: true }, (error, { body }) => {
            if (error) {
                console.log('error');
            } else {
                setCache('allCoins', body);
                callback(undefined, body);
            }
        });
    }
};
const getCoinUsd = (symbol, callback) => {
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=' + symbol + '&tsyms=USD';
    console.log('new api request');
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            console.log('error');
        } else {
            callback(undefined, body);
        }
    });
};

const getAllCoins = (callback) => {
    getRequest((error, data) => {
        if (error) {
            console.log('error');
        }
        callback(Object.values(data.Data).map((coin) => coin.CoinName));
    });
};
const getCoinsBySymbol = (symbol, callback) => {
    let symbolCache = 'symbol_' + symbol;
    let res;
    const itemExist = checkAndGetCache(symbolCache);
    if (itemExist) {
        callback(itemExist);
    } else {
        getRequest((error, data) => {
            if (error) {
                console.log('error');
            }
            res = Object.values(data.Data)
                .filter((coin) => {
                    return coin.Symbol == symbol;
                })
                .map((coin) => coin.CoinName);
            setCache(symbolCache, res);
            callback(res);
        });
    }
};

const getCoinsByAlgorithm = (algo, callback) => {
    let algoCache = 'algo_' + algo;
    let res;
    const itemExist = checkAndGetCache(algoCache);
    if (itemExist) {
        callback(itemExist);
    } else {
        getRequest((error, data) => {
            if (error) {
                console.log('error');
            }
            res = Object.values(data.Data)
                .filter((coin) => {
                    return coin.Algorithm == algo;
                })
                .map((coin) => coin.CoinName);
            setCache(algoCache, res);
            callback(res);
        });
    }
};

const getSpecificCoinInfoBySymbol = (symbol, callback) => {
    let spesymbolCache = 'speSymbol_' + symbol;
    let res;
    let finalRes;
    const itemExist = checkAndGetCache(spesymbolCache);
    if (itemExist) {
        callback(itemExist);
    } else {
        getRequest((error, data) => {
            if (error) {
                console.log('error');
            }
            res = Object.values(data.Data).find((coin) => {
                return coin.Symbol == symbol;
            });
            getCoinUsd(symbol, (error, data) => {
                finalRes = { id: res.Id, symbol: res.Symbol, name: res.CoinName, algorithm: res.Algorithm, toUSD: data.USD };
                setCache(spesymbolCache, finalRes);
                callback(finalRes);
            });
        });
    }
};

exports.getAllCoins = getAllCoins;
exports.getCoinsBySymbol = getCoinsBySymbol;
exports.getCoinsByAlgorithm = getCoinsByAlgorithm;
exports.getSpecificCoinInfoBySymbol = getSpecificCoinInfoBySymbol;
exports.changeCachettl = changeCachettl;
