const { SlashCommandBuilder } = require('discord.js');
const adminService = require('../services/adminService');
const messageUtils = require('../utils/messageUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin commands for managing the bot')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('addgame')
        .setDescription('Add a new game to the library')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the game')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('description')
            .setDescription('A brief description of the game')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('The type of game (e.g., word, trivia, card)')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('removegame')
        .setDescription('Remove a game from the library')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the game')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('setpermissions')
        .setDescription('Set permissions for a specific game')
        .addStringOption((option) =>
          option
            .setName('game')
            .setDescription('The name of the game')
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role that should have access')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    try {
      if (interaction.options.getSubcommand() === 'addgame') {
        const gameName = interaction.options.getString('name');
        const gameDescription = interaction.options.getString('description');
        const gameType = interaction.options.getString('type');

        await adminService.addGame(gameName, gameDescription, gameType);
        await interaction.reply(
          messageUtils.formatSuccessMessage(
            `Game ${gameName} added successfully!`
          )
        );
      } else if (interaction.options.getSubcommand() === 'removegame') {
        const gameName = interaction.options.getString('name');

        await adminService.removeGame(gameName);
        await interaction.reply(
          messageUtils.formatSuccessMessage(
            `Game ${gameName} removed successfully!`
          )
        );
      } else if (interaction.options.getSubcommand() === 'setpermissions') {
        const gameName = interaction.options.getString('game');
        const role = interaction.options.getRole('role');

        await adminService.setGamePermissions(gameName, role);
        await interaction.reply(
          messageUtils.formatSuccessMessage(
            `Permissions for ${gameName} updated successfully!`
          )
        );
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        messageUtils.formatErrorMessage(
          'An error occurred while processing your request.'
        )
      );
    }
  },
};