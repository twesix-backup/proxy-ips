const request = require('request')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

// request.debug = true
const headers =
{
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
}

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
    const url = 'http://cn-proxy.com/'
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const result = await page.evaluate(function()
    {
        const list = []
        const trs = document.querySelectorAll('.sortable>tbody>tr')
        trs.forEach(function(tr)
        {
            const tds = tr.querySelectorAll('td')
            const address = tds[0].innerText + ':' + tds[1].innerText
            const type = 'http'
            list.push
            (
                {
                    address: address,
                    type: type
                }
            )
        })
        return list
    })
    await browser.close()
    return result
};

const guobanjia = function(handler)
{
    
    let pageNum = 1
    
    async function page(pageNum)
    {
        const list = []
        try
        {
            const url = `http://www.goubanjia.com/free/index${pageNum}.shtml`
            console.log(`[guobanjia] crawling page : ${url}`)
            const page = await get
            (
                {
                    url: url,
                    headers: headers
                }
            )
            const $ = cheerio.load(page)
            const tds = $('.ip')
            tds.each(function()
            {
                const $tr = $(this)
                let type = $tr.next().next().text()
                if(type === 'http,https')
                {
                    type = 'https'
                }
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
    }
    
    const interval = setInterval( async function()
    {
        try
        {
            const result = await page(pageNum ++)
            handler(result)
        }
        catch(e)
        {
            console.log(e)
            clearInterval(interval)
        }
    }, 2000)
};

(async function()
{
    // await cnProxy()
    // guobanjia(function(proxy)
    // {
    //     console.log(proxy)
    // })
})()

module.exports.guobanjia = guobanjia
module.exports.cnProxy = cnProxy