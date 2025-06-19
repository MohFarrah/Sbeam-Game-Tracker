// Step 1: Import Required Libraries
const express = require('express');
const app = express();
const path = require('path');

// Step 2: Import Controllers
const rankingController = require('./controllers/GameRanking');
const userStatsController = require('./controllers/UserStats');
const genrePlayersController = require('./controllers/GenrePlayers');
const genreGameStatsController = require('./controllers/GenreGameStats');
const recentlyPlayedController = require('./controllers/RecentlyPlayed');
const playerCountController = require('./controllers/PlayerCount');
const transactionController = require('./controllers/UpdateUserGameStat');

// Step 3: Middleware Setup
app.use(express.json());
app.use(express.static('public'));

// Step 4: Define Routes

// Serve Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});

// User Stats Routes
app.get('/UserStats/users', userStatsController.getAllUsers);
app.get('/UserStats/details', userStatsController.getUserStats);

// Game Ranking Routes
app.get('/GameRanking', rankingController.getAllGames);
app.get('/GameRanking/details', rankingController.getRankingDetails);

// Genre playerbase stats
app.get('/GenrePlayers/genres', genrePlayersController.getAllGenres);
app.get('/GenrePlayers/details', genrePlayersController.getGenrePlayerDetails);

// Genre game stats
app.get('/GenreGames/genres', genreGameStatsController.getAllGenres);
app.get('/GenreGames/details', genreGameStatsController.getGenreGameStats);

// RecentlyPlayed
app.get('/RecentlyPlayed', recentlyPlayedController.getAllGames);
app.get('/RecentlyPlayed/details', recentlyPlayedController.getComparisonDetails);

// PlayerCount
app.get('/PlayerCount/details', playerCountController.getGamesByPlayerCount);

// Update User Game Stats Transaction
app.post('/UpdateUserStats', transactionController.updateUserGameStatsTransaction);

// Step 5: Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
