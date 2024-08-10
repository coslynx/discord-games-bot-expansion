const { Sequelize, DataTypes } = require('sequelize');
const { databaseConfig } = require('../config/databaseConfig');

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    dialect: 'mysql',
    logging: false,
  }
);

const Game = sequelize.define(
  'Game',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

const GameSession = sequelize.define(
  'GameSession',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Game,
        key: 'name',
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    players: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    playerScores: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

const Leaderboard = sequelize.define(
  'Leaderboard',
  {
    gameId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Game,
        key: 'name',
      },
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const disconnect = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

module.exports = {
  connect,
  disconnect,
  Game,
  User,
  GameSession,
  Leaderboard,
};