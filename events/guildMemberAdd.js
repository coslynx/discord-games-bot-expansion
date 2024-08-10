const { GuildMember } = require('discord.js');
const messageUtils = require('../utils/messageUtils');
const logger = require('../utils/logger');

module.exports = async (member) => {
  try {
    if (member instanceof GuildMember) {
      const welcomeMessage = messageUtils.formatWelcomeMessage(member);
      await member.guild.channels.cache
        .find((channel) => channel.name === 'general')
        .send(welcomeMessage);
      logger.info(`New member joined: ${member.user.tag}`);
    }
  } catch (error) {
    logger.error(error);
  }
};