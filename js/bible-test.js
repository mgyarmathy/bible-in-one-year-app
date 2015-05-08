// Dependencies
var EnBible = require("bible-english");

// Get verse
EnBible.getVerse("Matthew 1:1", function (err, data) {
    console.log(err || data);
});
