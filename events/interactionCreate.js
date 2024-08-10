const { InteractionType } = require('discord.js');
const commandHandler = require('../utils/commandHandler');
const gameService = require('../services/gameService');
const logger = require('../utils/logger');

module.exports = async (interaction) => {
  try {
    if (interaction.type === InteractionType.ApplicationCommand) {
      await commandHandler.handleCommand(interaction);
    } else if (interaction.type === InteractionType.MessageComponent) {
      await gameService.handleInteraction(interaction);
    }
  } catch (error) {
    logger.error(error);
    await interaction.reply({
      content: 'An error occurred while processing your request.',
      ephemeral: true,
    });
  }
};