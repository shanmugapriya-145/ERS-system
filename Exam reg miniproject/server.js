const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'exam_database'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Student login route
app.post('/student/login', (req, res) => {
    const { id, password, name, age, sex, course, userID } = req.body;

    if (id && password && name && age && sex && course) {
        // New registration
        const sql = 'INSERT INTO students (id, password, name, age, sex, course) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(sql, [id, password, name, age, sex, course], (err, result) => {
            if (err) {
                console.error('Error inserting data: ' + err.message);
                res.status(500).send('Error registering user');
                return;
            }
            console.log('New student record created with ID ' + result.insertId);
            res.status(200).send('Registration successful');
        });
    } else if (userID && password) {
        // Existing user login
        const sql = 'SELECT * FROM students WHERE id = ? AND password = ?';
        connection.query(sql, [userID, password], (err, result) => {
            if (err) {
                console.error('Error querying data: ' + err.message);
                res.status(500).send('Error logging in');
                return;
            }
            if (result.length > 0) {
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
    } else {
        res.status(400).send('Invalid request');
    }
});

// Exam controller login route
app.post('/exam-controller/login', (req, res) => {
    const { loginID, password } = req.body;

    if (loginID && password) {
        // Validate exam controller login
        const sql = 'SELECT * FROM exam_controllers WHERE login_id = ? AND password = ?';
        connection.query(sql, [loginID, password], (err, result) => {
            if (err) {
                console.error('Error querying data: ' + err.message);
                res.status(500).send('Error logging in');
                return;
            }
            if (result.length > 0) {
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
    } else {
        res.status(400).send('Invalid request');
    }
});

app.listen(port, () => {
    console.log("Server is listening on port ${port}");
});
