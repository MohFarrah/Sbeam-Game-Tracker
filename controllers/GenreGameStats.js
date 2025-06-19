const db = require('../dbConfig');

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

// Fetch games in a genre with total hours and player count
const getGenreGameStats = (req, res) => {
  const { GenreID } = req.query;
  if (!GenreID) {
    return res.status(400).send('GenreID is required');
  }

  const query = `
    SELECT 
      g.Title,
      COUNT(DISTINCT t.UserID) AS TotalNumOfPlayers,
      COALESCE(SUM(t.HoursPlayed), 0) AS TotalHours
    FROM Games g
    LEFT JOIN Time t ON g.GameID = t.GameID
    WHERE g.GenreID = ?
    GROUP BY g.GameID, g.Title
    ORDER BY TotalHours DESC
  `;

  db.query(query, [GenreID], (err, results) => {
    if (err) {
      console.error('Error fetching genre game stats:', err);
      res.status(500).send('Error fetching game stats');
    } else {
      res.json(results);
    }
  });
};

module.exports = {
  getAllGenres,
  getGenreGameStats
};
