var spreadsheet_url = "https://docs.google.com/spreadsheets/d/1WCLmdFnJGXXMq31mGSK6hExJIGGl1MONo9ENoiWco3k/pubhtml";

Tabletop.init({ 
    key: spreadsheet_url,
    callback: function(data, tabletop) { 
        console.log(data[getDayOfYear()])
        var entry = data[getDayOfYear()];
        document.querySelector('.container').innerHTML = '<h1>'+entry.title+'</h1>'+entry.content;
    },
    simpleSheet: true
});

function getDayOfYear() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day
}
