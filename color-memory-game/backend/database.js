const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'game.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT NOT NULL,
        score INTEGER NOT NULL,
        level INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
});

const saveScore = (playerName, score, level) => {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO scores (player_name, score, level) VALUES (?, ?, ?)',
            [playerName, score, level],
            function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};

const getTopScores = (limit = 10) => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM scores ORDER BY score DESC LIMIT ?',
            [limit],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
};

const getHighScore = () => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT MAX(score) as high_score FROM scores',
            (err, row) => {
                if (err) reject(err);
                else resolve(row ? row.high_score : 0);
            }
        );
    });
};

module.exports = {
    saveScore,
    getTopScores,
    getHighScore
};