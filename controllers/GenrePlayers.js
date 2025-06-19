// Step 1: Import Required Libraries
const db = require('../dbConfig');

// Step 2: Define Controller Functions

// Fetch all available genres
const getAllGenres = (req, res) => {
    const query = `
        SELECT GenreID, Name 
        FROM Genre 
        ORDER BY Name
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching genres:', err);
            res.status(500).send('Error fetching genres');
        } else {
            res.json(results);
        }
    });
};

// Fetch game ranking details for selected game
const getGenrePlayerDetails = (req, res) => {
    console.log("getting details for genre");
    const { GenreID } = req.query;
    if (!GenreID) {
        return res.status(400).send('GenreID is required');
    }

    const query = `
        SELECT
            u.Username,
            ROUND(SUM(t.HoursPlayed), 0) AS TotalHours,
            COUNT(DISTINCT t.GameID) AS TotalGames,
            SUM(COALESCE(a.NumOfAchievements)) AS AchievementsEarned,
            SUM(COALESCE(a.TotalAchievements)) AS TotalAchievements
        FROM Users u
        JOIN Time t ON u.UserID = t.UserID
        LEFT JOIN Achievements a ON a.UserID = t.UserID AND a.GameID = t.GameID
        WHERE t.GameID IN (
            SELECT g.GameID
            FROM Games g
            JOIN Genre ge ON g.GenreID = ge.GenreID
            WHERE ge.GenreID = ?
        )
        GROUP BY u.UserID, u.Username
        ORDER BY Username ASC;
    `;
    db.query(query, [GenreID], (err, results) => {
        if (err) {
            console.error('Error fetching genre playerbase details:', err);
            res.status(500).send('Error retrieving genre playerbase details');
        } else {
            res.json(results);
        }
    });
};

// Step 3: Export the Controller Functions
module.exports = {
    getAllGenres,
    getGenrePlayerDetails
};
