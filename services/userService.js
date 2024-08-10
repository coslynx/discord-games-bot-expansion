const { User, Leaderboard } = require('../services/databaseService');
const { formatSuccessMessage, formatErrorMessage } = require('../utils/messageUtils');

const getUser = async (userId) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error(`Error getting user: ${error.message}`);
    return null;
  }
};

const updateUser = async (userId, nickname, bio) => {
  try {
    await User.update(
      { nickname, bio },
      { where: { id: userId } }
    );
    return true;
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    return false;
  }
};

const getUserLeaderboardEntries = async (userId) => {
  try {
    const leaderboardEntries = await Leaderboard.findAll({
      where: { userId },
    });
    return leaderboardEntries;
  } catch (error) {
    console.error(`Error getting user leaderboard entries: ${error.message}`);
    return [];
  }
};

const createUser = async (userId) => {
  try {
    await User.create({
      id: userId,
    });
    return true;
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    return false;
  }
};

module.exports = {
  getUser,
  updateUser,
  getUserLeaderboardEntries,
  createUser,
};