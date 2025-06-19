// Step 1: Import Required Libraries
const db = require('../dbConfig');

// Step 2: Define Controller Functions

// Fetch all available games
const getAllGames = (req, res) => {
    const query = `
        SELECT GameID, Title 
        FROM Games 
        ORDER BY Title
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching games:', err);
            res.status(500).send('Error fetching games');
        } else {
            res.json(results);
        }
    });
};

// Fetch game ranking details for selected game
const getRankingDetails = (req, res) => {
    const { GameID } = req.query;
    if (!GameID) {
        return res.status(400).send('GameID is required');
    }

    const query = `
        SELECT 
            u.Username,
            COALESCE(t.HoursPlayed, 0) AS HoursPlayed,
            COALESCE(a.NumOfAchievements, 0) AS Achievements,
            COALESCE(a.TotalAchievements, 0) AS TotalAchievements
        FROM Users u
        LEFT JOIN Time t ON u.UserID = t.UserID AND t.GameID = ?
        LEFT JOIN Achievements a ON u.UserID = a.UserID AND a.GameID = ?
        WHERE t.GameID IS NOT NULL OR a.GameID IS NOT NULL
        ORDER BY HoursPlayed DESC
    `;
    db.query(query, [GameID, GameID], (err, results) => {
        if (err) {
            console.error('Error fetching game ranking details:', err);
            res.status(500).send('Error retrieving game ranking details');
        } else {
            res.json(results);
        }
    });
};

// Step 3: Export the Controller Functions
module.exports = {
    getAllGames,
    getRankingDetails
};
