const { Game, GameSession } = require('./databaseService');
const { User } = require('../services/userService');
const { formatSuccessMessage, formatErrorMessage } = require('../utils/messageUtils');
const { shuffle } = require('../utils/utils');
const { Leaderboard } = require('../services/databaseService');
const messageUtils = require('../utils/messageUtils');
const logger = require('../utils/logger');

const getGame = async (gameName) => {
  try {
    const game = await Game.findOne({ where: { name: gameName } });
    if (!game) {
      return null;
    }
    return game;
  } catch (error) {
    console.error(`Error getting game: ${error.message}`);
    throw new Error(formatErrorMessage(`Error getting game: ${error.message}`));
  }
};

const getAvailableGames = async () => {
  try {
    const games = await Game.findAll();
    return games;
  } catch (error) {
    console.error(`Error getting available games: ${error.message}`);
    throw new Error(formatErrorMessage(`Error getting available games: ${error.message}`));
  }
};

const createGameSession = async (game, user) => {
  try {
    const existingSession = await GameSession.findOne({
      where: { gameId: game.name, status: 'active' },
    });
    if (existingSession) {
      throw new Error(`A game session for ${game.name} is already active!`);
    }
    const session = await GameSession.create({
      gameId: game.name,
      players: [user.id],
    });
    await session.save();
    return session;
  } catch (error) {
    console.error(`Error creating game session: ${error.message}`);
    throw new Error(formatErrorMessage(`Error creating game session: ${error.message}`));
  }
};

const joinGameSession = async (game, user) => {
  try {
    const session = await GameSession.findOne({
      where: { gameId: game.name, status: 'active' },
    });
    if (!session) {
      return null;
    }
    if (session.players.length >= game.maxPlayers) {
      return null;
    }
    session.players.push(user.id);
    await session.save();
    return session;
  } catch (error) {
    console.error(`Error joining game session: ${error.message}`);
    throw new Error(formatErrorMessage(`Error joining game session: ${error.message}`));
  }
};

const leaveGameSession = async (gameName, user) => {
  try {
    const session = await GameSession.findOne({
      where: { gameId: gameName, status: 'active' },
    });
    if (!session) {
      return null;
    }
    const playerIndex = session.players.indexOf(user.id);
    if (playerIndex === -1) {
      return null;
    }
    session.players.splice(playerIndex, 1);
    await session.save();
    return session;
  } catch (error) {
    console.error(`Error leaving game session: ${error.message}`);
    throw new Error(formatErrorMessage(`Error leaving game session: ${error.message}`));
  }
};

const loadGames = async () => {
  try {
    const games = await Game.findAll();
    for (const game of games) {
      const gameModule = require(`../games/${game.name.toLowerCase()}`);
      if (gameModule[game.name]) {
        this.games[game.name.toLowerCase()] = new gameModule[game.name](
          game.name,
          game.description,
          game.type,
          game.options
        );
      } else {
        logger.warn(`Game ${game.name} not found in games directory.`);
      }
    }
    logger.info('Games loaded successfully.');
  } catch (error) {
    logger.error('Error loading games:', error);
    throw new Error(`Error loading games: ${error.message}`);
  }
};

const handleMessage = async (message) => {
  try {
    const gameSession = await GameSession.findOne({
      where: {
        gameId: message.channel.name,
        status: 'active',
        players: { [Op.contains]: [message.author.id] },
      },
    });

    if (gameSession) {
      const game = await Game.findOne({ where: { name: gameSession.gameId } });
      if (game) {
        await game.handleMessage(message, gameSession);
      } else {
        await message.reply(
          messageUtils.formatErrorMessage(
            'An error occurred while processing your request.'
          )
        );
      }
    }
  } catch (error) {
    console.error('Error handling message:', error);
    await message.reply(
      messageUtils.formatErrorMessage('An error occurred while processing your request.')
    );
  }
};

const handleInteraction = async (interaction) => {
  try {
    const gameSession = await GameSession.findOne({
      where: {
        id: interaction.message.id,
        status: 'active',
      },
    });

    if (gameSession) {
      const game = await Game.findOne({ where: { name: gameSession.gameId } });
      if (game) {
        await game.handleInteraction(interaction, gameSession);
      } else {
        await interaction.reply(
          messageUtils.formatErrorMessage(
            'An error occurred while processing your request.'
          )
        );
      }
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    await interaction.reply(
      messageUtils.formatErrorMessage('An error occurred while processing your request.')
    );
  }
};

const updateLeaderboard = async (gameSession) => {
  try {
    for (const [playerId, score] of Object.entries(gameSession.playerScores)) {
      const leaderboardEntry = await Leaderboard.findOne({
        where: { gameId: gameSession.gameId, userId: playerId },
      });
      if (leaderboardEntry) {
        await Leaderboard.update(
          { score },
          { where: { gameId: gameSession.gameId, userId: playerId } }
        );
      } else {
        await Leaderboard.create({
          gameId: gameSession.gameId,
          userId: playerId,
          score,
        });
      }
    }
  } catch (error) {
    console.error(`Error updating leaderboard: ${error.message}`);
    throw new Error(formatErrorMessage(`Error updating leaderboard: ${error.message}`));
  }
};

module.exports = {
  getGame,
  getAvailableGames,
  createGameSession,
  joinGameSession,
  leaveGameSession,
  loadGames,
  handleMessage,
  handleInteraction,
  updateLeaderboard,
};