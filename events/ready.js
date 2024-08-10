const { Client, IntentsBitField } = require('discord.js');
const databaseService = require('../services/databaseService');
const gameService = require('../services/gameService');
const logger = require('../utils/logger');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

client.on('ready', async () => {
  try {
    logger.info(`Bot is ready! Logged in as ${client.user.tag}`);

    await databaseService.connect();
    logger.info('Database connected successfully');

    await gameService.loadGames();
    logger.info('Games loaded successfully');

    client.user.setActivity('Playing games!', { type: 'PLAYING' });
  } catch (error) {
    logger.error('Error during bot startup:', error);
    process.exit(1);
  }
});

client.login(process.env.DISCORD_TOKEN);