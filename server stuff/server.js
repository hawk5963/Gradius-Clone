var path = require('path');
var url = require('url');
var express = require('express');
var sqlite3 = require('sqlite3');

var app = express();
var port = 8006;

var db_filename = path.join(__dirname, 'db', 'imdb.sqlite3');
var public_dir = path.join(__dirname, 'public');

var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});

app.use(express.static(public_dir));

app.get('/Titles', (req, res) => {
    var req_url = url.parse(req.url);
    var query = decodeURI(req_url.query).replace(/\*/g, '%');
    db.all('SELECT * FROM Titles WHERE primary_title LIKE ?', [query], (err, rows) => {
        if (err) {
            console.log(err);
        }
        else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(rows));
            res.end();
        }
    });
});

app.get('/Names', (req, res) => {
    var req_url = url.parse(req.url);
    var query = decodeURI(req_url.query).replace(/\*/g, '%');
    db.all('SELECT * FROM Names WHERE primary_name LIKE ?', [query], (err, rows) => {
        if (err) {
            console.log(err);
        }
        else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(rows));
            res.end();
        }
    });
});

app.get('/titles/:tconst', (req, res) => {
    console.log(req.params);
    db.get('SELECT * FROM Titles WHERE tconst = ?', [req.params.tconst], (err, row) => {
        if (err) {
            console.log(err);
        }
        else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(row));
            res.end();
        }
    });
});

app.get('/names/:nconst', (req, res) => {
    console.log(req.params);
    db.get('SELECT * FROM Names WHERE nconst = ?', [req.params.nconst], (err, row) => {
        if (err) {
            console.log(err);
        }
        else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(row));
            res.end();
        }
    });
});

var server = app.listen(port);

