const { MessageEmbed } = require('discord.js');

const formatErrorMessage = (message) => {
  return new MessageEmbed()
    .setColor('RED')
    .setTitle('Error')
    .setDescription(message);
};

const formatSuccessMessage = (message, data) => {
  const embed = new MessageEmbed()
    .setColor('GREEN')
    .setTitle('Success')
    .setDescription(message);

  if (data) {
    embed.addField('Data', JSON.stringify(data, null, 2));
  }

  return embed;
};

const formatInfoMessage = (message) => {
  return new MessageEmbed()
    .setColor('BLUE')
    .setTitle('Information')
    .setDescription(message);
};

const formatGameList = (games) => {
  let gameList = 'Available Games:\n';
  for (const game of games) {
    gameList += `- ${game.name}: ${game.description}\n`;
  }
  return gameList;
};

const formatProfile = (user) => {
  const embed = new MessageEmbed()
    .setColor('BLUE')
    .setTitle(`Profile for ${user.nickname || user.id}`);

  if (user.nickname) {
    embed.addField('Nickname', user.nickname);
  }
  if (user.bio) {
    embed.addField('Bio', user.bio);
  }

  return embed;
};

const formatWelcomeMessage = (member) => {
  return `Welcome to the server, ${member.user.tag}!`;
};

const formatLeaderboard = (leaderboard) => {
  let leaderboardString = 'Leaderboard:\n';
  for (let i = 0; i < leaderboard.length; i++) {
    const entry = leaderboard[i];
    leaderboardString += `${i + 1}. ${entry.userId}: ${entry.score}\n`;
  }
  return leaderboardString;
};

module.exports = {
  formatErrorMessage,
  formatSuccessMessage,
  formatInfoMessage,
  formatGameList,
  formatProfile,
  formatWelcomeMessage,
  formatLeaderboard,
};