<h1 align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
  <br>discord-games-bot-expansion
</h1>
<h4 align="center">Versatile Discord bot to host and manage interactive games within Discord servers.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<p align="center">
  <img src="https://img.shields.io/badge/Language-TypeScript-blue" alt="Language: TypeScript">
  <img src="https://img.shields.io/badge/Framework-Discord.js-red" alt="Framework: Discord.js">
  <img src="https://img.shields.io/badge/Database-MySQL-blue" alt="Database: MySQL">
  <img src="https://img.shields.io/badge/Cache-Redis-black" alt="Cache: Redis">
</p>
<p align="center">
  <img src="https://img.shields.io/github/last-commit/spectra-ai-codegen/discord-games-bot-expansion?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/spectra-ai-codegen/discord-games-bot-expansion?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/spectra-ai-codegen/discord-games-bot-expansion?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</p>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
The repository contains a project called "discord-games-bot-expansion" that provides a comprehensive solution for creating an interactive Discord game bot. It leverages the power of TypeScript, Discord.js, MySQL, and Redis to deliver a rich and engaging gaming experience within Discord servers. 

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| ⚙️ | Architecture   | The codebase follows a modular architectural pattern, ensuring maintainability and scalability.              |
| 📄 | Documentation  | This README file provides a detailed overview of the project, its dependencies, and usage instructions.       |
| 🔗 | Dependencies   | The codebase relies on various external libraries and packages such as Discord.js, MySQL, Redis, and others. |
| 🧩 | Modularity     | The modular structure allows for easier maintenance and reusability of the code.                                |
| 🧪 | Testing        | Implement unit tests to ensure the reliability and robustness of the codebase.                                 |
| ⚡️  | Performance    | Performance is optimized through efficient code practices, database indexing, and caching.                 |
| 🔐 | Security       | Robust security measures are implemented to protect user data and prevent unauthorized access.              |
| 🔀 | Version Control| Utilizes Git for version control with GitHub Actions for automated build and release processes.            |
| 🔌 | Integrations   | Seamlessly integrates with the Discord API, utilizing its features for bot functionality.                |
| 📶 | Scalability    | The bot is designed to handle increased user load and data volume, ensuring a smooth experience.            |

## 📂 Structure

```
├── commands
│   ├── gameCommands.js
│   ├── adminCommands.js
│   ├── userCommands.js
│   ├── helpCommands.js
│   └── leaderboardCommands.js
├── events
│   ├── ready.js
│   ├── messageCreate.js
│   ├── guildMemberAdd.js
│   └── interactionCreate.js
├── games
│   ├── hangman.js
│   ├── trivia.js
│   ├── wordle.js
│   ├── cardGames.js
│   └── customGames.js
├── services
│   ├── gameService.js
│   ├── leaderboardService.js
│   ├── adminService.js
│   ├── userService.js
│   └── databaseService.js
├── utils
│   ├── commandHandler.js
│   ├── logger.js
│   ├── errorHandler.js
│   └── messageUtils.js
├── config
│   ├── config.js
│   └── databaseConfig.js
└── .env
    └── package.json
    └── README.md

```

## 💻 Installation
### 🔧 Prerequisites
- Node.js
- npm
- Docker

### 🚀 Setup Instructions
1. Clone the repository:
   - `git clone https://github.com/spectra-ai-codegen/discord-games-bot-expansion.git`
2. Navigate to the project directory:
   - `cd discord-games-bot-expansion`
3. Install dependencies:
   - `npm install`

## 🏗️ Usage
### 🏃‍♂️ Running the Project
1. Start the development server:
   - `npm start`
2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### ⚙️ Configuration
Adjust configuration settings in `config.js` or `.env`.

### 📚 Examples
- 📝 Example 1:  `/startgame hangman`:  Starts a hangman game.
- 📝 Example 2:  `/leaderboard trivia`:  Displays the leaderboard for the trivia game.
- 📝 Example 3:  `/addgame wordle`:  Adds the wordle game to the server's game library (admin command).

## 🌐 Hosting
### 🚀 Deployment Instructions
#### Using Docker
1. Build the Docker image:
   - `docker build -t discord-games-bot-expansion .`
2. Run the container:
   - `docker run -d -p 3000:3000 discord-games-bot-expansion`

#### Using a hosting platform
1. Create a new app on the hosting platform (e.g., Heroku, AWS).
2. Deploy the code using the hosting platform's instructions.

### 🔑 Environment Variables
- `DISCORD_TOKEN`: Your Discord bot token.
- `DB_HOST`: Database host.
- `DB_USER`: Database user.
- `DB_PASS`: Database password.

## 📜 API Documentation
### 🔍 Endpoints
- POST /api/games: Creates a new game.
- GET /api/games: Retrieves a list of games.
- POST /api/games/:gameId/start: Starts a game.
- POST /api/games/:gameId/join: Joins a game.
- POST /api/games/:gameId/leave: Leaves a game.
- GET /api/leaderboard/:gameId: Retrieves the leaderboard for a game.

### 🔒 Authentication
Use JWT tokens for authentication.

### 📝 Examples
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"name": "Hangman", "description": "Classic word guessing game.", "type": "word"}' \
  http://localhost:3000/api/games

curl -X GET http://localhost:3000/api/games
```

## 📜 License
This project is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/).

## 👥 Authors
- Author Name - [Spectra.codes](https://spectra.codes)
- Creator Name - [DRIX10](https://github.com/Drix10)

<p align="center">
  <h1 align="center">🌐 Spectra.Codes</h1>
</p>
<p align="center">
  <em>Why only generate Code? When you can generate the whole Repository!</em>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Developer-Drix10-red" alt="">
  <img src="https://img.shields.io/badge/Website-Spectra.codes-blue" alt="">
  <img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
  <img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4-black" alt="">
</p>