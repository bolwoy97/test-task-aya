const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { dbName } = require('./utils/constants');
const app = express();
const port = 3000;

app.get('/calculate-rewards', (req, res) => {
  const db = new sqlite3.Database(dbName);
  const query = `
    SELECT id, name, surname, donationsSum, totalDonations,
    CASE
    WHEN SUM(donationsSum) > 100 THEN
      100 * SUM(donationsSum) * 100 / totalDonations
    ELSE 0
    END AS oneTimeReward
    FROM (SELECT employees.id, employees.name, employees.surname,
    SUM(donations.amount) AS donationsSum,
    (SELECT SUM(donations.amount) FROM donations) AS totalDonations
    FROM employees
    LEFT JOIN donations ON employees.id = donations.employee_id
    GROUP BY employees.id
    HAVING donationsSum > 100) 
    GROUP BY id
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error calculating rewards: ', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });

  db.close();
});

app.get('/calculate-total', (req, res) => {
  const db = new sqlite3.Database(dbName);
  const query = `
    SELECT SUM(donations.amount) AS totalDonations FROM donations;
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error calculating rewards: ', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });

  db.close();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

