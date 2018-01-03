const fs = require('fs')
const request = require('request')
const crawler = require('./lib/crawler')

const url = 'http://webapi.http.zhimacangku.com/getip?num=25&type=2&pro=&city=0&yys=0&port=1&time=1&ts=1&ys=1&cs=1&lb=1&sb=0&pb=45&mr=2&regions='

const isAlive = async function(proxy)
{
    console.log(`[isAlive] testing proxy ${proxy}`)
    const music = await get('http://music.163.com', proxy)
    // console.log(music)
    const baidu = await get('http://www.baidu.com', proxy)
    // console.log(baidu)
    console.log(`[isAlive] proxy ${proxy} is alive`)
}

const get = function(url, proxy)
{
    return new Promise(function(resolve, reject)
    {
        request.get({ url: url, proxy: proxy, timeout: 5000 }, function(error, res, body)
        {
            if(error)
            {
                reject(error)
            }
            else
            {
                resolve(body)
            }
        })
    })
}

const proxyList = {}
let proxyNum = 0

const addProxy = async function(proxy)
{
    try
    {
        await isAlive(`${proxy.type}://${proxy.address}`)
        proxyList[proxy.address] = proxy.type
    }
    catch(e)
    {
        // console.log(e)
        console.log(`[isAlive] proxy ${`${proxy.type}://${proxy.address}`} is dead`)
    }
}

const loadDB = async function()
{
    try
    {
        console.log(`[init] reading ip list from db.json`)
        const db = JSON.parse(fs.readFileSync('./db1.json').toString())
        console.log(db)
        for(let proxy in db)
        {
            (async function()
            {
                await addProxy
                (
                    {
                        address: proxy,
                        type: db[proxy]
                    }
                )
            })()
        }
    }
    catch(e)
    {
        console.log(e)
    }
};


const guobanjia = async function()
{
    await crawler.guobanjia(function(list)
    {
        list.forEach(async function(proxy)
        {
            await addProxy(proxy)
        })
    })
}


const cnProxy = async function()
{
    try
    {
        const result = await crawler.cnProxy()
        result.forEach(async function(proxy)
        {
            await addProxy(proxy)
        })
    }
    catch(e)
    {
        console.log(e)
    }
};

const checkAlive = async function()
{
    let num = 0
    for(let address in proxyList)
    {
        num ++
        (async function()
        {
            const _proxy =
                {
                    address: address,
                    type: proxyList[address]
                }
            const proxy = JSON.parse(JSON.stringify(_proxy))
            delete proxyList[address]
            await addProxy(proxy)
        })()
    }
    proxyNum = num
    console.log(`[checkAlive] current alive proxy : ${num}`)
};

(async function()
{
    try
    {
        await loadDB()
        await cnProxy()
        // await guobanjia()
        await checkAlive()
    }
    catch(e)
    {
        console.log(e)
    }
})()

const _updateProxyList = setInterval(async function()
{
    try
    {
        await cnProxy()
        // await guobanjia()
    }
    catch(e)
    {
        console.log(e)
    }
}, 1000 * 120)

const _checkAlive = setInterval(async function()
{
    await checkAlive()
}, 1000 * 60)

const saveIps = function(e)
{
    console.log(e)
    console.log('[saveIps] writing ip list back to db.json')
    console.log(proxyList)
    setTimeout(function()
    {
        fs.writeFileSync('./db.json', JSON.stringify(proxyList))
        process.exit(0)
    }, 0)
}

process.on('uncaughtException', saveIps)
process.on('exit', saveIps)
process.on('SIGINT', saveIps)
process.on('SIGTERM', saveIps)