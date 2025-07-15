const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Level = sequelize.define("Level", {
  id_level: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_level: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  card_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  time_limit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Level;
