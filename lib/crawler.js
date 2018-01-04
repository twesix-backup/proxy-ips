const puppeteer = require('puppeteer')

const sleep = function(ms)
{
    return new Promise(function(resolve)
    {
        setTimeout(function()
        {
            resolve()
        }, ms)
    })
}

const options =
    {
        args:
            [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
    }
    
const _browser = puppeteer.launch(options)

const cnProxy = async function()
{
    const url = 'http://cn-proxy.com/'
    console.log(`[cnProxy] crawling page : ${url}`)
    
    const browser = await _browser
    const page = await browser.newPage()
    await page.goto(url)
    console.log(`[cnProxy] done crawl page : ${url}`)
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
    return result
};

const guobanjia = async function(handler)
{
    
    let pageNum = 1
    const browser = await _browser
    const page = await browser.newPage()
    
    async function onePage()
    {
        try
        {
            const url = `http://www.goubanjia.com/index${pageNum}.shtml`
            console.log(`[guobanjia] crawling page : ${url}`)
            await page.goto(url)
            console.log(`[guobanjia] done crawl page : ${url}`)
            const list = await page.evaluate(function()
            {
                const list = []
                const tds = document.querySelectorAll('.ip')
                tds.forEach(function(td)
                {
                    const address = td.innerText
                    const type = td.nextSibling.nextSibling.nextSibling.nextSibling.innerText
                    list.push
                    (
                        {
                            address: address,
                            type: type === 'http,https' ? 'http' : 'https'
                        }
                    )
                })
                return list
            })
            handler(list)
            
            if(pageNum < 10)
            {
                pageNum ++
            }
            else
            {
                return
            }
        }
        catch(e)
        {
            console.log(e)
        }
        await sleep(5000)
        await onePage(pageNum)
    }
    await onePage(pageNum)
};

(async function()
{
    // await cnProxy()
    // await guobanjia(function(list)
    // {
    //     console.log(list)
    // })
})()

module.exports.guobanjia = guobanjia
module.exports.cnProxy = cnProxy