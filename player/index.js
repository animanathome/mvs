var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    express = require('express');

var app = express();
// var server = http.createServer(app);

app.set('port', 8888);

app.get('/*', function (req, res) {
	console.log('request', decodeURIComponent(req.url))

	// '/Users/manu/Code/mvs/player/../download/Split\ \(2016\)\ \[YTS.AG\]/Split.2016.720p.BluRay.x264-\[YTS.AG\].mp4'
	var file = __dirname+'/../download'+decodeURIComponent(req.url)
    console.log('looking for', file)
    fs.stat(file, function(err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          // 404 Error if file not found
          return res.sendStatus(404);
        }
      res.end(err);
      }
      var range = req.headers.range;
      if (!range) {
		// 416 Wrong range
		return res.sendStatus(416);
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      });

      var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
          stream.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    });
})


app.listen(app.get('port'), function (){
  console.log('Player Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;