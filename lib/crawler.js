const request = require('request')
request.debug = true
const headers =
{
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
}
const cheerio = require('cheerio')

const get = function(url)
{
    return new Promise(function(resolve, reject)
    {
        request.get(url, function(error, res, body)
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

const cnProxy = async function()
{
    const _headers = headers
    _headers.Host = 'cn-proxy.com'
    try
    {
        const page = await get
        (
            {
                url: 'http://cn-proxy.com/',
                headers: _headers
            }
        )
        const $ = cheerio.load(page)
        console.log($('.sortable').html())
    }
    catch(e)
    {
        console.log(e)
    }
};

const guobanjia = async function()
{
    const list = []
    try
    {
        const page = await get
        (
            {
                url: 'http://www.goubanjia.com/',
                headers: headers
            }
        )
        const $ = cheerio.load(page)
        const tds = $('.ip')
        tds.each(function()
        {
            const $tr = $(this)
            const type = $tr.next().next().text()
            $tr.children().each(function()
            {
                const style = $(this).prop('style')
                if(style.display === 'none')
                {
                    $(this).text('')
                }
            })
            list.push
            (
                {
                    proxy: $tr.text(),
                    type: type
                }
            )
        })
    }
    catch(e)
    {
        console.log(e)
    }
    return list
};

(async function()
{
    // await cnProxy()
    console.log(await guobanjia())
})()