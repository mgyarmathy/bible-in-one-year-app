var Crawler = require('crawler');

var Scripture = function(address, url) {
    this.address = address;
    this.url = url;
}

var Entry = function(date, title, content, scripture) {
    this.date = date;
    this.title = title;
    this.content = content;
    this.scripture = scripture;
};

var c = new Crawler({
"maxConnections": 50,
'cache': true,
'skipDuplicates': true,

'callback': function(error, result, $) {
    c.queue($('.article-next').attr('href'));
    var y = parseInt($('.entry-date .year').text());
    var m = parseInt($('.entry-date .month').text()) - 1;
    var d = parseInt($('.entry-date .day').text()) + 1;
    var $d = new Date(y, m, d);
    var $title = $('.entry-title').text();
    var $content = $('.post-content').html();
    var $scriptureAddress = $('#bible-in-a-year-box a').attr('title');
    var $scriptureUrl = $('#bible-in-a-year-box a').attr('href');
    var entry = new Entry($d, $title, $content, new Scripture($scriptureAddress, $scriptureUrl));
    console.log(JSON.stringify(entry));
},
'onDrain': function() { process.exit(0) }
});

c.queue('http://utmost.org/let-us-keep-to-the-point/');