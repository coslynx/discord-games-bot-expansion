const { Game, GameSession } = require('../services/databaseService');
const { formatSuccessMessage, formatErrorMessage } = require('../utils/messageUtils');

const addGame = async (gameName, gameDescription, gameType) => {
  try {
    const existingGame = await Game.findOne({ where: { name: gameName } });
    if (existingGame) {
      throw new Error(`Game with name ${gameName} already exists!`);
    }

    const newGame = await Game.create({
      name: gameName,
      description: gameDescription,
      type: gameType,
    });

    return newGame;
  } catch (error) {
    console.error(`Error adding game: ${error.message}`);
    throw new Error(formatErrorMessage(`Error adding game: ${error.message}`));
  }
};

const removeGame = async (gameName) => {
  try {
    const game = await Game.findOne({ where: { name: gameName } });
    if (!game) {
      throw new Error(`Game with name ${gameName} not found!`);
    }

    await Game.destroy({ where: { name: gameName } });

    return true;
  } catch (error) {
    console.error(`Error removing game: ${error.message}`);
    throw new Error(formatErrorMessage(`Error removing game: ${error.message}`));
  }
};

const setGamePermissions = async (gameName, role) => {
  try {
    const game = await Game.findOne({ where: { name: gameName } });
    if (!game) {
      throw new Error(`Game with name ${gameName} not found!`);
    }

    // Implement logic to set permissions for the game based on the provided role
    // This might involve updating a database table or using a permissions management system
    // ...

    return true;
  } catch (error) {
    console.error(`Error setting game permissions: ${error.message}`);
    throw new Error(formatErrorMessage(`Error setting game permissions: ${error.message}`));
  }
};

module.exports = {
  addGame,
  removeGame,
  setGamePermissions,
};