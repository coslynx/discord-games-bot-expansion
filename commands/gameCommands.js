const { SlashCommandBuilder } = require('discord.js');
const gameService = require('../services/gameService');
const userService = require('../services/userService');
const messageUtils = require('../utils/messageUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Commands for playing games')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('start')
        .setDescription('Start a game')
        .addStringOption((option) =>
          option
            .setName('game')
            .setDescription('The name of the game')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('join')
        .setDescription('Join an ongoing game')
        .addStringOption((option) =>
          option
            .setName('game')
            .setDescription('The name of the game')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('leave')
        .setDescription('Leave a game')
        .addStringOption((option) =>
          option
            .setName('game')
            .setDescription('The name of the game')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('List available games')
    ),
  async execute(interaction) {
    try {
      if (interaction.options.getSubcommand() === 'start') {
        const gameName = interaction.options.getString('game');
        const game = await gameService.getGame(gameName);

        if (!game) {
          await interaction.reply(
            messageUtils.formatErrorMessage(`Game ${gameName} not found!`)
          );
          return;
        }

        const user = await userService.getUser(interaction.user.id);

        const session = await gameService.createGameSession(game, user);

        await interaction.reply(
          messageUtils.formatSuccessMessage(
            `Game ${gameName} started successfully!`,
            session
          )
        );
      } else if (interaction.options.getSubcommand() === 'join') {
        const gameName = interaction.options.getString('game');
        const game = await gameService.getGame(gameName);

        if (!game) {
          await interaction.reply(
            messageUtils.formatErrorMessage(`Game ${gameName} not found!`)
          );
          return;
        }

        const user = await userService.getUser(interaction.user.id);

        const session = await gameService.joinGameSession(game, user);

        if (session) {
          await interaction.reply(
            messageUtils.formatSuccessMessage(`You joined game ${gameName}!`, session)
          );
        } else {
          await interaction.reply(
            messageUtils.formatErrorMessage(`Game ${gameName} is full!`)
          );
        }
      } else if (interaction.options.getSubcommand() === 'leave') {
        const gameName = interaction.options.getString('game');

        const user = await userService.getUser(interaction.user.id);

        const session = await gameService.leaveGameSession(gameName, user);

        if (session) {
          await interaction.reply(
            messageUtils.formatSuccessMessage(`You left game ${gameName}!`, session)
          );
        } else {
          await interaction.reply(
            messageUtils.formatErrorMessage(`You are not in game ${gameName}!`)
          );
        }
      } else if (interaction.options.getSubcommand() === 'list') {
        const games = await gameService.getAvailableGames();

        if (games.length === 0) {
          await interaction.reply(
            messageUtils.formatErrorMessage('No games available yet!')
          );
          return;
        }

        const gameList = messageUtils.formatGameList(games);

        await interaction.reply(gameList);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        messageUtils.formatErrorMessage('An error occurred while processing your request.')
      );
    }
  },
};