const { SlashCommandBuilder } = require('discord.js');
const {
  formatErrorMessage,
  formatSuccessMessage,
  formatInfoMessage,
  formatGameList,
  formatProfile,
  formatWelcomeMessage,
  formatLeaderboard,
} = require('./messageUtils');
const gameCommands = require('./commands/gameCommands');
const adminCommands = require('./commands/adminCommands');
const userCommands = require('./commands/userCommands');
const helpCommands = require('./commands/helpCommands');
const leaderboardCommands = require('./commands/leaderboardCommands');

const commandHandlers = [
  gameCommands,
  adminCommands,
  userCommands,
  helpCommands,
  leaderboardCommands,
];

const getHelpMessage = () => {
  let helpMessage = 'Available Commands:\n';
  for (const commandHandler of commandHandlers) {
    helpMessage += `- ${commandHandler.data.name}: ${commandHandler.data.description}\n`;
  }
  return helpMessage;
};

const handleCommand = async (interaction) => {
  try {
    const commandHandler = commandHandlers.find(
      (handler) => handler.data.name === interaction.commandName
    );

    if (commandHandler) {
      await commandHandler.execute(interaction);
    } else {
      await interaction.reply(
        formatErrorMessage('Command not found. Please try again.')
      );
    }
  } catch (error) {
    console.error('Error handling command:', error);
    await interaction.reply(
      formatErrorMessage('An error occurred while processing your request.')
    );
  }
};

module.exports = {
  handleCommand,
  getHelpMessage,
};