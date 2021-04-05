const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require("path")
const router = jsonServer.router(path.join(__dirname, './util/db.json'))
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
	res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
	if (req.method === 'POST') {
		req.body.createdAt = Date.now()
	}
	// Continue to JSON Server router
	next()
})

// server.use((req, res, next) => {
// 	if (isAuthorized(req)) { // add your authorization logic here
// 		next() // continue to JSON Server router
// 	} else {
// 		res.sendStatus(401)
// 	}
// })

// 路由重定向
// Add this before server.use(router)
server.use(jsonServer.rewriter({
	'/dev-api/rabc/user/:id': '/user_one/:id', // 权宜之计
	'/dev-api/rabc/*': '/$1',

}))

// Use default router
server.use(router)
server.listen(9000, "127.0.0.1", () => {
	console.log('JSON Server is running')
})