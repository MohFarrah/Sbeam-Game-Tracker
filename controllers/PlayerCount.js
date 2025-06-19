// controllers/PlayerCount.js
const db = require('../dbConfig');

const getGamesByPlayerCount = (req, res) => {
  const minPlayers = parseInt(req.query.playerCount, 10);

  if (!minPlayers || minPlayers < 1) {
    return res.status(400).send('Valid playerCount query parameter is required');
  }

  const query = `
    SELECT 
      g.Title, 
      COUNT(DISTINCT t.UserID) AS NumPlayers
    FROM Games g
    JOIN Time t ON g.GameID = t.GameID
    GROUP BY g.GameID, g.Title
    HAVING COUNT(DISTINCT t.UserID) >= ?
    ORDER BY NumPlayers DESC, g.Title
  `;

  db.query(query, [minPlayers], (err, results) => {
    if (err) {
      console.error('Error fetching games by min players:', err);
      return res.status(500).send('Error fetching games');
    }
    res.json(results);
  });
};

module.exports = {
  getGamesByPlayerCount
};
