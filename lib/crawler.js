const puppeteer = require('puppeteer')

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

const guobanjia = async function(handler)
{
    
    let pageNum = 1
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    
    async function onePage()
    {
        try
        {
            const url = `http://www.goubanjia.com/index${pageNum}.shtml`
            console.log(`[guobanjia] crawling page : ${url}`)
            await page.goto(url)
    
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
        await onePage(pageNum)
    }
    
    await onePage(pageNum)
    await browser.close()
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