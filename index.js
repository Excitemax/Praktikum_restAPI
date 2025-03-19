import http from 'http';
import mysql from 'mysql2';

const db = mysql.createConnection({ host: "localhost", user: "root", database: "openapi", password: ""});

const server = http.createServer((req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain '});
            res.end('Internal Server Error');
            return;
        }


    
    res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(results));
    })
});

server.listen(3000, () => console.log('server berjalan di http://localhost:3000'));


