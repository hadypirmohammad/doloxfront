// TLS bypass for all server-side fetches (getServerSideProps, etc.)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const https = require('https')
const http = require('http')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// TLS bypass agent for local development
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    
    // Proxy /api/backend/* to https://localhost:7165/* with TLS bypass
    if (parsedUrl.pathname?.startsWith('/api/backend/')) {
      const targetPath = parsedUrl.pathname.replace('/api/backend', '')
      const targetUrl = `https://localhost:7165${targetPath}${parsedUrl.search || ''}`
      
      const proxyReq = https.request(targetUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          host: 'localhost:7165',
          'x-forwarded-for': req.socket.remoteAddress,
          'x-forwarded-proto': 'https'
        },
        agent: httpsAgent
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        proxyRes.pipe(res)
      })
      
      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err.message)
        res.writeHead(502)
        res.end('Bad Gateway')
      })
      
      req.pipe(proxyReq)
      return
    }
    
    // Proxy /chatHub/* to https://localhost:7165/chatHub/* with TLS bypass
    if (parsedUrl.pathname?.startsWith('/chatHub/')) {
      const targetPath = parsedUrl.pathname
      const targetUrl = `https://localhost:7165${targetPath}${parsedUrl.search || ''}`
      
      const proxyReq = https.request(targetUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          host: 'localhost:7165',
          'x-forwarded-for': req.socket.remoteAddress,
          'x-forwarded-proto': 'https',
          'upgrade': req.headers.upgrade,
          'connection': req.headers.connection
        },
        agent: httpsAgent
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        proxyRes.pipe(res)
      })
      
      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err.message)
        res.writeHead(502)
        res.end('Bad Gateway')
      })
      
      req.pipe(proxyReq)
      return
    }
    
    handle(req, res, parsedUrl)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})