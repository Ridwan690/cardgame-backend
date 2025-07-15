const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Kosakata = sequelize.define("Kosakata", {
  id_kata: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_kartu: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Kosakata;
