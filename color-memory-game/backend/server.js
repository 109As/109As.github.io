const express = require('express');
const cors = require('cors');
const { saveScore, getTopScores, getHighScore } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/scores', async (req, res) => {
    try {
        const { player_name, score, level } = req.body;
        
        if (!player_name || score === undefined || level === undefined) {
            return res.status(400).json({ error: '缺少必要参数' });
        }
        
        const result = await saveScore(player_name, score, level);
        res.status(201).json({ success: true, id: result.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/scores', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const scores = await getTopScores(limit);
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/highscore', async (req, res) => {
    try {
        const highScore = await getHighScore();
        res.json({ high_score: highScore });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});