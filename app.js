const proxy = require('./lib/proxy')
const express = require('express')
const port = 5000

const app = express()

app.get('/all', async function(req, res)
{
    res.send(await proxy.getProxyList())
})
app.get('/', async function(req, res)
{
    res.send('boom ! ! ! ')
})

app.listen(port, function()
{
    console.log(`server running @ http://localhost:${port}`);
})