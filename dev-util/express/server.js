let express = require('express');
let app = express();
app.post('/download', function (req, res, next) {
	res.setHeader('Content-Type', 'application/vnd.ms-excel');
	res.write("123456");
	res.end();
});
