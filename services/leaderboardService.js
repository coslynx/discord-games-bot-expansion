const { Leaderboard } = require('../services/databaseService');
const { formatSuccessMessage, formatErrorMessage } = require('../utils/messageUtils');

const getLeaderboard = async (gameName) => {
  try {
    const leaderboardEntries = await Leaderboard.findAll({
      where: { gameId: gameName },
      order: [['score', 'DESC']],
    });

    return leaderboardEntries;
  } catch (error) {
    console.error(`Error getting leaderboard: ${error.message}`);
    throw new Error(formatErrorMessage(`Error getting leaderboard: ${error.message}`));
  }
};

module.exports = {
  getLeaderboard,
};