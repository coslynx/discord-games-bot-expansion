const { Game, GameSession } = require('./gameService');
const { User } = require('../services/userService');
const { formatSuccessMessage, formatErrorMessage } = require('../utils/messageUtils');
const { shuffle } = require('../utils/utils');

class Wordle extends Game {
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
      await session.save();
      return session;
    } catch (error) {
      throw new Error(`Error starting Wordle session: ${error.message}`);
    }
  }

  async handleInteraction(interaction, session) {
    try {
      if (interaction.customId === 'wordleGuess') {
        const playerId = interaction.user.id;
        const guess = interaction.values[0];
        const result = this.evaluateGuess(guess, session.word);
        const formattedResult = this.formatGuessResult(result);
        await interaction.update({
          content: `Player ${playerId} guessed: ${guess}\n${formattedResult}`,
        });
        if (result.allCorrect) {
          await interaction.followUp({
            content: `Congratulations, Player ${playerId} guessed the word!`,
          });
          await session.endGame(playerId);
        }
      }
    } catch (error) {
      throw new Error(`Error handling Wordle interaction: ${error.message}`);
    }
  }

  evaluateGuess(guess, word) {
    const result = {
      allCorrect: false,
      letterStatuses: [],
    };
    if (guess.length !== word.length) {
      return result;
    }
    const wordLetters = word.split('');
    const guessLetters = guess.split('');
    const letterCounts = {};
    for (const letter of wordLetters) {
      if (letterCounts[letter]) {
        letterCounts[letter]++;
      } else {
        letterCounts[letter] = 1;
      }
    }
    for (let i = 0; i < guessLetters.length; i++) {
      const guessLetter = guessLetters[i];
      const wordLetter = wordLetters[i];
      if (guessLetter === wordLetter) {
        result.letterStatuses.push('correct');
        letterCounts[guessLetter]--;
      } else if (wordLetters.includes(guessLetter)) {
        if (letterCounts[guessLetter] > 0) {
          result.letterStatuses.push('present');
          letterCounts[guessLetter]--;
        } else {
          result.letterStatuses.push('absent');
        }
      } else {
        result.letterStatuses.push('absent');
      }
    }
    result.allCorrect = result.letterStatuses.every((status) => status === 'correct');
    return result;
  }

  formatGuessResult(result) {
    let formattedResult = '';
    for (let i = 0; i < result.letterStatuses.length; i++) {
      const status = result.letterStatuses[i];
      const letter = guess[i];
      switch (status) {
        case 'correct':
          formattedResult += `:green_square:`;
          break;
        case 'present':
          formattedResult += `:yellow_square:`;
          break;
        case 'absent':
          formattedResult += `:white_large_square:`;
          break;
        default:
          formattedResult += `:question:`;
      }
    }
    return formattedResult;
  }
}

async function createWordleGame(name, description, type, options) {
  try {
    const game = new Wordle(name, description, type, options);
    await game.save();
    return game;
  } catch (error) {
    throw new Error(`Error creating Wordle game: ${error.message}`);
  }
}

async function getWordleGame(name) {
  try {
    const game = await Game.findOne({ name });
    if (!game) {
      return null;
    }
    return game;
  } catch (error) {
    throw new Error(`Error getting Wordle game: ${error.message}`);
  }
}

module.exports = {
  Wordle,
  createWordleGame,
  getWordleGame,
};