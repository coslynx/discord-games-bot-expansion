const { Game, GameSession } = require('./gameService');
const { User } = require('../services/userService');
const { formatSuccessMessage, formatErrorMessage } = require('../utils/messageUtils');
const { shuffle } = require('../utils/utils');

class CustomGame extends Game {
  constructor(name, description, type, options) {
    super(name, description, type);
    this.options = options;
  }

  async startGameSession(players) {
    try {
      const session = new GameSession(this, players);
      // Implement custom game logic here
      // Example: Shuffle players and assign roles
      const shuffledPlayers = shuffle(players);
      session.players = shuffledPlayers;
      await session.save();
      return session;
    } catch (error) {
      throw new Error(`Error starting custom game session: ${error.message}`);
    }
  }

  async handleInteraction(interaction, session) {
    try {
      // Implement custom game logic for interaction handling
      // Example: Process player actions based on interaction type
      if (interaction.customId === 'playerAction') {
        const playerId = interaction.user.id;
        const action = interaction.values[0];
        // ... Process player action based on 'action'
        await interaction.update({ content: `Player ${playerId} took action ${action}` });
      }
    } catch (error) {
      throw new Error(`Error handling custom game interaction: ${error.message}`);
    }
  }
}

async function createCustomGame(name, description, type, options) {
  try {
    const game = new CustomGame(name, description, type, options);
    await game.save();
    return game;
  } catch (error) {
    throw new Error(`Error creating custom game: ${error.message}`);
  }
}

async function getCustomGame(name) {
  try {
    const game = await Game.findOne({ name });
    if (!game) {
      return null;
    }
    return game;
  } catch (error) {
    throw new Error(`Error getting custom game: ${error.message}`);
  }
}

module.exports = {
  CustomGame,
  createCustomGame,
  getCustomGame,
};