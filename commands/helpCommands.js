const { SlashCommandBuilder } = require('discord.js');
const messageUtils = require('../utils/messageUtils');
const commandHandler = require('../utils/commandHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with the bot commands'),
  async execute(interaction) {
    try {
      const helpMessage = commandHandler.getHelpMessage();
      await interaction.reply(messageUtils.formatInfoMessage(helpMessage));
    } catch (error) {
      console.error(error);
      await interaction.reply(
        messageUtils.formatErrorMessage(
          'An error occurred while fetching the help message.'
        )
      );
    }
  },
};