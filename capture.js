var casper = require('casper').create();

casper.options.viewportSize = { width: 1200, height: 800 };

var urls = ['http://amazon.com', 'http://phantomjs.org', "http://net.tutsplus.com", "http://casperjs.com"];

casper.start();
casper.each(urls, function(self, url, i) {
	casper.wait(5000, function() {
		casper.thenOpen(url, function() {
		    this.capture('screenshots/' + url.replace('http://', '') + '.png');
		});
	})
})

casper.run();

