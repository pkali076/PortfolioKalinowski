// function requireHTTPS(req, res, next){
//     if(!req.secure && req.get('x-forwarded-photo') !== 'https'){
//         return res.redirect('https://' + req.get('host') + req.url);
//     }
//     next();
// }

// const express = require('express');
// const app = express();

// app.use(requireHTTPS);
// app.use(express.static('./dist/port-folio-kalinowski.json'));

// app.get('/*', (req, res) =>
//     res.sendFile('index.html', {root: 'dist/port-folio-kalinowski/'}),
// );

// app.get('/*', function(req, res) {
//     res.sendFile('index.html', {root:'dist/port-folio-kalinowski.json'});
// });

// app.listen(process.env.PORT || 8080);


/*new test */
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/port-folio-kalinowski'));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname+
        '/dist/port-folio-kalinowski/index.html'));
});
app.listen(process.env.PORT || 8080);