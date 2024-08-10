const { Message } = require('discord.js');
const commandHandler = require('../utils/commandHandler');
const gameService = require('../services/gameService');
const logger = require('../utils/logger');

module.exports = async (message) => {
  try {
    if (message instanceof Message) {
      if (message.content.startsWith('!')) {
        await commandHandler.handleCommand(message);
      } else if (message.content.startsWith('/')) {
        // Handle slash commands (if supported)
        // You might need to implement slash command handling separately.
      } else if (message.author.bot) {
        // Ignore messages from other bots
        return;
      } else {
        await gameService.handleMessage(message);
      }

      logger.info(`Message received: ${message.content}`);
    }
  } catch (error) {
    logger.error(error);
  }
};