const { formatErrorMessage } = require('./messageUtils');

const handleError = (error, interaction, ephemeral = true) => {
  console.error(error);
  interaction.reply({
    content: formatErrorMessage('An error occurred while processing your request.'),
    ephemeral,
  });
};

module.exports = {
  handleError,
};