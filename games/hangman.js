const { Game, GameSession } = require('./gameService');
const { User } = require('../services/userService');
const { formatSuccessMessage, formatErrorMessage } = require('../utils/messageUtils');
const { shuffle } = require('../utils/utils');

class Hangman extends Game {
  constructor(name, description, type, options) {
    super(name, description, type);
    this.options = options;
    this.wordList = options.wordList || [];
  }

  async startGameSession(players) {
    try {
      const session = new GameSession(this, players);
      const word = this.wordList[Math.floor(Math.random()  this.wordList.length)];
      session.word = word;
      session.wordDisplay = Array(word.length).fill('_');
      session.remainingGuesses = this.options.maxGuesses || 6;
      session.guessedLetters = new Set();
      await session.save();
      return session;
    } catch (error) {
      throw new Error(`Error starting Hangman session: ${error.message}`);
    }
  }

  async handleInteraction(interaction, session) {
    try {
      if (interaction.customId === 'hangmanGuess') {
        const playerId = interaction.user.id;
        const guess = interaction.values[0].toLowerCase();
        if (session.guessedLetters.has(guess)) {
          await interaction.update({
            content: `You already guessed ${guess}!`,
          });
          return;
        }
        session.guessedLetters.add(guess);
        if (session.word.includes(guess)) {
          for (let i = 0; i < session.word.length; i++) {
            if (session.word[i] === guess) {
              session.wordDisplay[i] = guess;
            }
          }
          await interaction.update({
            content: `Correct! The word is: ${session.wordDisplay.join(' ')}`,
          });
          if (session.wordDisplay.join('') === session.word) {
            await interaction.followUp({
              content: `Congratulations, Player ${playerId} guessed the word!`,
            });
            await session.endGame(playerId);
          }
        } else {
          session.remainingGuesses--;
          await interaction.update({
            content: `Incorrect! You have ${session.remainingGuesses} guesses left.`,
          });
          if (session.remainingGuesses === 0) {
            await interaction.followUp({
              content: `You ran out of guesses! The word was: ${session.word}`,
            });
            await session.endGame();
          }
        }
        await session.save();
      }
    } catch (error) {
      throw new Error(`Error handling Hangman interaction: ${error.message}`);
    }
  }

  async askNextQuestion(interaction, session) {
    try {
      await interaction.update({
        content: `The word is: ${session.wordDisplay.join(' ')}\\nGuess a letter:`,
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 'PRIMARY',
                customId: 'hangmanGuess',
                label: 'Guess',
                options: Array.from('abcdefghijklmnopqrstuvwxyz')
                  .map((letter) => ({
                    label: letter,
                    value: letter,
                  }))
                  .filter((option) => !session.guessedLetters.has(option.value)),
                placeholder: 'Choose a letter',
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

async function createHangmanGame(name, description, type, options) {
  try {
    const game = new Hangman(name, description, type, options);
    await game.save();
    return game;
  } catch (error) {
    throw new Error(`Error creating Hangman game: ${error.message}`);
  }
}

async function getHangmanGame(name) {
  try {
    const game = await Game.findOne({ name });
    if (!game) {
      return null;
    }
    return game;
  } catch (error) {
    throw new Error(`Error getting Hangman game: ${error.message}`);
  }
}

module.exports = {
  Hangman,
  createHangmanGame,
  getHangmanGame,
};