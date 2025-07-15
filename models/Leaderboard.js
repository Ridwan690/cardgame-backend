const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Leaderboard = sequelize.define("Leaderboard", {
  id_leaderboard: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_siswa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Siswas", // Sesuaikan dengan nama tabel siswa kamu
      key: "id_siswa",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  id_level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Levels", // Sesuaikan dengan nama tabel level kamu
      key: "id_level",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Leaderboard;
