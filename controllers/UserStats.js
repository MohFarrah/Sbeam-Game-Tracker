const db = require('../dbConfig');

// Fetch all users
const getAllUsers = (req, res) => {
    const query = `SELECT UserID, Username FROM Users ORDER BY Username`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Error fetching users');
        } else {
            res.json(results);
        }
    });
};

// Fetch selected user's stats
const getUserStats = (req, res) => {
    const { UserID } = req.query;
    if (!UserID) return res.status(400).send('UserID is required');

    const query = `
        SELECT 
            u.Username,
            (SELECT Title FROM Games WHERE GameID = s.RecentlyPlayed) AS RecentlyPlayedGame,
            (SELECT Title FROM Games WHERE GameID = s.MostPlayed) AS MostPlayedGame,
            COALESCE(SUM(t.HoursPlayed), 0) AS TotalHours,
            COALESCE(SUM(a.NumOfAchievements), 0) AS TotalAchievements
        FROM Users u
        LEFT JOIN Time t ON u.UserID = t.UserID
        LEFT JOIN Achievements a ON u.UserID = a.UserID
        LEFT JOIN UserGameStats s ON u.UserID = s.UserID
        WHERE u.UserID = ?
        GROUP BY u.UserID
    `;
    db.query(query, [UserID], (err, results) => {
        if (err) {
            console.error('Error fetching user stats:', err);
            res.status(500).send('Error fetching user stats');
        } else {
            res.json(results[0]);
        }
    });
};

module.exports = {
    getAllUsers,
    getUserStats,
};
