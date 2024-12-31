const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Update if you have a password
    database: 'hospital_appoinments'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

// Route for home page (appointment booking form)
app.get('/', (req, res) => {
    res.render('index');
});

// API route to book appointment
app.post('/api/book-appointment', (req, res) => {
    const { name, email, number, date } = req.body;
    const query = 'INSERT INTO appointments (name, email,number, date) VALUES (?, ?, ?,?)';

    db.query(query, [name, email,number, date], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, message: 'Appointment booked successfully' });
    });
});

// Route for dashboard to view appointments
app.get('/dashboard', (req, res) => {
    const query = 'SELECT * FROM appointments';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Database error');
        }
        res.render('dashboard', { appointments: results });
    });
});

// Route to delete an appointment
app.post('/delete-appointment/:id', (req, res) => {
    const appointmentId = req.params.id;
    const query = 'DELETE FROM appointments WHERE id = ?';

    db.query(query, [appointmentId], (err, result) => {
        if (err) {
            console.error('Error deleting appointment:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/dashboard'); // Redirect back to dashboard after deletion
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
