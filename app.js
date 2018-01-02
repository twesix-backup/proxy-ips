const fs = require('fs')
const request = require('request')

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

const ips = {}

const addIp = async function(proxy, type)
{
    try
    {
        await isAlive(`${type}://${proxy}`)
        ips[proxy] = type
    }
    catch(e)
    {
        console.log(e)
    }
}
try
{
    console.log(`[init] reading ip list from db.json`)
    const db = JSON.parse(fs.readFileSync('./db1.json').toString())
    console.log(db)
    for(let proxy in db)
    {
        (async function()
        {
            await addIp(proxy, db[proxy])
        })()
    }
}
catch(e)
{
    console.log(e)
}

// const watchNumbers = setInterval(async function()
// {
//     if(ips.length < 50)
//     {
//         console.log('[interval] getting more ip')
//
//         const result = JSON.parse(await get(url))
//         result.data.forEach(async function(e)
//         {
//
//         })
//     }
// }, 1000 * 60)
//
// const checkAlive = setInterval(async function()
// {
//     await addIp(ips.pop())
// }, 1000)

const saveIps = function()
{
    console.log('[saveIps] writing ip list back to db.json')
    console.log(ips)
    fs.writeFileSync('./db.json', JSON.stringify(ips))
}
process.on('uncaughtException', saveIps)
process.on('exit', saveIps)