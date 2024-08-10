const { SlashCommandBuilder } = require('discord.js');
const userService = require('../services/userService');
const messageUtils = require('../utils/messageUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View or update your profile'),
  async execute(interaction) {
    try {
      const user = await userService.getUser(interaction.user.id);

      if (interaction.options.getSubcommand() === 'view') {
        const profileMessage = messageUtils.formatProfile(user);
        await interaction.reply(profileMessage);
      } else if (interaction.options.getSubcommand() === 'update') {
        const newNickname = interaction.options.getString('nickname');
        const newBio = interaction.options.getString('bio');

        await userService.updateUser(interaction.user.id, newNickname, newBio);

        await interaction.reply(
          messageUtils.formatSuccessMessage('Profile updated successfully!')
        );
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        messageUtils.formatErrorMessage(
          'An error occurred while processing your profile request.'
        )
      );
    }
  },
};