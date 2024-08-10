const { SlashCommandBuilder } = require('discord.js');
const leaderboardService = require('../services/leaderboardService');
const messageUtils = require('../utils/messageUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the leaderboard for a game')
    .addStringOption((option) =>
      option
        .setName('game')
        .setDescription('The name of the game')
        .setRequired(true)
    ),
  async execute(interaction) {
    const gameName = interaction.options.getString('game');

    try {
      const leaderboard = await leaderboardService.getLeaderboard(gameName);

      if (leaderboard.length === 0) {
        await interaction.reply(
          messageUtils.formatErrorMessage(
            `No leaderboard found for game: ${gameName}`
          )
        );
        return;
      }

      const leaderboardString = messageUtils.formatLeaderboard(leaderboard);

      await interaction.reply(leaderboardString);
    } catch (error) {
      console.error(error);
      await interaction.reply(
        messageUtils.formatErrorMessage(
          'An error occurred while fetching the leaderboard.'
        )
      );
    }
  },
};