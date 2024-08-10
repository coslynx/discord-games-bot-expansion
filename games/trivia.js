const { Game, GameSession } = require('./gameService');
const { User } = require('../services/userService');
const { formatSuccessMessage, formatErrorMessage } = require('../utils/messageUtils');
const { shuffle } = require('../utils/utils');

class Trivia extends Game {
  constructor(name, description, type, options) {
    super(name, description, type);
    this.options = options;
    this.questions = options.questions || [];
  }

  async startGameSession(players) {
    try {
      const session = new GameSession(this, players);
      session.questions = shuffle(this.questions);
      session.currentQuestionIndex = 0;
      await session.save();
      return session;
    } catch (error) {
      throw new Error(`Error starting Trivia session: ${error.message}`);
    }
  }

  async handleInteraction(interaction, session) {
    try {
      if (interaction.customId === 'triviaAnswer') {
        const playerId = interaction.user.id;
        const selectedAnswerIndex = interaction.values[0];
        const currentQuestion = session.questions[session.currentQuestionIndex];
        if (
          selectedAnswerIndex ===
          currentQuestion.correctAnswerIndex.toString()
        ) {
          await interaction.update({
            content: `Player ${playerId} answered correctly!`,
          });
          session.playerScores[playerId] =
            (session.playerScores[playerId] || 0) + 1;
          session.currentQuestionIndex++;
          if (session.currentQuestionIndex >= session.questions.length) {
            await session.endGame();
            await interaction.followUp({
              content: `Game over! Here are the final scores: ${Object.entries(
                session.playerScores
              )
                .map(([playerId, score]) => `${playerId}: ${score}`)
                .join(', ')}`,
            });
          } else {
            await this.askNextQuestion(interaction, session);
          }
        } else {
          await interaction.update({
            content: `Player ${playerId} answered incorrectly!`,
          });
          session.currentQuestionIndex++;
          if (session.currentQuestionIndex >= session.questions.length) {
            await session.endGame();
            await interaction.followUp({
              content: `Game over! Here are the final scores: ${Object.entries(
                session.playerScores
              )
                .map(([playerId, score]) => `${playerId}: ${score}`)
                .join(', ')}`,
            });
          } else {
            await this.askNextQuestion(interaction, session);
          }
        }
        await session.save();
      }
    } catch (error) {
      throw new Error(`Error handling Trivia interaction: ${error.message}`);
    }
  }

  async askNextQuestion(interaction, session) {
    try {
      const currentQuestion =
        session.questions[session.currentQuestionIndex];
      const questionMessage = `Question: ${currentQuestion.question}\n${currentQuestion.options
        .map((option, index) => `${index + 1}. ${option}`)
        .join('\n')}`;
      await interaction.update({
        content: questionMessage,
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 'PRIMARY',
                customId: 'triviaAnswer',
                label: 'Answer',
                options: currentQuestion.options.map((option, index) => ({
                  label: option,
                  value: index.toString(),
                })),
                placeholder: 'Choose an answer',
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Error asking next question: ${error.message}`);
    }
  }
}

async function createTriviaGame(name, description, type, options) {
  try {
    const game = new Trivia(name, description, type, options);
    await game.save();
    return game;
  } catch (error) {
    throw new Error(`Error creating Trivia game: ${error.message}`);
  }
}

async function getTriviaGame(name) {
  try {
    const game = await Game.findOne({ name });
    if (!game) {
      return null;
    }
    return game;
  } catch (error) {
    throw new Error(`Error getting Trivia game: ${error.message}`);
  }
}

module.exports = {
  Trivia,
  createTriviaGame,
  getTriviaGame,
};