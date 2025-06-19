const db = require('../dbConfig');

const updateUserGameStatsTransaction = (req, res) => {
  const { UserID, GameID, HoursPlayed, NumOfAchievements } = req.body;

  if (
    !UserID || !GameID ||
    HoursPlayed === undefined || NumOfAchievements === undefined
  ) {
    return res.status(400).json({ message: 'Missing required fields in request body' });
  }

  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Failed to start transaction' });
    }

    const updateTimeQuery = `
      UPDATE Time
      SET HoursPlayed = ?
      WHERE UserID = ? AND GameID = ?
    `;

    db.query(updateTimeQuery, [HoursPlayed, UserID, GameID], (err, result1) => {
      if (err || result1.affectedRows === 0) {
        console.error('Error updating Time:', err || 'No matching row');
        return db.rollback(() => {
          res.status(400).json({ message: 'Failed to update Time. Transaction rolled back.' });
        });
      }

      const updateAchievementsQuery = `
        UPDATE Achievements
        SET NumOfAchievements = ?
        WHERE UserID = ? AND GameID = ?
      `;

      db.query(updateAchievementsQuery, [NumOfAchievements, UserID, GameID], (err, result2) => {
        if (err || result2.affectedRows === 0) {
          console.error('Error updating Achievements:', err || 'No matching row');
          return db.rollback(() => {
            res.status(400).json({ message: 'Failed to update Achievements. Transaction rolled back.' });
          });
        }

        db.commit(err => {
          if (err) {
            console.error('Error committing transaction:', err);
            return db.rollback(() => {
              res.status(500).json({ message: 'Transaction commit failed. Rolled back.' });
            });
          }

          res.json({ message: 'User stats updated successfully (transaction committed).' });
        });
      });
    });
  });
};

module.exports = {
  updateUserGameStatsTransaction
};