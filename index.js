import http from 'http';
import mysql from 'mysql2';

const db = mysql.createConnection({ host: "localhost", user: "root", database: "openapi", password: ""});
const app = express();

app.get('/users', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(results);

    });
});

app.listen(3000, () => console.log('server berjalan di http://localhost:3000'));


