/**
 * A simple script to download photos from photo.weibo.com 
 **/

var express = require('express')

var app = express()

var bodyParser = require('body-parser')

var request = require('request')

var fs = require('fs')

var path = require('path')

var username = ''

var downloadPath = process.env.HOME + '/images/'

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var port = 3000
app.listen(port, function(){
	console.log('server is running on http://%s:%s', 'localhost', port)
})

app.get('/image_url', function(req, res, next) {
	var query = req.query;
	if(query) {
		try{
			var imageUrls = query.urls && query.urls.split(';')
			username = query.username || 'downloads'
			downloadImage(imageUrls, function(filename) {
				console.log(filename + ' download finished')
			})
		} catch(e) {
			console.log(e)
		}
	}
	res.setHeader('Content-Type','application/x-javascript')
	res.jsonp({'code': 0})
})

function downloadImage(urls, callback) {
	if(fs.exists(downloadPath + username, function(exist) {
		if(!exist) {
			fs.mkdir(downloadPath + username, function(err) {
				if(!err) {
					doDownload()
				} else {
					console.log(err)
				}
			})
		} else {
			doDownload()
		}
	}))

	function doDownload() {
		var prefix = downloadPath + username + '/' + username + '_'
		urls.forEach(function(item, index, arr) {
			(function(item, index) {
				var filename = prefix + path.basename(item)
				request(item).pipe(fs.createWriteStream(filename)).on('close', function() {
					callback && callback(filename)
				})
			})(item, index)
		})
	}
}
