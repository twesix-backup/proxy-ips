const request = require('request')

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
};

(async function()
{
    await isAlive('http://180.104.172.147:2837')
})()