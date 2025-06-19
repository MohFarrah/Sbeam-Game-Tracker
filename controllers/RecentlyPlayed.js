const db = require('../dbConfig');

// Fetch all available games for dropdown
const getAllGames = (req, res) => {
  const query = `
    SELECT GameID, Title 
    FROM Games 
    ORDER BY Title
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching games:', err);
      return res.status(500).send('Error fetching games');
    }
    res.json(results);
  });
};

// Get user details comparing selected game with users' most played game and genre
const getComparisonDetails = (req, res) => {
  const { GameID } = req.query;
  if (!GameID) return res.status(400).send('GameID is required');

  const query = `
    SELECT 
        u.UserID,
        u.Username,
        rp.GameID AS RecentlyPlayedGameID,
        rp.Title AS RecentlyPlayedTitle,
        mp.GameID AS MostPlayedGameID,
        mp.Title AS MostPlayedTitle,
        gmp.Name AS MostPlayedGenre,
        CASE 
            WHEN rp.GameID = mp.GameID THEN 'Yes'
            ELSE 'No'
        END AS SameGame,
        CASE 
            WHEN gmp.GenreID = grp.GenreID THEN 'Yes'
            ELSE 'No'
        END AS SameGenre
    FROM 
        Users u
    JOIN 
        UserGameStats s ON u.UserID = s.UserID
    JOIN 
        Games rp ON s.RecentlyPlayed = rp.GameID
    JOIN 
        Games mp ON s.MostPlayed = mp.GameID
    JOIN 
        Genre grp ON rp.GenreID = grp.GenreID
    JOIN 
        Genre gmp ON mp.GenreID = gmp.GenreID
    WHERE 
        s.RecentlyPlayed = ?
    ORDER BY 
        u.Username;
  `;

  db.query(query, [GameID], (err, results) => {
    if (err) {
        console.error('Error fetching comparison data:', err);
        return res.status(500).send('Error fetching comparison data');
    }
    res.json(results);
  });
};

module.exports = {
  getAllGames,
  getComparisonDetails
};